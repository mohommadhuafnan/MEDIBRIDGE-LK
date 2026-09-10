import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Medicine } from '../models/Medicine.js';
import { MedicinePrice } from '../models/MedicinePrice.js';
import { findComparableMedicines } from '../services/matchingEngine.js';
import { explainMedicineToPatient } from '../services/geminiService.js';
import { authenticate, requireRole, AuthRequest } from '../middleware/authMiddleware.js';
import { INITIAL_MEDICINES, INITIAL_PRICES } from '../services/dataStore.js';

const router = Router();

// List medicines with search and filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, dosage_form } = req.query;

    if (mongoose.connection.readyState === 1) {
      try {
        const query: Record<string, any> = {};
        if (search) {
          const searchStr = String(search).trim();
          query.$or = [
            { brand_name: new RegExp(searchStr, 'i') },
            { generic_name: new RegExp(searchStr, 'i') },
            { active_ingredient: new RegExp(searchStr, 'i') },
          ];
        }
        if (category) query.category = new RegExp(String(category).trim(), 'i');
        if (dosage_form) query.dosage_form = new RegExp(String(dosage_form).trim(), 'i');

        const medicines = await Medicine.find(query).sort({ brand_name: 1 }).lean();
        const enriched = await Promise.all(
          medicines.map(async (med) => {
            const prices = await MedicinePrice.find({ medicine_id: med._id, effective_to: null }).lean();
            const nmra = prices.find((p) => p.price_type === 'NMRA_MRP');
            const lowest = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;
            return {
              ...med,
              current_prices: prices,
              nmra_mrp: nmra?.price,
              lowest_price: lowest,
              pharmacy_count: prices.filter((p) => p.price_type !== 'NMRA_MRP').length,
            };
          })
        );
        res.json({ success: true, data: enriched });
        return;
      } catch (e) {
        // Fallback below
      }
    }

    // Resilient dataStore fallback
    let items = [...INITIAL_MEDICINES];
    if (search) {
      const q = String(search).toLowerCase().trim();
      items = items.filter(
        (m) =>
          m.brand_name.toLowerCase().includes(q) ||
          m.generic_name.toLowerCase().includes(q) ||
          m.active_ingredient.toLowerCase().includes(q)
      );
    }
    if (category) {
      const cat = String(category).toLowerCase().trim();
      items = items.filter((m) => m.category.toLowerCase().includes(cat));
    }
    if (dosage_form) {
      const form = String(dosage_form).toLowerCase().trim();
      items = items.filter((m) => m.dosage_form.toLowerCase().includes(form));
    }

    const enriched = items.map((med) => {
      const prices = INITIAL_PRICES.filter((p) => p.medicine_id === med._id && p.effective_to === null);
      const nmra = prices.find((p) => p.price_type === 'NMRA_MRP');
      const lowest = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;
      return {
        ...med,
        current_prices: prices,
        nmra_mrp: nmra?.price,
        lowest_price: lowest,
        pharmacy_count: prices.filter((p) => p.price_type !== 'NMRA_MRP').length,
      };
    });

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Categories list
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const cats = Array.from(new Set(INITIAL_MEDICINES.map((m) => m.category)));
    res.json({ success: true, data: cats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Single medicine details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const medId = req.params.id;
    let medicine: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        medicine = await Medicine.findById(medId).lean();
      } catch (e) {}
    }

    if (!medicine) {
      medicine = INITIAL_MEDICINES.find((m) => m._id === medId);
    }

    if (!medicine) {
      res.status(404).json({ success: false, message: 'Medicine not found' });
      return;
    }

    const activePrices = INITIAL_PRICES.filter((p) => p.medicine_id === medId && p.effective_to === null);
    const historyPrices = INITIAL_PRICES.filter((p) => p.medicine_id === medId);

    const comparable = await findComparableMedicines({
      active_ingredient: medicine.active_ingredient,
      strength: medicine.strength,
      dosage_form: medicine.dosage_form,
      exclude_medicine_id: String(medicine._id),
      reference_price: activePrices.find((p) => p.price_type === 'NMRA_MRP')?.price,
    });

    res.json({
      success: true,
      data: {
        medicine,
        active_prices: activePrices,
        price_history: historyPrices,
        comparable_products: comparable.comparable_products,
        safety_advisory: comparable.safety_advisory,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Comparable products
router.get('/:id/comparable', async (req: Request, res: Response): Promise<void> => {
  try {
    const med = INITIAL_MEDICINES.find((m) => m._id === req.params.id);
    if (!med) {
      res.status(404).json({ success: false, message: 'Medicine not found' });
      return;
    }

    const result = await findComparableMedicines({
      active_ingredient: med.active_ingredient,
      strength: med.strength,
      dosage_form: med.dosage_form,
      exclude_medicine_id: med._id,
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Explain Medicine
router.post('/explain', async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand_name, active_ingredient } = req.body;
    const explanation = await explainMedicineToPatient(brand_name, active_ingredient);
    res.json({ success: true, data: explanation });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
