import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  if (typeof (dns as any).setDefaultResultOrder === 'function') {
    (dns as any).setDefaultResultOrder('ipv4first');
  }
} catch (e) {}

dotenv.config();

import { User } from '../models/User.js';
import { Pharmacy } from '../models/Pharmacy.js';
import { Medicine } from '../models/Medicine.js';
import { MedicinePrice } from '../models/MedicinePrice.js';
import { SafetyAlert } from '../models/SafetyAlert.js';
import { Prescription } from '../models/Prescription.js';

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found');
    }

    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected. Cleaning collections...');

    await Promise.all([
      User.deleteMany({}),
      Pharmacy.deleteMany({}),
      Medicine.deleteMany({}),
      MedicinePrice.deleteMany({}),
      SafetyAlert.deleteMany({}),
      Prescription.deleteMany({}),
    ]);

    console.log('[Seed] Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('password123', salt);

    const [patientUser, pharmacistUser, adminUser] = await User.create([
      {
        email: 'patient@medibridge.lk',
        password_hash,
        full_name: 'Sunil Jayawardena',
        role: 'PATIENT',
        preferred_language: 'en',
        country: 'Sri Lanka',
        district: 'Colombo',
        city: 'Colombo 03',
        onboarding_completed: true,
      },
      {
        email: 'pharmacist@medibridge.lk',
        password_hash,
        full_name: 'Rajith Fernando (R.Ph)',
        role: 'PHARMACIST',
        preferred_language: 'en',
        country: 'Sri Lanka',
        district: 'Colombo',
        city: 'Colombo 07',
        onboarding_completed: true,
      },
      {
        email: 'admin@medibridge.lk',
        password_hash,
        full_name: 'Dr. Nirmal Perera (NMRA)',
        role: 'ADMIN',
        preferred_language: 'en',
        country: 'Sri Lanka',
        district: 'Colombo',
        city: 'Colombo 08',
        onboarding_completed: true,
      },
    ]);

    console.log('[Seed] Seeding Sri Lankan Pharmacies...');
    const pharmacies = await Pharmacy.create([
      {
        name: 'State Pharmaceuticals Corporation (Rajya Osu Sala)',
        chain: 'SPC Sri Lanka',
        license_number: 'NMRA/PH/COL-001',
        address: 'No. 255, Dharmapala Mawatha, Town Hall',
        district: 'Colombo',
        city: 'Colombo 07',
        phone: '+94 11 269 4965',
        email: 'osusala.townhall@spc.lk',
        website: 'https://spc.lk',
        verified: true,
        provides_api: true,
        opening_hours: '24 Hours Open',
      },
      {
        name: 'Healthguard Pharmacy (Bambalapitiya)',
        chain: 'Healthguard (Sunshine Holdings)',
        license_number: 'NMRA/PH/COL-042',
        address: 'No. 502, Galle Road, Bambalapitiya',
        district: 'Colombo',
        city: 'Colombo 04',
        phone: '+94 11 470 1200',
        email: 'support@healthguard.lk',
        website: 'https://healthguard.lk',
        verified: true,
        provides_api: true,
        opening_hours: '7:30 AM - 11:00 PM',
      },
      {
        name: 'Nawaloka Medicare Pharmacy',
        chain: 'Nawaloka Hospitals',
        license_number: 'NMRA/PH/COL-088',
        address: 'No. 23, Deshamanya H.K. Dharmadasa Mawatha',
        district: 'Colombo',
        city: 'Colombo 02',
        phone: '+94 11 557 7111',
        email: 'pharmacy@nawaloka.com',
        website: 'https://nawaloka.com',
        verified: true,
        provides_api: false,
        opening_hours: '24 Hours Open',
      },
      {
        name: 'Asiri Central Pharmacy',
        chain: 'Asiri Health',
        license_number: 'NMRA/PH/COL-114',
        address: 'No. 114, Norris Canal Road',
        district: 'Colombo',
        city: 'Colombo 10',
        phone: '+94 11 466 5500',
        email: 'pharmacy@asiri.lk',
        website: 'https://asirihealth.com',
        verified: true,
        provides_api: true,
        opening_hours: '24 Hours Open',
      },
      {
        name: 'Rajya Osu Sala (Kandy City)',
        chain: 'SPC Sri Lanka',
        license_number: 'NMRA/PH/KDY-012',
        address: 'No. 82, Dalada Veediya',
        district: 'Kandy',
        city: 'Kandy',
        phone: '+94 81 222 3450',
        email: 'osusala.kandy@spc.lk',
        verified: true,
        provides_api: true,
        opening_hours: '8:00 AM - 9:00 PM',
      },
    ]);

    console.log('[Seed] Seeding Sri Lankan Medicines...');
    const medicinesData = [
      // 1. Paracetamol 500mg (Panadol)
      {
        brand_name: 'Panadol',
        generic_name: 'Paracetamol',
        active_ingredient: 'Paracetamol',
        strength: '500 mg',
        strength_value: 500,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'GlaxoSmithKline (GSK) Sri Lanka',
        pack_size: '10 Tablets (Strip)',
        pack_units: 10,
        country: 'Sri Lanka',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-0491',
        category: 'Analgesics & Antipyretics',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Panadol is a common pain reliever and fever reducer containing Paracetamol.',
          common_uses: ['Headaches and migraines', 'Fever and body aches', 'Toothaches and mild muscle pain'],
          important_info: 'Take 1 to 2 tablets every 4 to 6 hours as needed. Do not exceed 8 tablets (4000 mg) in 24 hours.',
          precautions: [
            'Do not combine with other cold or flu medicines that also contain Paracetamol.',
            'Excessive use can cause severe liver injury.',
            'Consult your doctor if fever lasts more than 3 days.',
          ],
        },
      },
      // 2. Paracetamol 500mg (ParaLanka SPC)
      {
        brand_name: 'ParaLanka (SPC Generic)',
        generic_name: 'Paracetamol',
        active_ingredient: 'Paracetamol',
        strength: '500 mg',
        strength_value: 500,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
        pack_size: '10 Tablets (Strip)',
        pack_units: 10,
        country: 'Sri Lanka',
        regulatory_status: 'NMRA_VERIFIED',
        nmra_reg_no: 'NMRA-SPMC-0012',
        category: 'Analgesics & Antipyretics',
        source: 'SPMC Ratmalana / NMRA',
        verified: true,
        patient_explanation: {
          what_is_it: 'ParaLanka is the state-manufactured generic Paracetamol tablet produced in Ratmalana, Sri Lanka.',
          common_uses: ['Fever reduction', 'Mild to moderate body pain', 'Headache relief'],
          important_info: 'Exact bioequivalent active ingredient (Paracetamol 500mg) at public-sector subsidized pricing.',
          precautions: ['Do not exceed 8 tablets daily.', 'Avoid alcohol consumption while taking this medicine.'],
        },
      },
      // 3. Paracetamol 500mg (Calpol)
      {
        brand_name: 'Calpol 500',
        generic_name: 'Paracetamol',
        active_ingredient: 'Paracetamol',
        strength: '500 mg',
        strength_value: 500,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'GlaxoSmithKline Pharmaceuticals',
        pack_size: '10 Tablets (Strip)',
        pack_units: 10,
        country: 'India / Sri Lanka',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-1092',
        category: 'Analgesics & Antipyretics',
        source: 'NMRA Database',
        verified: true,
        patient_explanation: {
          what_is_it: 'Calpol 500 is a fast-acting Paracetamol tablet used to relieve fever and pain.',
          common_uses: ['Fever', 'Sore throat pain', 'Post-vaccination pain'],
          important_info: 'Take with or without food with water.',
          precautions: ['Check other medications for Paracetamol content.'],
        },
      },

      // 4. Amoxicillin 500mg (Amoxil)
      {
        brand_name: 'Amoxil 500',
        generic_name: 'Amoxicillin',
        active_ingredient: 'Amoxicillin',
        strength: '500 mg',
        strength_value: 500,
        strength_unit: 'mg',
        dosage_form: 'Capsule',
        manufacturer: 'GlaxoSmithKline (GSK)',
        pack_size: '10 Capsules',
        pack_units: 10,
        country: 'United Kingdom',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-0211',
        category: 'Antibiotics',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Amoxil is an original brand penicillin-type antibiotic used to treat bacterial infections.',
          common_uses: ['Chest infections (bronchitis, pneumonia)', 'Throat and ear infections', 'Urinary tract infections'],
          important_info: 'Complete the entire prescribed course even if symptoms disappear after a few days.',
          precautions: [
            'Do not take if you have a known allergy to penicillin.',
            'Does not work against viral infections like common cold or flu.',
          ],
        },
      },
      // 5. Amoxicillin 500mg (Moxypen / Generic SPC)
      {
        brand_name: 'Amoxicillin SPMC',
        generic_name: 'Amoxicillin',
        active_ingredient: 'Amoxicillin',
        strength: '500 mg',
        strength_value: 500,
        strength_unit: 'mg',
        dosage_form: 'Capsule',
        manufacturer: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
        pack_size: '10 Capsules',
        pack_units: 10,
        country: 'Sri Lanka',
        regulatory_status: 'NMRA_VERIFIED',
        nmra_reg_no: 'NMRA-SPMC-0044',
        category: 'Antibiotics',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Certified generic Amoxicillin capsule containing identical 500 mg active ingredient.',
          common_uses: ['Bacterial respiratory infections', 'Skin infections', 'Dental infections'],
          important_info: 'Take with food to minimize stomach upset. Complete full regimen.',
          precautions: ['Stop immediately and seek emergency care if allergic rash or facial swelling develops.'],
        },
      },

      // 6. Atorvastatin 20mg (Lipitor)
      {
        brand_name: 'Lipitor 20',
        generic_name: 'Atorvastatin',
        active_ingredient: 'Atorvastatin',
        strength: '20 mg',
        strength_value: 20,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'Pfizer Pharmaceuticals',
        pack_size: '30 Tablets',
        pack_units: 30,
        country: 'Ireland',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-3312',
        category: 'Cardiovascular & Cholesterol',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Lipitor is a statin medication that lowers bad cholesterol (LDL) and triglycerides in blood.',
          common_uses: ['Preventing heart attacks and strokes', 'Hypercholesterolemia management'],
          important_info: 'Usually taken once daily at bedtime with or without food.',
          precautions: [
            'Notify doctor immediately if you experience unexplained muscle pain, tenderness, or weakness.',
            'Avoid consuming large quantities of grapefruit juice.',
          ],
        },
      },
      // 7. Atorvastatin 20mg (Atorva)
      {
        brand_name: 'Atorva 20',
        generic_name: 'Atorvastatin',
        active_ingredient: 'Atorvastatin',
        strength: '20 mg',
        strength_value: 20,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'Zydus Cadila',
        pack_size: '30 Tablets',
        pack_units: 30,
        country: 'India',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-4105',
        category: 'Cardiovascular & Cholesterol',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Atorva 20 is an NMRA-approved bioequivalent generic of Atorvastatin.',
          common_uses: ['Lowering high cholesterol', 'Cardiovascular risk reduction'],
          important_info: 'Takes several weeks of consistent usage to reach full lipid-lowering efficacy.',
          precautions: ['Periodic liver enzyme monitoring may be advised by your physician.'],
        },
      },
      // 8. Atorvastatin 20mg (Storvas)
      {
        brand_name: 'Storvas 20',
        generic_name: 'Atorvastatin',
        active_ingredient: 'Atorvastatin',
        strength: '20 mg',
        strength_value: 20,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'Sun Pharmaceutical Industries',
        pack_size: '30 Tablets',
        pack_units: 30,
        country: 'India',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-2201',
        category: 'Cardiovascular & Cholesterol',
        source: 'NMRA Gazette',
        verified: true,
        patient_explanation: {
          what_is_it: 'Storvas 20 contains 20mg of Atorvastatin calcium.',
          common_uses: ['Atherosclerosis prevention', 'Cholesterol management'],
          important_info: 'Take regularly at the same time each day.',
          precautions: ['Do not stop taking without consulting your physician.'],
        },
      },

      // 9. Metformin 500mg (Glucophage)
      {
        brand_name: 'Glucophage 500',
        generic_name: 'Metformin Hydrochloride',
        active_ingredient: 'Metformin',
        strength: '500 mg',
        strength_value: 500,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'Merck Healthcare',
        pack_size: '100 Tablets',
        pack_units: 100,
        country: 'France',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-0814',
        category: 'Antidiabetics',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Glucophage is the leading brand of Metformin used to manage Type 2 Diabetes.',
          common_uses: ['Controlling blood sugar in Type 2 diabetes', 'PCOS insulin sensitivity'],
          important_info: 'Always take with or directly after a meal to reduce nausea and stomach upset.',
          precautions: ['Stay well hydrated.', 'Do not skip meals.'],
        },
      },
      // 10. Metformin 500mg (Formin / SPMC Generic)
      {
        brand_name: 'Metformin SPMC 500',
        generic_name: 'Metformin Hydrochloride',
        active_ingredient: 'Metformin',
        strength: '500 mg',
        strength_value: 500,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
        pack_size: '100 Tablets',
        pack_units: 100,
        country: 'Sri Lanka',
        regulatory_status: 'NMRA_VERIFIED',
        nmra_reg_no: 'NMRA-SPMC-0028',
        category: 'Antidiabetics',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'National generic Metformin manufactured locally under strict quality standards.',
          common_uses: ['Type 2 diabetes glycemic control'],
          important_info: 'Identical 500mg active molecule providing high affordability for lifelong diabetes care.',
          precautions: ['Inform your doctor before any X-ray scan involving contrast dye.'],
        },
      },

      // 11. Losartan Potassium 50mg (Cozaar)
      {
        brand_name: 'Cozaar 50',
        generic_name: 'Losartan Potassium',
        active_ingredient: 'Losartan Potassium',
        strength: '50 mg',
        strength_value: 50,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'Organon / Merck',
        pack_size: '30 Tablets',
        pack_units: 30,
        country: 'United Kingdom',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-1930',
        category: 'Antihypertensives',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Cozaar is an Angiotensin II Receptor Blocker (ARB) used to lower high blood pressure.',
          common_uses: ['Hypertension management', 'Protecting kidney function in diabetic patients'],
          important_info: 'Can be taken with or without food. Check blood pressure regularly.',
          precautions: ['Do not take if pregnant.', 'May cause lightheadedness when standing up quickly.'],
        },
      },
      // 12. Losartan Potassium 50mg (Losar SPMC)
      {
        brand_name: 'Losartan SPMC 50',
        generic_name: 'Losartan Potassium',
        active_ingredient: 'Losartan Potassium',
        strength: '50 mg',
        strength_value: 50,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
        pack_size: '30 Tablets',
        pack_units: 30,
        country: 'Sri Lanka',
        regulatory_status: 'NMRA_VERIFIED',
        nmra_reg_no: 'NMRA-SPMC-0072',
        category: 'Antihypertensives',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Locally manufactured generic Losartan Potassium 50mg.',
          common_uses: ['High blood pressure treatment', 'Cardiac health maintenance'],
          important_info: 'Take once daily at the same hour.',
          precautions: ['Consult your physician for dosage adjustments.'],
        },
      },

      // 13. Omeprazole 20mg (Losec)
      {
        brand_name: 'Losec 20',
        generic_name: 'Omeprazole',
        active_ingredient: 'Omeprazole',
        strength: '20 mg',
        strength_value: 20,
        strength_unit: 'mg',
        dosage_form: 'Capsule',
        manufacturer: 'AstraZeneca',
        pack_size: '14 Capsules',
        pack_units: 14,
        country: 'Sweden',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-0105',
        category: 'Gastrointestinal & Antacids',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Losec is a proton pump inhibitor (PPI) that decreases the amount of acid produced in the stomach.',
          common_uses: ['Gastric ulcers', 'Acid reflux (GERD)', 'Stomach protection during antibiotic or NSAID therapy'],
          important_info: 'Swallow whole with water 30 to 60 minutes before morning breakfast. Do not crush or chew.',
          precautions: ['Long-term daily use should be reviewed regularly by your doctor.'],
        },
      },
      // 14. Omeprazole 20mg (Omez)
      {
        brand_name: 'Omez 20',
        generic_name: 'Omeprazole',
        active_ingredient: 'Omeprazole',
        strength: '20 mg',
        strength_value: 20,
        strength_unit: 'mg',
        dosage_form: 'Capsule',
        manufacturer: "Dr. Reddy's Laboratories",
        pack_size: '14 Capsules',
        pack_units: 14,
        country: 'India',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-1550',
        category: 'Gastrointestinal & Antacids',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Omez is a widely trusted, affordable generic Omeprazole capsule for stomach acidity relief.',
          common_uses: ['Heartburn', 'Gastric hyperacidity', 'Peptic ulcer prevention'],
          important_info: 'Take once daily before food.',
          precautions: ['Keep in a cool, moisture-free place.'],
        },
      },

      // 15. Cetirizine 10mg (Zyrtec)
      {
        brand_name: 'Zyrtec 10',
        generic_name: 'Cetirizine Hydrochloride',
        active_ingredient: 'Cetirizine',
        strength: '10 mg',
        strength_value: 10,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'UCB Pharma / GSK',
        pack_size: '10 Tablets',
        pack_units: 10,
        country: 'Belgium',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-0622',
        category: 'Antihistamines & Allergy',
        source: 'NMRA Gazette',
        verified: true,
        patient_explanation: {
          what_is_it: 'Zyrtec is an antihistamine that reduces the effects of natural histamine in allergic reactions.',
          common_uses: ['Hay fever and allergic rhinitis', 'Sneezing, runny nose and itchy eyes', 'Hives and skin allergies'],
          important_info: 'Usually taken once daily in the evening.',
          precautions: ['May cause mild drowsiness in some individuals. Exercise caution when driving.'],
        },
      },
      // 16. Cetirizine 10mg (Cetzine)
      {
        brand_name: 'Cetzine 10',
        generic_name: 'Cetirizine Hydrochloride',
        active_ingredient: 'Cetirizine',
        strength: '10 mg',
        strength_value: 10,
        strength_unit: 'mg',
        dosage_form: 'Tablet',
        manufacturer: 'Dr. Reddy’s Laboratories',
        pack_size: '10 Tablets',
        pack_units: 10,
        country: 'India',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-1892',
        category: 'Antihistamines & Allergy',
        source: 'NMRA Gazette',
        verified: true,
        patient_explanation: {
          what_is_it: 'High-quality generic Cetirizine 10mg providing fast allergy relief.',
          common_uses: ['Allergic rhinitis', 'Skin itching and hives'],
          important_info: 'Take 1 tablet daily with water.',
          precautions: ['Avoid alcohol intake.'],
        },
      },
      // 17. Salbutamol 100mcg Inhaler (Ventolin)
      {
        brand_name: 'Ventolin Evohaler 100mcg',
        generic_name: 'Salbutamol',
        active_ingredient: 'Salbutamol',
        strength: '100 mcg/dose',
        strength_value: 100,
        strength_unit: 'mcg',
        dosage_form: 'Inhaler',
        manufacturer: 'Glaxo Wellcome / GSK',
        pack_size: '200 Doses Canister',
        pack_units: 200,
        country: 'France',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-0033',
        category: 'Respiratory',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Ventolin is a fast-acting bronchodilator reliever inhaler for asthma and wheezing.',
          common_uses: ['Relieving sudden shortness of breath and wheezing', 'Exercise-induced bronchospasm'],
          important_info: '1 to 2 puffs when experiencing acute wheezing. Rinse mouth after use.',
          precautions: ['If needing more than 3-4 times a day, seek medical review immediately.'],
        },
      },
      // 18. Salbutamol Inhaler (Asthalin)
      {
        brand_name: 'Asthalin 100 Inhaler',
        generic_name: 'Salbutamol',
        active_ingredient: 'Salbutamol',
        strength: '100 mcg/dose',
        strength_value: 100,
        strength_unit: 'mcg',
        dosage_form: 'Inhaler',
        manufacturer: 'Cipla Limited',
        pack_size: '200 Doses Canister',
        pack_units: 200,
        country: 'India',
        regulatory_status: 'NMRA_REGISTERED',
        nmra_reg_no: 'NMRA-DR-0988',
        category: 'Respiratory',
        source: 'NMRA Gazette 2341/39',
        verified: true,
        patient_explanation: {
          what_is_it: 'Cost-effective generic Salbutamol aerosol inhaler by Cipla.',
          common_uses: ['Bronchospasm relief', 'Asthma symptom management'],
          important_info: 'Shake well before each actuation.',
          precautions: ['Keep away from direct heat and sunlight.'],
        },
      },
    ];

    const createdMedicines = await Medicine.create(medicinesData);
    console.log(`[Seed] Created ${createdMedicines.length} Medicines.`);

    console.log('[Seed] Seeding Prices with Historical Revisions (Never overwriting!)...');

    const medMap = new Map<string, any>();
    createdMedicines.forEach((m) => medMap.set(m.brand_name, m));

    const pastDate6Months = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    const pastDate3Months = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const nowDate = new Date();

    const priceSeedRecords: any[] = [];

    // 1. Panadol historical revision demo
    const panadol = medMap.get('Panadol');
    if (panadol) {
      // Historical price from 6 months ago (closed 3 months ago)
      priceSeedRecords.push({
        medicine_id: panadol._id,
        pharmacy_name: 'NMRA Sri Lanka Gazette',
        price: 38.0,
        unit_price: 3.8,
        price_type: 'NMRA_MRP',
        effective_from: pastDate6Months,
        effective_to: pastDate3Months, // closed
        source: 'Gazette Extraordinary 2291/44',
      });
      // Current active NMRA MRP
      priceSeedRecords.push({
        medicine_id: panadol._id,
        pharmacy_name: 'NMRA Sri Lanka Gazette',
        price: 45.0,
        unit_price: 4.5,
        price_type: 'NMRA_MRP',
        effective_from: pastDate3Months,
        effective_to: null, // active
        source: 'Gazette Extraordinary 2341/39',
      });
      // Healthguard selling price
      priceSeedRecords.push({
        medicine_id: panadol._id,
        pharmacy_id: pharmacies[1]._id,
        pharmacy_name: 'Healthguard Pharmacy (Bambalapitiya)',
        price: 44.5,
        unit_price: 4.45,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'Healthguard POS Integration',
        availability: 'IN_STOCK',
      });
      // Asiri Central selling price
      priceSeedRecords.push({
        medicine_id: panadol._id,
        pharmacy_id: pharmacies[3]._id,
        pharmacy_name: 'Asiri Central Pharmacy',
        price: 45.0,
        unit_price: 4.5,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'Asiri Pharmacy System',
        availability: 'IN_STOCK',
      });
    }

    // 2. ParaLanka SPC (lower-cost comparable)
    const paraLanka = medMap.get('ParaLanka (SPC Generic)');
    if (paraLanka) {
      priceSeedRecords.push({
        medicine_id: paraLanka._id,
        pharmacy_id: pharmacies[0]._id,
        pharmacy_name: 'State Pharmaceuticals Corporation (Rajya Osu Sala)',
        price: 22.0,
        unit_price: 2.2,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'SPC Rajya Osu Sala Retail Price List',
        availability: 'IN_STOCK',
      });
      priceSeedRecords.push({
        medicine_id: paraLanka._id,
        pharmacy_name: 'NMRA Sri Lanka Gazette',
        price: 25.0,
        unit_price: 2.5,
        price_type: 'NMRA_MRP',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'NMRA Gazette 2341/39',
      });
    }

    // 3. Calpol
    const calpol = medMap.get('Calpol 500');
    if (calpol) {
      priceSeedRecords.push({
        medicine_id: calpol._id,
        pharmacy_id: pharmacies[2]._id,
        pharmacy_name: 'Nawaloka Medicare Pharmacy',
        price: 36.0,
        unit_price: 3.6,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'Nawaloka POS Feed',
        availability: 'IN_STOCK',
      });
    }

    // 4. Amoxil 500 vs Amoxicillin SPMC
    const amoxil = medMap.get('Amoxil 500');
    if (amoxil) {
      priceSeedRecords.push({
        medicine_id: amoxil._id,
        pharmacy_name: 'NMRA Sri Lanka Gazette',
        price: 480.0,
        unit_price: 48.0,
        price_type: 'NMRA_MRP',
        effective_from: pastDate6Months,
        effective_to: null,
        source: 'NMRA Gazette 2341/39',
      });
      priceSeedRecords.push({
        medicine_id: amoxil._id,
        pharmacy_id: pharmacies[1]._id,
        pharmacy_name: 'Healthguard Pharmacy (Bambalapitiya)',
        price: 470.0,
        unit_price: 47.0,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'Healthguard POS Integration',
        availability: 'IN_STOCK',
      });
    }

    const amoxilSpmc = medMap.get('Amoxicillin SPMC');
    if (amoxilSpmc) {
      priceSeedRecords.push({
        medicine_id: amoxilSpmc._id,
        pharmacy_id: pharmacies[0]._id,
        pharmacy_name: 'State Pharmaceuticals Corporation (Rajya Osu Sala)',
        price: 240.0,
        unit_price: 24.0,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'SPC Rajya Osu Sala Price List',
        availability: 'IN_STOCK',
      });
    }

    // 5. Lipitor 20 (Pfizer) vs Atorva 20 vs Storvas 20
    const lipitor = medMap.get('Lipitor 20');
    if (lipitor) {
      priceSeedRecords.push({
        medicine_id: lipitor._id,
        pharmacy_name: 'NMRA Sri Lanka Gazette',
        price: 3600.0,
        unit_price: 120.0,
        price_type: 'NMRA_MRP',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'NMRA Gazette 2341/39',
      });
      priceSeedRecords.push({
        medicine_id: lipitor._id,
        pharmacy_id: pharmacies[1]._id,
        pharmacy_name: 'Healthguard Pharmacy (Bambalapitiya)',
        price: 3450.0,
        unit_price: 115.0,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'Healthguard POS Integration',
        availability: 'IN_STOCK',
      });
    }

    const atorva = medMap.get('Atorva 20');
    if (atorva) {
      priceSeedRecords.push({
        medicine_id: atorva._id,
        pharmacy_id: pharmacies[2]._id,
        pharmacy_name: 'Nawaloka Medicare Pharmacy',
        price: 1650.0,
        unit_price: 55.0,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'Nawaloka Pharmacy Feed',
        availability: 'IN_STOCK',
      });
    }

    const storvas = medMap.get('Storvas 20');
    if (storvas) {
      priceSeedRecords.push({
        medicine_id: storvas._id,
        pharmacy_id: pharmacies[0]._id,
        pharmacy_name: 'State Pharmaceuticals Corporation (Rajya Osu Sala)',
        price: 1350.0,
        unit_price: 45.0,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'SPC Retail Price Master',
        availability: 'IN_STOCK',
      });
    }

    // 6. Glucophage 500 vs Metformin SPMC 500
    const glucophage = medMap.get('Glucophage 500');
    if (glucophage) {
      priceSeedRecords.push({
        medicine_id: glucophage._id,
        pharmacy_name: 'NMRA Sri Lanka Gazette',
        price: 1950.0,
        unit_price: 19.5,
        price_type: 'NMRA_MRP',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'NMRA Gazette 2341/39',
      });
    }

    const metforminSpmc = medMap.get('Metformin SPMC 500');
    if (metforminSpmc) {
      priceSeedRecords.push({
        medicine_id: metforminSpmc._id,
        pharmacy_id: pharmacies[0]._id,
        pharmacy_name: 'State Pharmaceuticals Corporation (Rajya Osu Sala)',
        price: 650.0,
        unit_price: 6.5,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'SPC Price Gazette',
        availability: 'IN_STOCK',
      });
    }

    // 7. Losec 20 vs Omez 20
    const losec = medMap.get('Losec 20');
    if (losec) {
      priceSeedRecords.push({
        medicine_id: losec._id,
        pharmacy_name: 'NMRA Sri Lanka Gazette',
        price: 1400.0,
        unit_price: 100.0,
        price_type: 'NMRA_MRP',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'NMRA Gazette 2341/39',
      });
    }

    const omez = medMap.get('Omez 20');
    if (omez) {
      priceSeedRecords.push({
        medicine_id: omez._id,
        pharmacy_id: pharmacies[0]._id,
        pharmacy_name: 'State Pharmaceuticals Corporation (Rajya Osu Sala)',
        price: 350.0,
        unit_price: 25.0,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'SPC Price List',
        availability: 'IN_STOCK',
      });
    }

    // 8. Ventolin vs Asthalin
    const ventolin = medMap.get('Ventolin Evohaler 100mcg');
    if (ventolin) {
      priceSeedRecords.push({
        medicine_id: ventolin._id,
        pharmacy_name: 'NMRA Sri Lanka Gazette',
        price: 1250.0,
        unit_price: 6.25,
        price_type: 'NMRA_MRP',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'NMRA Gazette 2341/39',
      });
    }

    const asthalin = medMap.get('Asthalin 100 Inhaler');
    if (asthalin) {
      priceSeedRecords.push({
        medicine_id: asthalin._id,
        pharmacy_id: pharmacies[0]._id,
        pharmacy_name: 'State Pharmaceuticals Corporation (Rajya Osu Sala)',
        price: 680.0,
        unit_price: 3.4,
        price_type: 'PHARMACY_SELLING_PRICE',
        effective_from: pastDate3Months,
        effective_to: null,
        source: 'SPC Price Master',
        availability: 'IN_STOCK',
      });
    }

    await MedicinePrice.create(priceSeedRecords);
    console.log(`[Seed] Created ${priceSeedRecords.length} Medicine Price records.`);

    console.log('[Seed] Seeding NMRA Regulatory Safety Alerts...');
    await SafetyAlert.create([
      {
        medicine_name: 'Guanfacine HCl 1mg Tablets',
        generic_name: 'Guanfacine',
        batch_number: 'BATCH-LK-2025-091',
        alert_type: 'RECALL',
        severity: 'CRITICAL',
        source: 'NMRA National Medicines Quality Assurance Laboratory (NMQAL)',
        description:
          'Immediate recall of Batch LK-2025-091 due to out-of-specification dissolution profile detected during post-market surveillance.',
        action_required:
          'Pharmacies must quarantine stock immediately. Patients holding this batch should return it to the dispensing pharmacy for a safe replacement.',
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        medicine_name: 'Ceftriaxone 1g Injection',
        generic_name: 'Ceftriaxone Sodium',
        batch_number: 'CF-99214',
        alert_type: 'REVOCATION',
        severity: 'HIGH',
        source: 'NMRA Enforcement Division',
        description:
          'Provisional registration revoked following failure to comply with Current Good Manufacturing Practices (cGMP) audit standards.',
        action_required: 'Hospitals and pharmacies must cease dispensing product under registration NMRA-DR-9921.',
        published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        medicine_name: 'Paracetamol Paediatric Oral Suspension 120mg/5ml',
        generic_name: 'Paracetamol',
        batch_number: 'All batches from manufacturer X',
        alert_type: 'QUALITY_SAFETY',
        severity: 'HIGH',
        source: 'Ministry of Health & NMRA Joint Advisory',
        description:
          'Mandatory screening for Diethylene Glycol (DEG) and Ethylene Glycol (EG) contaminants in liquid oral formulations.',
        action_required:
          'All importers and manufacturers must provide accredited certificates of analysis confirming absence of DEG and EG prior to retail distribution.',
        published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('[Seed] Seeding Demo Prescription History...');
    await Prescription.create([
      {
        user_id: patientUser._id,
        patient_name: 'Sunil Jayawardena',
        doctor_name: 'Dr. C. Wickramasinghe (Consultant Physician)',
        clinic_name: 'Colombo General Hospital',
        prescription_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        raw_ocr_text: 'Rx: 1. Lipitor 20mg nocte x 1/12, 2. Glucophage 500mg bd cc x 1/12, 3. Panadol 500mg prn',
        confirmed_items: [
          {
            detected_name: 'Lipitor 20',
            active_ingredient: 'Atorvastatin',
            strength: '20 mg',
            dosage_form: 'Tablet',
            dosage_instructions: '1 tablet at bedtime (0-0-1)',
            duration: '30 days',
            quantity: 30,
            confidence: 0.96,
            matched_brand: 'Lipitor 20',
            estimated_price: 3600,
            lowest_comparable_price: 1350,
            potential_savings: 2250,
            user_verified: true,
          },
          {
            detected_name: 'Glucophage 500',
            active_ingredient: 'Metformin',
            strength: '500 mg',
            dosage_form: 'Tablet',
            dosage_instructions: '1 tablet twice daily with food (1-0-1)',
            duration: '30 days',
            quantity: 60,
            confidence: 0.94,
            matched_brand: 'Glucophage 500',
            estimated_price: 1170,
            lowest_comparable_price: 390,
            potential_savings: 780,
            user_verified: true,
          },
        ],
        total_estimated_cost: 4770,
        total_comparable_cost: 1740,
        total_potential_savings: 3030,
        savings_percentage: 63.5,
        status: 'CONFIRMED',
      },
    ]);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
}

seed();
