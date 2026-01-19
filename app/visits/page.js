'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Visit the Dargah',
    backToHome: 'Back to Home',
    subtitle: 'Plan Your Spiritual Journey',
    location: 'Location',
    locationDesc: 'The Dargah of Hazrat Shah Deewano Sultan is located in Sindh, Pakistan. Devotees from all over the world visit this sacred shrine to seek blessings and spiritual enlightenment.',
    timings: 'Visiting Hours',
    timingsDesc: 'The Dargah is open for visitors throughout the year. Special arrangements are made during Urs celebrations.',
    dailyTimings: 'Daily: 6:00 AM - 10:00 PM',
    fridayTimings: 'Friday: Special prayers after Jummah',
    howToReach: 'How to Reach',
    byAir: 'By Air',
    byAirDesc: 'Nearest airport is Sukkur Airport, approximately 50km from the shrine.',
    byRail: 'By Rail',
    byRailDesc: 'Nearest railway station with regular connections to major cities.',
    byRoad: 'By Road',
    byRoadDesc: 'Well-connected by road network. Private and public transport available.',
    facilities: 'Facilities for Visitors',
    langar: 'Langar (Free Food)',
    langarDesc: 'Free meals are served to all visitors throughout the day.',
    accommodation: 'Accommodation',
    accommodationDesc: 'Guest houses available for devotees coming from far places.',
    parking: 'Parking',
    parkingDesc: 'Ample parking space available for vehicles.',
    medical: 'Medical Aid',
    medicalDesc: 'First aid and basic medical facilities available.',
    guidelines: 'Guidelines for Visitors',
    guideline1: 'Maintain silence and respect in the sacred premises',
    guideline2: 'Remove footwear before entering the shrine',
    guideline3: 'Dress modestly and appropriately',
    guideline4: 'Photography may be restricted in certain areas',
    guideline5: 'Follow instructions of the caretakers',
  },
  ur: {
    title: 'درگاہ کی زیارت',
    backToHome: 'واپس ہوم پیج',
    subtitle: 'اپنے روحانی سفر کی منصوبہ بندی کریں',
    location: 'مقام',
    locationDesc: 'درگاہ حضرت شاہ دیوانو سلطان سندھ، پاکستان میں واقع ہے۔ دنیا بھر سے عقیدت مند اس مقدس مزار پر برکات اور روحانی تنویر کے لیے آتے ہیں۔',
    timings: 'زیارت کے اوقات',
    timingsDesc: 'درگاہ سال بھر زائرین کے لیے کھلی رہتی ہے۔ عرس کے موقع پر خصوصی انتظامات کیے جاتے ہیں۔',
    dailyTimings: 'روزانہ: صبح 6 بجے - رات 10 بجے',
    fridayTimings: 'جمعہ: نماز جمعہ کے بعد خصوصی دعائیں',
    howToReach: 'کیسے پہنچیں',
    byAir: 'ہوائی جہاز سے',
    byAirDesc: 'قریب ترین ہوائی اڈا سکھر ایئرپورٹ ہے، مزار سے تقریباً 50 کلومیٹر دور۔',
    byRail: 'ریل سے',
    byRailDesc: 'قریب ترین ریلوے اسٹیشن بڑے شہروں سے باقاعدہ کنکشن کے ساتھ۔',
    byRoad: 'سڑک سے',
    byRoadDesc: 'سڑک کے نیٹ ورک سے اچھی طرح جڑا ہوا۔ نجی اور عوامی نقل و حمل دستیاب۔',
    facilities: 'زائرین کے لیے سہولیات',
    langar: 'لنگر (مفت کھانا)',
    langarDesc: 'تمام زائرین کو دن بھر مفت کھانا پیش کیا جاتا ہے۔',
    accommodation: 'رہائش',
    accommodationDesc: 'دور سے آنے والے عقیدت مندوں کے لیے مہمان خانے دستیاب ہیں۔',
    parking: 'پارکنگ',
    parkingDesc: 'گاڑیوں کے لیے کافی جگہ دستیاب ہے۔',
    medical: 'طبی امداد',
    medicalDesc: 'ابتدائی طبی امداد اور بنیادی طبی سہولیات دستیاب ہیں۔',
    guidelines: 'زائرین کے لیے ہدایات',
    guideline1: 'مقدس احاطے میں خاموشی اور احترام برقرار رکھیں',
    guideline2: 'مزار میں داخل ہونے سے پہلے جوتے اتاریں',
    guideline3: 'مناسب لباس پہنیں',
    guideline4: 'کچھ علاقوں میں فوٹو گرافی ممنوع ہو سکتی ہے',
    guideline5: 'خدام کی ہدایات پر عمل کریں',
  },
  sd: {
    title: 'درگاهه جي زيارت',
    backToHome: 'واپس گهر',
    subtitle: 'پنهنجي روحاني سفر جي منصوبه بندي ڪريو',
    location: 'مقام',
    locationDesc: 'درگاهه حضرت شاهه ديوانو سلطان سنڌ، پاڪستان ۾ واقع آهي. دنيا جي هر ڪنڊ مان عقيدتمند هن مقدس مزار تي برڪتون ۽ روحاني روشني حاصل ڪرڻ لاءِ اچن ٿا.',
    timings: 'زيارت جا وقت',
    timingsDesc: 'درگاهه سال ڀر زائرن لاءِ کليل آهي. عرس جي موقعي تي خاص بندوبست ڪيا ويندا آهن.',
    dailyTimings: 'روزانو: صبح 6 وڳي - رات 10 وڳي',
    fridayTimings: 'جمعو: جمعي جي نماز کانپوءِ خاص دعائون',
    howToReach: 'ڪيئن پهچجي',
    byAir: 'هوائي جهاز سان',
    byAirDesc: 'ويجهو هوائي اڏو سکر ايئرپورٽ آهي، مزار کان تقريبن 50 ڪلوميٽر پري.',
    byRail: 'ريل سان',
    byRailDesc: 'ويجهو ريلوي اسٽيشن وڏن شهرن سان باقاعده ڪنيڪشن سان.',
    byRoad: 'سڙڪ سان',
    byRoadDesc: 'سڙڪ نيٽ ورڪ سان سٺي طرح ڳنڍيل. نجي ۽ عوامي ٽرانسپورٽ موجود.',
    facilities: 'زائرن لاءِ سهوليات',
    langar: 'لنگر (مفت کاڌو)',
    langarDesc: 'سمورن زائرن کي ڏينهن ڀر مفت کاڌو پيش ڪيو ويندو آهي.',
    accommodation: 'رهائش',
    accommodationDesc: 'پري کان ايندڙ عقيدتمندن لاءِ مهمان خانا موجود آهن.',
    parking: 'پارڪنگ',
    parkingDesc: 'گاڏين لاءِ ڪافي جاءِ موجود آهي.',
    medical: 'طبي مدد',
    medicalDesc: 'ابتدائي طبي امداد ۽ بنيادي طبي سهوليات موجود آهن.',
    guidelines: 'زائرن لاءِ هدايتون',
    guideline1: 'مقدس احاطي ۾ خاموشي ۽ احترام برقرار رکو',
    guideline2: 'مزار ۾ داخل ٿيڻ کان اڳ جوتا لاهيو',
    guideline3: 'مناسب لباس پائو',
    guideline4: 'ڪجهه علائقن ۾ فوٽوگرافي ممنوع ٿي سگهي ٿي',
    guideline5: 'خدامن جي هدايتن تي عمل ڪريو',
  },
};

