'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Star, Users, Music, Gift } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Urs Mubarak',
    backToHome: 'Back to Home',
    subtitle: 'Annual Commemoration of the Saints',
    about: 'About Urs Mubarak',
    aboutDesc: 'Urs Mubarak is an annual celebration commemorating the death anniversary of a Sufi saint. It is considered a spiritual wedding of the soul with the Divine. During these blessed days, thousands of devotees gather to pay homage, seek blessings, and participate in spiritual activities.',
    schedule: 'Urs Schedule',
    activities: 'Activities During Urs',
    activity1: 'Quran Khwani (Quran Recitation)',
    activity1Desc: 'Complete recitation of the Holy Quran for the spiritual benefit of the saint',
    activity2: 'Mehfil-e-Sama',
    activity2Desc: 'Spiritual gatherings with Qawwali and devotional music',
    activity3: 'Langar Distribution',
    activity3Desc: 'Free food distribution to all visitors regardless of faith or background',
    activity4: 'Naat & Hamd Recitation',
    activity4Desc: 'Beautiful recitation of praises for Allah and Prophet Muhammad ﷺ',
    activity5: 'Ziyarat',
    activity5Desc: 'Pilgrims visit the blessed shrine to pay respects',
    activity6: 'Chaddar Ceremony',
    activity6Desc: 'Offering of sacred cloth covering for the tomb',
    specialPrayers: 'Special Prayers',
    specialPrayersDesc: 'During Urs, special prayers and supplications are offered. Devotees believe that prayers made during this time are particularly blessed and more likely to be accepted.',
  },
  ur: {
    title: 'عرس مبارک',
    backToHome: 'واپس ہوم پیج',
    subtitle: 'بزرگان دین کی سالانہ یاد',
    about: 'عرس مبارک کے بارے میں',
    aboutDesc: 'عرس مبارک صوفی بزرگ کی وفات کی سالگرہ منانے کا سالانہ تہوار ہے۔ اسے روح کی خدا سے شادی کا روحانی جشن سمجھا جاتا ہے۔ ان مبارک دنوں میں ہزاروں عقیدت مند خراج عقیدت پیش کرنے، برکات حاصل کرنے اور روحانی سرگرمیوں میں شرکت کے لیے جمع ہوتے ہیں۔',
    schedule: 'عرس کا شیڈول',
    activities: 'عرس کی سرگرمیاں',
    activity1: 'قرآن خوانی',
    activity1Desc: 'بزرگ کی روحانی فائدے کے لیے قرآن پاک کی مکمل تلاوت',
    activity2: 'محفل سماع',
    activity2Desc: 'قوالی اور عقیدتی موسیقی کے ساتھ روحانی محفلیں',
    activity3: 'لنگر تقسیم',
    activity3Desc: 'تمام زائرین کو مذہب یا پس منظر سے قطع نظر مفت کھانا',
    activity4: 'نعت و حمد',
    activity4Desc: 'اللہ اور نبی کریم ﷺ کی حمد و ثنا',
    activity5: 'زیارت',
    activity5Desc: 'زائرین احترام پیش کرنے کے لیے مبارک مزار کی زیارت کرتے ہیں',
    activity6: 'چادر پوشی',
    activity6Desc: 'مزار کے لیے مقدس چادر پیش کی جاتی ہے',
    specialPrayers: 'خصوصی دعائیں',
    specialPrayersDesc: 'عرس کے دوران خصوصی دعائیں کی جاتی ہیں۔ عقیدت مندوں کا یقین ہے کہ اس وقت کی گئی دعائیں خاص طور پر مبارک ہیں اور قبولیت کا زیادہ امکان ہے۔',
  },
  sd: {
    title: 'عرس مبارڪ',
    backToHome: 'واپس گهر',
    subtitle: 'بزرگن جي سالياني ياد',
    about: 'عرس مبارڪ بابت',
    aboutDesc: 'عرس مبارڪ صوفي بزرگ جي وفات جي سالگره منائڻ جو سالياني تهوار آهي. ان کي روح جي خدا سان شادي جو روحاني جشن سمجهيو ويندو آهي. انهن مبارڪ ڏينهن ۾ هزارين عقيدتمند خراج عقيدت پيش ڪرڻ، برڪتون حاصل ڪرڻ ۽ روحاني سرگرمين ۾ شرڪت لاءِ گڏ ٿيندا آهن.',
    schedule: 'عرس جو شيڊول',
    activities: 'عرس جون سرگرميون',
    activity1: 'قرآن خواني',
    activity1Desc: 'بزرگ جي روحاني فائدي لاءِ قرآن پاڪ جي مڪمل تلاوت',
    activity2: 'محفل سماع',
    activity2Desc: 'قوالي ۽ عقيدتي موسيقي سان روحاني محفلون',
    activity3: 'لنگر ورهائڻ',
    activity3Desc: 'سمورن زائرن کي مذهب يا پس منظر کان سواءِ مفت کاڌو',
    activity4: 'نعت و حمد',
    activity4Desc: 'الله ۽ نبي ڪريم ﷺ جي حمد و ثنا',
    activity5: 'زيارت',
    activity5Desc: 'زائر احترام پيش ڪرڻ لاءِ مبارڪ مزار جي زيارت ڪن ٿا',
    activity6: 'چادر پوشي',
    activity6Desc: 'مزار لاءِ مقدس چادر پيش ڪئي ويندي آهي',
    specialPrayers: 'خاص دعائون',
    specialPrayersDesc: 'عرس دوران خاص دعائون ڪيون وينديون آهن. عقيدتمندن جو يقين آهي ته هن وقت ڪيل دعائون خاص طور تي مبارڪ آهن ۽ قبوليت جو وڌيڪ امڪان آهي.',
  },
};

export default function UrsPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const t = translations[language];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ur' || lang === 'sd');
  };

  const activities = [
    { icon: '📖', title: t.activity1, desc: t.activity1Desc, color: 'bg-emerald-100' },
    { icon: '🎵', title: t.activity2, desc: t.activity2Desc, color: 'bg-purple-100' },
    { icon: '🍽️', title: t.activity3, desc: t.activity3Desc, color: 'bg-orange-100' },
    { icon: '🎤', title: t.activity4, desc: t.activity4Desc, color: 'bg-green-100' },
    { icon: '🕌', title: t.activity5, desc: t.activity5Desc, color: 'bg-blue-100' },
    { icon: '🧣', title: t.activity6, desc: t.activity6Desc, color: 'bg-pink-100' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToHome}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-center flex-1">{t.title}</h1>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleLanguageChange('en')} className={`${language === 'en' ? 'bg-white/20' : 'hover:bg-white/10'}`}>English</Button>
              <Button variant="ghost" size="sm" onClick={() => handleLanguageChange('ur')} className={`${language === 'ur' ? 'bg-white/20' : 'hover:bg-white/10'}`}>اردو</Button>
              <Button variant="ghost" size="sm" onClick={() => handleLanguageChange('sd')} className={`${language === 'sd' ? 'bg-white/20' : 'hover:bg-white/10'}`}>سنڌي</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200" alt="Urs" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <Star className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2 opacity-90">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* About Section */}
        <Card className="mb-12 bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">{t.about}</h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center">{t.aboutDesc}</p>
          </CardContent>
        </Card>

        {/* Activities Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.activities}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activities.map((activity, idx) => (
            <Card key={idx} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className={`${activity.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">{activity.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-center">{activity.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Special Prayers */}
        <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">{t.specialPrayers}</h2>
            <p className="text-lg opacity-90 text-center leading-relaxed">{t.specialPrayersDesc}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
