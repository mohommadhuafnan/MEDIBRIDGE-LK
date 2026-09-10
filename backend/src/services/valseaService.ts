import axios from 'axios';

const VALSEA_API_KEY = process.env.VALSEA_API_KEY || '';

const VALSEA_BASE_URL = 'https://api.valsea.ai/v1/translations';

// In-memory translation cache for high performance
const translationCache = new Map<string, string>();

// Built-in healthcare dictionary for instant, accurate medical translation in Sri Lanka
const DICTIONARY: Record<string, { si: string; ta: string }> = {
  'Understand Your Medicine. Know Your Cost.': {
    si: 'ඔබේ ඖෂධ තේරුම් ගන්න. ඔබේ වියදම දැනගන්න.',
    ta: 'உங்கள் மருந்தை புரிந்து கொள்ளுங்கள். உங்கள் செலவை அறிந்து கொள்ளுங்கள்.',
  },
  'Analyze Prescription': {
    si: 'බෙහෙත් වට්ටෝරුව පරීක්ෂා කරන්න',
    ta: 'மருந்துச் சீட்டை பகுப்பாய்வு செய்க',
  },
  'Explore Medicines': {
    si: 'ඖෂධ ගවේෂණය කරන්න',
    ta: 'மருந்துகளை ஆராயுங்கள்',
  },
  'Potential lower-cost option': {
    si: 'අඩු පිරිවැයක් සහිත විකල්ප ඖෂධයකි',
    ta: 'குறைந்த விலை கொண்ட மாற்று மருந்து',
  },
  'Consult a qualified doctor or pharmacist before changing your medicine or brand.': {
    si: 'ඔබගේ ඖෂධය හෝ සන්නාමය වෙනස් කිරීමට පෙර සුදුසුකම් ලත් වෛද්‍යවරයෙකු හෝ ඖෂධවේදියෙකු හමුවන්න.',
    ta: 'உங்கள் மருந்தையோ அல்லது பிராண்டையோ மாற்றுவதற்கு முன் தகுதியான மருத்துவர் அல்லது மருந்தாளரை அணுகவும்.',
  },
  'Prescriptions Analyzed': {
    si: 'පරීක්ෂා කළ බෙහෙත් වට්ටෝරු',
    ta: 'பகுப்பாய்வு செய்யப்பட்ட சீட்டுகள்',
  },
  'Potential Savings': {
    si: 'විභව ඉතිරිය',
    ta: 'சாத்தியமான சேமிப்பு',
  },
  'Medicines Saved': {
    si: 'සුරකින ලද ඖෂධ',
    ta: 'சேமிக்கப்பட்ட மருந்துகள்',
  },
  'Price History': {
    si: 'මිල ඉතිහාසය',
    ta: 'விலை வரலாறு',
  },
  'Safety Alerts': {
    si: 'ආරක්ෂිත නිවේදන',
    ta: 'பாதுகாப்பு எச்சரிக்கைகள்',
  },
  'Upload Prescription': {
    si: 'බෙහෙත් වට්ටෝරුව උඩුගත කරන්න',
    ta: 'மருந்துச் சீட்டை பதிவேற்றவும்',
  },
  'Active Ingredient': {
    si: 'ක්‍රියාකාරී අමුද්‍රව්‍යය',
    ta: 'செயலில் உள்ள மூலப்பொருள்',
  },
  'Dosage Form': {
    si: 'මාත්‍රා ආකාරය',
    ta: 'மருந்து வடிவம்',
  },
  'Maximum Retail Price (NMRA MRP)': {
    si: 'උපරිම සිල්ලර මිල (NMRA MRP)',
    ta: 'அதிகபட்ச சில்லறை விலை (NMRA MRP)',
  },
};

export async function translateText(
  text: string,
  targetLang: 'en' | 'si' | 'ta'
): Promise<{ original: string; translated: string; language: string; provider: string }> {
  if (!text || targetLang === 'en') {
    return { original: text, translated: text, language: targetLang, provider: 'identity' };
  }

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return {
      original: text,
      translated: translationCache.get(cacheKey)!,
      language: targetLang,
      provider: 'cache',
    };
  }

  // Check built-in dictionary
  if (DICTIONARY[text] && DICTIONARY[text][targetLang]) {
    const translation = DICTIONARY[text][targetLang];
    translationCache.set(cacheKey, translation);
    return {
      original: text,
      translated: translation,
      language: targetLang,
      provider: 'curated_medical_dictionary',
    };
  }

  // Call Valsea.ai translation API
  try {
    const response = await axios.post(
      VALSEA_BASE_URL,
      {
        text,
        target_language: targetLang === 'si' ? 'sin' : targetLang === 'ta' ? 'tam' : targetLang,
      },
      {
        headers: {
          Authorization: `Bearer ${VALSEA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 8000,
      }
    );

    const translated =
      response.data?.translated_text || response.data?.translation || response.data?.text || text;
    translationCache.set(cacheKey, translated);

    return {
      original: text,
      translated,
      language: targetLang,
      provider: 'valsea.ai',
    };
  } catch (err: any) {
    console.warn(`[Valsea.ai] Translation request error: ${err.message}. Using fallback.`);
    return {
      original: text,
      translated: text,
      language: targetLang,
      provider: 'fallback_original',
    };
  }
}

export function getDictionary(): Record<string, { si: string; ta: string }> {
  return DICTIONARY;
}
