'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export type Language = 'en' | 'si' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
}

const UI_DICTIONARY: Record<string, { si: string; ta: string }> = {
  // Brand
  'Understand Your Medicine. Know Your Cost.': {
    si: 'ඔබේ ඖෂධ තේරුම් ගන්න. ඔබේ වියදම දැනගන්න.',
    ta: 'உங்கள் மருந்தை புரிந்து கொள்ளுங்கள். உங்கள் செலவை அறிந்து கொள்ளுங்கள்.',
  },
  'Making medicine information and affordability easier for everyone.': {
    si: 'සැමට ඖෂධ තොරතුරු සහ දැරිය හැකි මිල පහසු කරමින්.',
    ta: 'மருந்து தகவல்களையும் மலிவு விலையையும் அனைவருக்கும் எளிதாக்குகிறது.',
  },

  // Actions
  'Analyze Prescription': {
    si: 'බෙහෙත් වට්ටෝරුව පරීක්ෂා කරන්න',
    ta: 'மருந்துச் சீட்டை பகுப்பாய்வு செய்க',
  },
  'Explore Medicines': {
    si: 'ඖෂධ ගවේෂණය කරන්න',
    ta: 'மருந்துகளை ஆராயுங்கள்',
  },
  'How It Works': {
    si: 'ක්‍රියා කරන ආකාරය',
    ta: 'எவ்வாறு செயல்படுகிறது',
  },
  'Features': {
    si: 'විශේෂාංග',
    ta: 'அம்சங்கள்',
  },
  'Medicines Directory': {
    si: 'ඖෂධ නාමාවලිය',
    ta: 'மருந்து அடைவு',
  },
  'NMRA Prices': {
    si: 'NMRA මිල ගණන්',
    ta: 'NMRA விலைகள்',
  },
  'For Pharmacies': {
    si: 'ඖෂධසැල් සඳහා',
    ta: 'மருந்தகங்களுக்கு',
  },
  'Get Started': {
    si: 'ආරම්භ කරන්න',
    ta: 'தொடங்குங்கள்',
  },
  'Login': {
    si: 'ඇතුල් වන්න',
    ta: 'உள்நுழைக',
  },
  'Sign Up': {
    si: 'ලියාපදිංචි වන්න',
    ta: 'பதிவு செய்க',
  },
  'Go to Dashboard': {
    si: 'පාලක පුවරුවට යන්න',
    ta: 'டாஷ்போர்டுக்கு செல்க',
  },

  // Dashboard Stats
  'Prescriptions Analyzed': {
    si: 'පරීක්ෂා කළ බෙහෙත් වට්ටෝරු',
    ta: 'பகுப்பாய்வு செய்யப்பட்ட சீட்டுகள்',
  },
  'Medicines Saved': {
    si: 'සුරකින ලද ඖෂධ',
    ta: 'சேமிக்கப்பட்ட மருந்துகள்',
  },
  'Potential Savings': {
    si: 'විභව ඉතිරිය',
    ta: 'சாத்தியமான சேமிப்பு',
  },
  'Recent Price Changes': {
    si: 'මෑත මිල වෙනස්වීම්',
    ta: 'சமீபத்திய விலை மாற்றங்கள்',
  },
  'Price History': {
    si: 'මිල ඉතිහාසය',
    ta: 'விலை வரலாறு',
  },
  'Safety Alerts': {
    si: 'ආරක්ෂිත නිවේදන',
    ta: 'பாதுகாப்பு எச்சரிக்கைகள்',
  },
  'Participating Pharmacies': {
    si: 'සහභාගී වන ඖෂධසැල්',
    ta: 'பங்கேற்கும் மருந்தகங்கள்',
  },

  // Medical labels
  'Potential lower-cost option': {
    si: 'අඩු පිරිවැයක් සහිත විකල්ප ඖෂධයකි',
    ta: 'குறைந்த விலை கொண்ட மாற்று மருந்து',
  },
  'Active Ingredient': {
    si: 'ක්‍රියාකාරී අමුද්‍රව්‍යය',
    ta: 'செயலில் உள்ள மூலப்பொருள்',
  },
  'Strength': {
    si: 'ශක්තිය / සාන්ද්‍රණය',
    ta: 'வீரியம் / செறிவு',
  },
  'Dosage Form': {
    si: 'මාත්‍රා ආකාරය',
    ta: 'மருந்து வடிவம்',
  },
  'Maximum Retail Price (NMRA MRP)': {
    si: 'උපරිම සිල්ලර මිල (NMRA MRP)',
    ta: 'அதிகபட்ச சில்லறை விலை (NMRA MRP)',
  },
  'Safety Notice': {
    si: 'ආරක්ෂිත දැනුම්දීම',
    ta: 'பாதுகாப்பு அறிவிப்பு',
  },
  'Consult a qualified doctor or pharmacist before changing your medicine or brand.': {
    si: 'ඔබගේ ඖෂධය හෝ සන්නාමය වෙනස් කිරීමට පෙර සුදුසුකම් ලත් වෛද්‍යවරයෙකු හෝ ඖෂධවේදියෙකු හමුවන්න.',
    ta: 'உங்கள் மருந்தையோ அல்லது பிராண்டையோ மாற்றுவதற்கு முன் தகுதியான மருத்துவர் அல்லது மருந்தாளரை அணுகவும்.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (text: string) => text,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('medibridge_lang') as Language;
    if (saved && (saved === 'en' || saved === 'si' || saved === 'ta')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medibridge_lang', lang);
    }
  };

  const t = (text: string): string => {
    if (!text || language === 'en') return text;
    if (UI_DICTIONARY[text] && UI_DICTIONARY[text][language]) {
      return UI_DICTIONARY[text][language];
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