export default function VisitsPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const t = translations[language];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ur' || lang === 'sd');
  };

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
        <img src="https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200" alt="Visit" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <MapPin className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2 opacity-90">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Location & Timings */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-8 w-8 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{t.location}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{t.locationDesc}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{t.timings}</h2>
              </div>
              <p className="text-gray-700 mb-4">{t.timingsDesc}</p>
              <div className="space-y-2">
                <p className="bg-emerald-50 p-3 rounded text-emerald-800">{t.dailyTimings}</p>
                <p className="bg-blue-50 p-3 rounded text-blue-800">{t.fridayTimings}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Reach */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.howToReach}</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✈️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.byAir}</h3>
              <p className="text-gray-600">{t.byAirDesc}</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚂</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.byRail}</h3>
              <p className="text-gray-600">{t.byRailDesc}</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.byRoad}</h3>
              <p className="text-gray-600">{t.byRoadDesc}</p>
            </CardContent>
          </Card>
        </div>

        {/* Facilities */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.facilities}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: '🍽️', title: t.langar, desc: t.langarDesc, color: 'bg-orange-100' },
            { icon: '🏨', title: t.accommodation, desc: t.accommodationDesc, color: 'bg-green-100' },
            { icon: '🅿️', title: t.parking, desc: t.parkingDesc, color: 'bg-blue-100' },
            { icon: '🏥', title: t.medical, desc: t.medicalDesc, color: 'bg-red-100' },
          ].map((facility, idx) => (
            <Card key={idx} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`${facility.color} w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{facility.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{facility.title}</h3>
                <p className="text-gray-600 text-sm">{facility.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guidelines */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.guidelines}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[t.guideline1, t.guideline2, t.guideline3, t.guideline4, t.guideline5].map((guideline, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                  <span className="text-emerald-600 text-xl">✓</span>
                  <span className="text-gray-700">{guideline}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
