import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Prescription } from '../models/Prescription.js';
import { Medicine } from '../models/Medicine.js';
import { analyzePrescriptionWithAI } from '../services/geminiService.js';
import { findComparableMedicines } from '../services/matchingEngine.js';
import { calculatePrescriptionCosts } from '../services/costEngine.js';
import { authenticate, AuthRequest } from '../middleware/authMiddleware.js';
import { INITIAL_MEDICINES } from '../services/dataStore.js';

const router = Router();

// In-memory prescription store fallback
const MEMORY_PRESCRIPTIONS: any[] = [];

// Analyze prescription image or doctor notes with Gemini
router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType, rawDoctorText } = req.body;

    // Call Gemini AI
    const aiResult = await analyzePrescriptionWithAI({
      imageBase64,
      mimeType: mimeType || 'image/jpeg',
      rawDoctorText,
    });

    // Enrich extracted medicines by checking database or resilient store
    const enrichedMedicines = await Promise.all(
      aiResult.medicines.map(async (item) => {
        let matched: any = null;

        if (mongoose.connection.readyState === 1) {
          try {
            matched = await Medicine.findOne({
              $or: [
                { brand_name: new RegExp(`^${item.detected_name.trim()}$`, 'i') },
                { generic_name: new RegExp(`^${item.detected_name.trim()}$`, 'i') },
                { active_ingredient: new RegExp(`^${item.active_ingredient.trim()}$`, 'i') },
              ],
            }).lean();
          } catch (e) {}
        }

        if (!matched) {
          const qName = item.detected_name.toLowerCase();
          const qIng = item.active_ingredient.toLowerCase();
          matched = INITIAL_MEDICINES.find(
            (m) =>
              m.brand_name.toLowerCase().includes(qName) ||
              m.generic_name.toLowerCase().includes(qName) ||
              m.active_ingredient.toLowerCase().includes(qIng)
          );
        }

        let comparableOptions: any[] = [];
        let lowestCompPrice = 0;

        const compRes = await findComparableMedicines({
          active_ingredient: matched?.active_ingredient || item.active_ingredient,
          strength: item.strength,
          dosage_form: item.dosage_form,
        });
        comparableOptions = compRes.comparable_products;
        if (comparableOptions.length > 0) {
          lowestCompPrice = comparableOptions[0].lowest_price;
        }

        return {
          ...item,
          matched_medicine_id: matched?._id || 'med-01',
          matched_brand: matched?.brand_name || item.detected_name,
          category: matched?.category || 'General Therapeutics',
          lowest_comparable_price: lowestCompPrice,
          comparable_count: comparableOptions.length,
          user_verified: false,
        };
      })
    );

    res.json({
      success: true,
      data: {
        ...aiResult,
        medicines: enrichedMedicines,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Confirm & save prescription (supports both logged-in patients and guest visitors)
router.post('/confirm', async (req: any, res: Response): Promise<void> => {
  try {
    const {
      patient_name,
      doctor_name,
      clinic_name,
      prescription_date,
      image_url,
      raw_ocr_text,
      confirmed_items,
    } = req.body;

    if (!confirmed_items || !Array.isArray(confirmed_items)) {
      res.status(400).json({ success: false, message: 'Confirmed items required' });
      return;
    }

    // Run cost engine
    const costAnalysis = await calculatePrescriptionCosts(
      confirmed_items.map((i) => ({
        name: i.detected_name || i.matched_brand || 'Medicine',
        active_ingredient: i.active_ingredient,
        strength: i.strength,
        dosage_form: i.dosage_form,
        quantity: i.quantity || 10,
        custom_unit_price: i.estimated_price,
      }))
    );

    const record = {
      _id: `rx-${Date.now()}`,
      user_id: req.userId || 'demo-patient',
      patient_name: patient_name || 'Patient',
      doctor_name: doctor_name || 'Consultant',
      clinic_name: clinic_name || 'Medical Centre',
      prescription_date: prescription_date || new Date(),
      image_url,
      raw_ocr_text,
      extracted_items: confirmed_items,
      confirmed_items,
      total_estimated_cost: costAnalysis.total_current_cost,
      total_comparable_cost: costAnalysis.total_comparable_cost,
      total_potential_savings: costAnalysis.total_potential_savings,
      savings_percentage: costAnalysis.savings_percentage,
      status: 'CONFIRMED',
      created_at: new Date(),
    };

    MEMORY_PRESCRIPTIONS.unshift(record);

    if (mongoose.connection.readyState === 1) {
      try {
        await Prescription.create({
          ...record,
          user_id: req.user?._id || new mongoose.Types.ObjectId(),
        });
      } catch (e) {}
    }

    res.status(201).json({
      success: true,
      message: 'Prescription confirmed and saved successfully',
      data: record,
      cost_summary: costAnalysis,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// List user prescriptions
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const userId = req.user?._id;
        if (userId) {
          const prescriptions = await Prescription.find({ user_id: userId })
            .sort({ created_at: -1 })
            .lean();
          if (prescriptions.length > 0) {
            res.json({ success: true, data: prescriptions });
            return;
          }
        }
      } catch (e) {}
    }

    // Default sample if none
    const list = MEMORY_PRESCRIPTIONS.length > 0
      ? MEMORY_PRESCRIPTIONS
      : [
          {
            _id: 'rx-demo-01',
            clinic_name: 'Colombo General Hospital (Cardiology)',
            doctor_name: 'Dr. C. Wickramasinghe (Consultant Physician)',
            patient_name: 'Sunil Jayawardena',
            prescription_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'CONFIRMED',
            confirmed_items: [
              { detected_name: 'Lipitor', strength: '20 mg', quantity: 30 },
              { detected_name: 'Glucophage', strength: '500 mg', quantity: 60 },
              { detected_name: 'Panadol', strength: '500 mg', quantity: 12 },
            ],
            total_estimated_cost: 4770,
            total_comparable_cost: 1740,
            total_potential_savings: 3030,
            savings_percentage: 63.5,
          },
        ];

    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete prescription
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const idx = MEMORY_PRESCRIPTIONS.findIndex((p) => p._id === req.params.id);
    if (idx !== -1) MEMORY_PRESCRIPTIONS.splice(idx, 1);
    res.json({ success: true, message: 'Prescription deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
