import mongoose from 'mongoose';
import { Medicine, IMedicine } from '../models/Medicine.js';
import { MedicinePrice, IMedicinePrice } from '../models/MedicinePrice.js';
import { INITIAL_MEDICINES, INITIAL_PRICES, MedicineRecord, PriceRecord } from './dataStore.js';

export interface ComparableMatchResult {
  source_medicine: any;
  comparable_products: Array<{
    medicine: any;
    current_prices: any[];
    lowest_price: number;
    highest_price: number;
    nmra_mrp?: number;
    price_difference_lkr: number;
    savings_percentage: number;
    is_lower_cost: boolean;
    comparison_label: string;
  }>;
  safety_advisory: string;
}

export async function findComparableMedicines(params: {
  active_ingredient?: string;
  strength?: string;
  dosage_form?: string;
  exclude_medicine_id?: string;
  reference_price?: number;
}): Promise<ComparableMatchResult> {
  const { active_ingredient, strength, dosage_form, exclude_medicine_id, reference_price } = params;

  const safety_advisory =
    'Consult a qualified doctor or pharmacist before changing your medicine or brand. MediBridge LK matches active ingredients and strengths according to NMRA database records for informational and affordability comparison only.';

  if (!active_ingredient) {
    return { source_medicine: null, comparable_products: [], safety_advisory };
  }

  const cleanIngredient = active_ingredient.trim().toLowerCase();

  // Try DB first if connected
  let matches: any[] = [];
  let pricesMap = new Map<string, any[]>();

  if (mongoose.connection.readyState === 1) {
    try {
      const query: Record<string, any> = {
        active_ingredient: new RegExp(`^${cleanIngredient}$`, 'i'),
      };
      if (strength) query.strength = new RegExp(strength.replace(/\s+/g, ''), 'i');
      if (dosage_form) query.dosage_form = new RegExp(dosage_form.trim().slice(0, 3), 'i');
      if (exclude_medicine_id) query._id = { $ne: exclude_medicine_id };

      matches = await Medicine.find(query).lean();
      for (const m of matches) {
        const p = await MedicinePrice.find({ medicine_id: m._id, effective_to: null }).lean();
        pricesMap.set(String(m._id), p);
      }
    } catch (err) {
      matches = [];
    }
  }

  // Fallback to dataStore if DB not connected or no records
  if (matches.length === 0) {
    matches = INITIAL_MEDICINES.filter((m) => {
      const ingMatch = m.active_ingredient.toLowerCase().includes(cleanIngredient) ||
        cleanIngredient.includes(m.active_ingredient.toLowerCase());
      const excludeMatch = exclude_medicine_id ? m._id !== exclude_medicine_id : true;
      return ingMatch && excludeMatch;
    });

    for (const m of matches) {
      const prices = INITIAL_PRICES.filter((p) => p.medicine_id === m._id && p.effective_to === null);
      pricesMap.set(m._id, prices);
    }
  }

  const results = matches.map((med) => {
    const prices = pricesMap.get(String(med._id)) || [];
    const validPrices = prices.map((p: any) => p.price).filter((p: any) => typeof p === 'number' && p > 0);
    const lowest_price = validPrices.length > 0 ? Math.min(...validPrices) : 0;
    const highest_price = validPrices.length > 0 ? Math.max(...validPrices) : 0;

    const nmraRecord = prices.find((p: any) => p.price_type === 'NMRA_MRP');
    const nmra_mrp = nmraRecord ? nmraRecord.price : undefined;

    const basePrice = reference_price || (nmra_mrp ?? highest_price);
    let price_difference_lkr = 0;
    let savings_percentage = 0;
    let is_lower_cost = false;

    if (basePrice > 0 && lowest_price > 0 && lowest_price < basePrice) {
      price_difference_lkr = Math.round((basePrice - lowest_price) * 100) / 100;
      savings_percentage = Math.round(((basePrice - lowest_price) / basePrice) * 1000) / 10;
      is_lower_cost = true;
    }

    const comparison_label = is_lower_cost
      ? 'Potential lower-cost option with matching medicine characteristics'
      : 'Potential comparable product with matching medicine characteristics';

    return {
      medicine: med,
      current_prices: prices,
      lowest_price,
      highest_price,
      nmra_mrp,
      price_difference_lkr,
      savings_percentage,
      is_lower_cost,
      comparison_label,
    };
  });

  results.sort((a, b) => (a.lowest_price || 999999) - (b.lowest_price || 999999));

  return {
    source_medicine: null,
    comparable_products: results,
    safety_advisory,
  };
}
