import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Pharmacy } from '../models/Pharmacy.js';
import { INITIAL_PHARMACIES, INITIAL_PRICES, INITIAL_MEDICINES } from '../services/dataStore.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { district, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      try {
        const query: Record<string, any> = {};
        if (district) query.district = new RegExp(String(district).trim(), 'i');
        if (search) {
          query.$or = [
            { name: new RegExp(String(search).trim(), 'i') },
            { chain: new RegExp(String(search).trim(), 'i') },
            { city: new RegExp(String(search).trim(), 'i') },
          ];
        }
        const data = await Pharmacy.find(query).lean();
        if (data.length > 0) {
          res.json({ success: true, data });
          return;
        }
      } catch (e) {}
    }

    let results = [...INITIAL_PHARMACIES];
    if (district) {
      const d = String(district).toLowerCase();
      results = results.filter((p) => p.district.toLowerCase().includes(d));
    }
    if (search) {
      const q = String(search).toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q));
    }

    res.json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const pharmacy = INITIAL_PHARMACIES.find((p) => p._id === req.params.id) || INITIAL_PHARMACIES[0];
    const prices = INITIAL_PRICES.filter(
      (p) => p.pharmacy_name.includes(pharmacy.chain) || p.pharmacy_name.includes(pharmacy.name)
    ).map((p) => ({
      ...p,
      medicine_id: INITIAL_MEDICINES.find((m) => m._id === p.medicine_id),
    }));

    res.json({
      success: true,
      data: {
        pharmacy,
        active_prices: prices,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
