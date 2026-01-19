'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, BookOpen, Users, Music, Gift, Home, Utensils, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Our Services',
    backToHome: 'Back to Home',
    subtitle: 'Serving Humanity with Love and Compassion',
    services: [
      { icon: 'utensils', title: 'Langar Khana', desc: 'Free meals are served daily to all visitors without any discrimination. The kitchen operates throughout the day to ensure no one leaves hungry.' },
      { icon: 'home', title: 'Guest Accommodation', desc: 'Free lodging facilities for devotees traveling from distant places. Clean and comfortable rooms are available for overnight stays.' },
      { icon: 'bookopen', title: 'Islamic Education', desc: 'Regular classes on Quran recitation, Islamic teachings, and spiritual development are conducted for children and adults.' },
      { icon: 'music', title: 'Spiritual Gatherings', desc: 'Weekly mehfil-e-sama sessions featuring Qawwali and devotional music to elevate the spiritual state of attendees.' },
      { icon: 'stethoscope', title: 'Medical Camps', desc: 'Free medical camps are organized periodically where qualified doctors provide consultation and medicines.' },
      { icon: 'users', title: 'Marriage Assistance', desc: 'Financial assistance and arrangements for marriages of those who cannot afford wedding expenses.' },
      { icon: 'gift', title: 'Welfare Distribution', desc: 'Distribution of food, clothing, and essential items to the needy, especially during Eid and other occasions.' },
      { icon: 'heart', title: 'Orphan Support', desc: 'Care and support for orphan children including education, food, clothing, and emotional nurturing.' },
    ],
  },
  ur: {
    title: 'ہماری خدمات',
    backToHome: 'واپس ہوم پیج',
    subtitle: 'محبت اور ہمدردی کے ساتھ انسانیت کی خدمت',
    services: [
      { icon: 'utensils', title: 'لنگر خانہ', desc: 'تمام زائرین کو بغیر کسی تفریق کے روزانہ مفت کھانا پیش کیا جاتا ہے۔ باورچی خانہ دن بھر کام کرتا ہے تاکہ کوئی بھوکا نہ جائے۔' },
      { icon: 'home', title: 'مہمان خانہ', desc: 'دور دراز سے آنے والے عقیدت مندوں کے لیے مفت رہائش کی سہولت۔ رات گزارنے کے لیے صاف ستھرے کمرے دستیاب ہیں۔' },
      { icon: 'bookopen', title: 'اسلامی تعلیم', desc: 'بچوں اور بڑوں کے لیے قرآن کی تلاوت، اسلامی تعلیمات اور روحانی ترقی کی باقاعدہ کلاسیں۔' },
      { icon: 'music', title: 'روحانی محفلیں', desc: 'ہفتہ وار محفل سماع جس میں قوالی اور عقیدتی موسیقی شامل ہے۔' },
      { icon: 'stethoscope', title: 'طبی کیمپ', desc: 'وقتاً فوقتاً مفت طبی کیمپ منعقد کیے جاتے ہیں جہاں اہل ڈاکٹر مشاورت اور ادویات فراہم کرتے ہیں۔' },
      { icon: 'users', title: 'شادی میں مدد', desc: 'جو لوگ شادی کے اخراجات برداشت نہیں کر سکتے ان کے لیے مالی مدد اور انتظامات۔' },
      { icon: 'gift', title: 'فلاحی تقسیم', desc: 'ضرورت مندوں میں کھانا، کپڑے اور ضروری اشیاء کی تقسیم، خاص طور پر عید کے موقع پر۔' },
      { icon: 'heart', title: 'یتیموں کی دیکھ بھال', desc: 'یتیم بچوں کی دیکھ بھال اور مدد بشمول تعلیم، خوراک، لباس اور جذباتی پرورش۔' },
    ],
  },
  sd: {
    title: 'اسان جون خدمتون',
    backToHome: 'واپس گهر',
    subtitle: 'محبت ۽ همدردي سان انسانيت جي خدمت',
    services: [
      { icon: 'utensils', title: 'لنگر خانو', desc: 'سمورن زائرن کي بغير ڪنهن تفريق جي روزانه مفت کاڌو پيش ڪيو ويندو آهي. باورچي خانو ڏينهن ڀر ڪم ڪندو آهي ته جيئن ڪو به بکيو نه وڃي.' },
      { icon: 'home', title: 'مهمان خانو', desc: 'پري کان ايندڙ عقيدتمندن لاءِ مفت رهائش جي سهولت. رات گذارڻ لاءِ صاف ڪمرا موجود آهن.' },
      { icon: 'bookopen', title: 'اسلامي تعليم', desc: 'ٻارن ۽ وڏن لاءِ قرآن جي تلاوت، اسلامي تعليمات ۽ روحاني ترقي جا باقاعده ڪلاس.' },
      { icon: 'music', title: 'روحاني محفلون', desc: 'هفتيوار محفل سماع جنهن ۾ قوالي ۽ عقيدتي موسيقي شامل آهي.' },
      { icon: 'stethoscope', title: 'طبي ڪيمپ', desc: 'وقتاً فوقتاً مفت طبي ڪيمپ منعقد ڪيا ويندا آهن جتي قابل ڊاڪٽر مشاورت ۽ دوائون فراهم ڪن ٿا.' },
      { icon: 'users', title: 'شادي ۾ مدد', desc: 'جيڪي ماڻهو شادي جا خرچ برداشت نٿا ڪري سگهن انهن لاءِ مالي مدد ۽ انتظام.' },
      { icon: 'gift', title: 'فلاحي ورهائي', desc: 'ضرورتمندن ۾ کاڌو، ڪپڙا ۽ ضروري شيون ورهايون وينديون آهن، خاص طور تي عيد جي موقعي تي.' },
      { icon: 'heart', title: 'يتيمن جي سنڀال', desc: 'يتيم ٻارن جي سنڀال ۽ مدد بشمول تعليم، خوراڪ، لباس ۽ جذباتي پرورش.' },
    ],
  },
};

const iconMap = {
  utensils: Utensils,
  home: Home,
  bookopen: BookOpen,
  music: Music,
  stethoscope: Stethoscope,
  users: Users,
  gift: Gift,
  heart: Heart,
};

export default function ServicesPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const t = translations[language];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ur' || lang === 'sd');
  };

  const colors = [
    'from-emerald-500 to-teal-500',
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-cyan-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
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
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200" alt="Services" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <Heart className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2 opacity-90">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.map((service, idx) => {
            const IconComponent = iconMap[service.icon];
            return (
              <Card key={idx} className="hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`bg-gradient-to-r ${colors[idx]} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
