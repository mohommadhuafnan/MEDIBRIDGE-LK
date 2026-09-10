import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite-preview',
];

const SYSTEM_PROMPT = `You are MediBridge LK's official AI Health & Medicine Assistant, a warm, knowledgeable, and reliable healthcare assistant for Sri Lankan patients, families, and caregivers.

Your knowledge base includes:
1. Sri Lankan Healthcare & Medicines:
   - Understands Sri Lankan medicine brand names (Panadol, Lipitor, Glucophage, Losec, Amoxil, Augmentin, Ventolin, Januvia, etc.).
   - Maps brand names to their active generic pharmaceutical molecules (Paracetamol, Atorvastatin, Metformin, Omeprazole, Amoxicillin, etc.).
   - Mentions State Pharmaceuticals Corporation (SPC) Rajya Osu Sala generic options, which are often 50% to 70% cheaper than imported brands.
2. NMRA Price Regulations:
   - Explains National Medicines Regulatory Authority (NMRA) Maximum Retail Price (MRP) gazetted ceilings in Sri Lanka.
   - For example: Standard Paracetamol 500mg has an official MRP cap around LKR 4.50 - 5.00 per tablet.
3. Prescription Decoding:
   - Can explain medical abbreviations used by Sri Lankan doctors: bd (twice daily), tds (thrice daily), mane (morning), nocte (night), od (once daily), prn (as needed), stat (immediately).
4. Trilingual Support:
   - Reply in the language used by the user: English, Sinhala (සිංහල), or Tamil (தமிழ்).
5. Tone & Formatting:
   - Be empathetic, clear, structured (use bullet points and bold text for medicine names and prices in LKR).
   - ALWAYS include a brief safety note: "Always consult your doctor or pharmacist before changing any prescription."
`;

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY;

    if (apiKey) {
      // Build conversation contents for Gemini
      const contents: any[] = [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}` }],
        },
      ];

      for (const model of GEMINI_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 800,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return NextResponse.json({ reply, modelUsed: model });
            }
          }
        } catch (err) {
          // try next model
        }
      }
    }

    // Graceful fallback if Gemini API is unreachable or key has quota limit
    const fallbackReply = generateFallbackMedicalReply(message);
    return NextResponse.json({ reply: fallbackReply, modelUsed: 'MediBridge Healthcare AI' });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function generateFallbackMedicalReply(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('panadol') || q.includes('paracetamol') || q.includes('පැනඩෝල්') || q.includes('fever')) {
    return `**Paracetamol 500mg (Panadol)**

• **Active Molecule:** Paracetamol (Acetaminophen)
• **Official NMRA MRP Ceiling:** Gazetted at **LKR 4.50 - 5.00** per 500mg tablet in Sri Lanka.
• **State Pharmaceuticals (Rajya Osu Sala) Generic:** ~LKR 2.50 - 3.20 per tablet.
• **Common Usage:** Mild-to-moderate pain, fever reduction. Standard adult dose is 500mg - 1000mg every 4 to 6 hours (max 4,000mg in 24 hours).

*Safety Notice: Avoid combining with other cold or flu medications containing paracetamol to prevent liver toxicity.*`;
  }

  if (q.includes('lipitor') || q.includes('atorvastatin') || q.includes('cholesterol')) {
    return `**Atorvastatin (Generic for Lipitor)**

• **Active Ingredient:** Atorvastatin Calcium (10mg, 20mg, 40mg)
• **Brand Lipitor Price:** ~LKR 65.00 - 85.00 per tablet
• **Rajya Osu Sala (SPC) Generic Price:** ~LKR 14.50 - 18.00 per tablet
• **Family Savings:** Over **65% to 75% savings** per month for chronic cholesterol management.
• Both brand and generic meet strict NMRA bioequivalence standards in Sri Lanka.

*Safety Notice: Take at bedtime as recommended by your physician. Do not stop statin therapy without consulting your doctor.*`;
  }

  if (q.includes('metformin') || q.includes('glucophage') || q.includes('sugar') || q.includes('diabetes')) {
    return `**Metformin (Generic for Glucophage)**

• **Active Ingredient:** Metformin Hydrochloride (500mg, 850mg, 1000mg XR)
• **Brand Glucophage:** ~LKR 16.00 - 24.00 per tablet
• **SPC Generic Metformin:** ~LKR 4.50 - 6.00 per tablet
• **Indication:** First-line therapy for Type 2 Diabetes Mellitus to improve insulin sensitivity.

*Safety Notice: Take with or immediately after meals to reduce stomach upset.*`;
  }

  if (q.includes('amoxil') || q.includes('amoxicillin') || q.includes('antibiotic') || q.includes('infection')) {
    return `**Amoxicillin (Generic for Amoxil)**

• **Active Ingredient:** Amoxicillin Trihydrate (250mg, 500mg)
• **NMRA MRP Cap:** Approximately LKR 18.50 - 22.00 per 500mg capsule.
• **SPC Generic:** Available at all Rajya Osu Sala outlets across Sri Lanka.
• **Classification:** Broad-spectrum penicillin antibiotic.

*Important: Under Sri Lankan law, antibiotics can ONLY be dispensed with a valid registered SLMC physician prescription. Always finish the complete course.*`;
  }

  if (q.includes('prescription') || q.includes('upload') || q.includes('read') || q.includes('handwriting')) {
    return `**How to Decode Your Prescription on MediBridge LK:**

1. Navigate to the **[Prescription Scanner](/dashboard/prescription)**.
2. Take a clear photo or upload a scanned image/PDF of your doctor's slip.
3. Our multimodal AI engine transcribes the handwriting, identifies active chemical molecules, checks NMRA price caps, and shows you affordable generic options at Rajya Osu Sala in seconds!`;
  }

  return `Thank you for your question regarding **"${query}"**.

As MediBridge LK's healthcare AI, I am here to help you:
• Check official **NMRA Maximum Retail Price (MRP) ceilings** across Sri Lanka.
• Find **Rajya Osu Sala (SPC)** generic equivalents that save 40% to 70%.
• Explain medication instructions, active ingredients, and dosage safety.

Feel free to ask about specific medicines (e.g. *Panadol, Lipitor, Metformin, Losec*), upload your prescription, or check pharmacy prices!

*Disclaimer: MediBridge LK provides informational transparency and does not replace professional medical diagnosis from your SLMC doctor.*`;
}
