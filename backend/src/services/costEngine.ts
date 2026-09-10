import { findComparableMedicines } from './matchingEngine.js';

export interface PrescriptionCostInputItem {
  name: string;
  active_ingredient?: string;
  strength?: string;
  dosage_form?: string;
  quantity: number;
  custom_unit_price?: number;
}

export interface PrescriptionCostOutputItem {
  name: string;
  active_ingredient: string;
  strength: string;
  dosage_form: string;
  quantity: number;
  current_unit_price: number;
  current_total_price: number;
  comparable_name?: string;
  comparable_unit_price?: number;
  comparable_total_price?: number;
  item_savings_lkr: number;
  item_savings_percentage: number;
}

export interface PrescriptionCostSummary {
  items: PrescriptionCostOutputItem[];
  total_current_cost: number;
  total_comparable_cost: number;
  total_potential_savings: number;
  savings_percentage: number;
  disclaimer: string;
}

export async function calculatePrescriptionCosts(
  items: PrescriptionCostInputItem[]
): Promise<PrescriptionCostSummary> {
  const outputItems: PrescriptionCostOutputItem[] = [];
  let total_current_cost = 0;
  let total_comparable_cost = 0;

  for (const item of items) {
    const qty = Math.max(1, item.quantity || 1);
    let current_unit_price = item.custom_unit_price || 0;

    // Search for matches
    const matchRes = await findComparableMedicines({
      active_ingredient: item.active_ingredient,
      strength: item.strength,
      dosage_form: item.dosage_form,
    });

    let comparable_name: string | undefined;
    let comparable_unit_price: number | undefined;
    let comparable_total_price: number | undefined;

    if (matchRes.comparable_products.length > 0) {
      const topMatch = matchRes.comparable_products[0];
      const lowestProductPrice = topMatch.lowest_price;
      const packUnits = topMatch.medicine.pack_units || 10;
      const matchUnitPrice = lowestProductPrice > 0 ? lowestProductPrice / packUnits : 0;

      // If user hasn't supplied a unit price, take highest/MRP as reference
      if (current_unit_price === 0) {
        const highestPrice = topMatch.highest_price || topMatch.nmra_mrp || lowestProductPrice;
        current_unit_price = Math.round((highestPrice / packUnits) * 100) / 100;
      }

      if (matchUnitPrice > 0 && matchUnitPrice < current_unit_price) {
        comparable_name = `${topMatch.medicine.brand_name} (${topMatch.medicine.strength})`;
        comparable_unit_price = Math.round(matchUnitPrice * 100) / 100;
        comparable_total_price = Math.round(comparable_unit_price * qty * 100) / 100;
      }
    }

    const current_total_price = Math.round(current_unit_price * qty * 100) / 100;
    const itemCompTotal = comparable_total_price ?? current_total_price;
    const item_savings_lkr = Math.max(0, Math.round((current_total_price - itemCompTotal) * 100) / 100);
    const item_savings_percentage =
      current_total_price > 0 ? Math.round((item_savings_lkr / current_total_price) * 1000) / 10 : 0;

    total_current_cost += current_total_price;
    total_comparable_cost += itemCompTotal;

    outputItems.push({
      name: item.name,
      active_ingredient: item.active_ingredient || 'Not specified',
      strength: item.strength || '',
      dosage_form: item.dosage_form || 'Tablet',
      quantity: qty,
      current_unit_price,
      current_total_price,
      comparable_name,
      comparable_unit_price,
      comparable_total_price,
      item_savings_lkr,
      item_savings_percentage,
    });
  }

  total_current_cost = Math.round(total_current_cost * 100) / 100;
  total_comparable_cost = Math.round(total_comparable_cost * 100) / 100;
  const total_potential_savings = Math.max(
    0,
    Math.round((total_current_cost - total_comparable_cost) * 100) / 100
  );
  const savings_percentage =
    total_current_cost > 0
      ? Math.round((total_potential_savings / total_current_cost) * 1000) / 10
      : 0;

  return {
    items: outputItems,
    total_current_cost,
    total_comparable_cost,
    total_potential_savings,
    savings_percentage,
    disclaimer:
      'Potential savings are calculated from available verified NMRA and partner pharmacy price data and may differ from the actual pharmacy checkout price. Consult a qualified doctor or pharmacist before making any changes to your prescribed medicines.',
  };
}
