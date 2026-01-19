'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Introduction to Hazrat Shah Deewano Sultan',
    backToHome: 'Back to Home',
    downloadPDF: 'Download PDF',
    biography: 'Biography',
    content: `Hazrat Shah Deewano Sultan was a great Sufi saint and spiritual leader who devoted his life to spreading the message of love, peace, and divine wisdom. Born in the blessed land of Sindh, he became a beacon of spiritual enlightenment for thousands of devotees.\n\nHis teachings emphasized the importance of love for humanity, devotion to God, and service to mankind. Through his spiritual practices and profound wisdom, he guided countless souls on the path of righteousness and divine connection.\n\nThe Dargah of Hazrat Shah Deewano Sultan stands as a testament to his spiritual legacy, attracting devotees from all walks of life who seek blessings, guidance, and spiritual solace. His message of universal brotherhood and divine love continues to inspire generations.\n\nHis life was marked by numerous miracles and spiritual experiences that demonstrated his deep connection with the Divine. Devotees who visit his blessed shrine experience profound peace and spiritual elevation.\n\nThe annual Urs celebration at the Dargah brings together thousands of devotees who gather to pay homage to this great saint and participate in spiritual gatherings, qawwali performances, and acts of charity.`,
    spiritualTeachings: 'Spiritual Teachings',
    teachings: 'His core teachings include love for all of creation, devotion to the Divine, service to humanity, and the pursuit of spiritual knowledge. He emphasized that true spirituality lies in purifying the heart and serving others selflessly.',
    legacy: 'Legacy',
    legacyText: 'The spiritual legacy of Hazrat Shah Deewano Sultan continues through the countless devotees who follow his path and the Dargah that preserves his teachings and provides spiritual guidance to seekers.',
  },
  ur: {
    title: 'حضرت شاہ دیوانو سلطان کا تعارف',
    backToHome: 'واپس ہوم پیج',
    downloadPDF: 'پی ڈی ایف ڈاؤن لوڈ کریں',
    biography: 'سوانح حیات',
    content: `حضرت شاہ دیوانو سلطان ایک عظیم صوفی بزرگ اور روحانی رہنما تھے جنہوں نے اپنی زندگی محبت، امن اور الہی حکمت کے پیغام کو پھیلانے کے لیے وقف کر دی۔ سندھ کی مقدس سرزمین میں پیدا ہوئے، وہ ہزاروں عقیدت مندوں کے لیے روحانی روشنی کا مینار بن گئے۔\n\nان کی تعلیمات نے انسانیت سے محبت، خدا کی عبادت، اور انسانیت کی خدمت کی اہمیت پر زور دیا۔ اپنی روحانی مشقوں اور گہری حکمت کے ذریعے، انہوں نے بے شمار روحوں کو راستبازی اور الہی تعلق کی راہ پر گامزن کیا۔\n\nحضرت شاہ دیوانو سلطان کی درگاہ ان کی روحانی میراث کی گواہی ہے، جو زندگی کے تمام شعبوں سے تعلق رکھنے والے عقیدت مندوں کو اپنی طرف کھینچتی ہے جو برکتیں، رہنمائی اور روحانی سکون تلاش کرتے ہیں۔ عالمگیر بھائی چارے اور الہی محبت کا ان کا پیغام نسلوں کو متاثر کرتا رہتا ہے۔\n\nان کی زندگی متعدد معجزات اور روحانی تجربات سے بھری ہوئی تھی جو خدا کے ساتھ ان کے گہرے تعلق کو ظاہر کرتے ہیں۔ جو عقیدت مند ان کے مبارک مزار کی زیارت کرتے ہیں وہ گہرا سکون اور روحانی بلندی کا تجربہ کرتے ہیں۔\n\nدرگاہ میں سالانہ عرس کی تقریب ہزاروں عقیدت مندوں کو اکٹھا کرتی ہے جو اس عظیم بزرگ کو خراج عقیدت پیش کرنے اور روحانی اجتماعات، قوالی کی محفلوں اور خیراتی کاموں میں حصہ لینے کے لیے جمع ہوتے ہیں۔`,
    spiritualTeachings: 'روحانی تعلیمات',
    teachings: 'ان کی بنیادی تعلیمات میں تمام مخلوقات سے محبت، خدا کی عبادت، انسانیت کی خدمت، اور روحانی علم کی تلاش شامل ہے۔ انہوں نے زور دیا کہ حقیقی روحانیت دل کو پاک کرنے اور دوسروں کی بے لوث خدمت کرنے میں ہے۔',
    legacy: 'میراث',
    legacyText: 'حضرت شاہ دیوانو سلطان کی روحانی میراث ان گنت عقیدت مندوں کے ذریعے جاری ہے جو ان کے راستے پر چلتے ہیں اور درگاہ جو ان کی تعلیمات کو محفوظ رکھتی ہے اور طالبین کو روحانی رہنمائی فراہم کرتی ہے۔',
  },
  sd: {
    title: 'حضرت شاهه دیوانو سلطان جو تعارف',
    backToHome: 'واپس گهر',
    downloadPDF: 'پی ڊی ایف ڊائون لوڊ ڪريو',
    biography: 'سوانح حيات',
    content: `حضرت شاهه دیوانو سلطان هڪ عظيم صوفي بزرگ ۽ روحاني رهنما هئا جن پنهنجي زندگي محبت، امن ۽ الهي حڪمت جي پيغام کي ڦهلائڻ لاءِ وقف ڪري ڇڏي. سنڌ جي مقدس سرزمين ۾ پيدا ٿيا، هو هزارين عقيدتمندن لاءِ روحاني روشني جو مينار بڻجي ويا.\n\nهنن جي تعليمات انسانيت سان محبت، خدا جي عبادت، ۽ انسانيت جي خدمت جي اهميت تي زور ڏنو. پنهنجي روحاني مشقن ۽ گهري حڪمت ذريعي، هنن بي شمار روحن کي راستبازي ۽ الهي تعلق جي رستي تي گامزن ڪيو.\n\nحضرت شاهه دیوانو سلطان جي درگاهه هنن جي روحاني ميراث جي گواهي آهي، جيڪا زندگي جي سمورن شعبن مان تعلق رکڻ وارن عقيدتمندن کي پنهنجي طرف ڇڪي ٿي جيڪي برڪتون، رهنمائي ۽ روحاني سڪون ڳوليندا آهن. عالمگير ڀائيچاري ۽ الهي محبت جو هنن جو پيغام نسلن کي متاثر ڪندو رهي ٿو.\n\nهنن جي زندگي ڪيترن ئي معجزن ۽ روحاني تجربن سان ڀري هئي جيڪي خدا سان هنن جي گهري تعلق کي ظاهر ڪن ٿا. جيڪي عقيدتمند هنن جي مبارڪ مزار جي زيارت ڪن ٿا اهي گهرو سڪون ۽ روحاني بلندي جو تجربو ڪن ٿا.\n\nدرگاهه ۾ سالانه عرس جي تقريب هزارين عقيدتمندن کي گڏ ڪري ٿي جيڪي هن عظيم بزرگ کي خراج عقيدت پيش ڪرڻ ۽ روحاني گڏجاڻين، قوالي جي محفلن ۽ خيراتي ڪمن ۾ حصو وٺڻ لاءِ گڏ ٿين ٿا.`,
    spiritualTeachings: 'روحاني تعليمات',
    teachings: 'هنن جي بنيادي تعليمات ۾ سموري مخلوق سان محبت، خدا جي عبادت، انسانيت جي خدمت، ۽ روحاني علم جي ڳولا شامل آهي. هنن زور ڏنو ته حقيقي روحانيت دل کي پاڪ ڪرڻ ۽ ٻين جي بي لوث خدمت ڪرڻ ۾ آهي.',
    legacy: 'ميراث',
    legacyText: 'حضرت شاهه دیوانو سلطان جي روحاني ميراث انگڻت عقيدتمندن ذريعي جاري آهي جيڪي هنن جي رستي تي هلن ٿا ۽ درگاهه جيڪا هنن جي تعليمات کي محفوظ رکي ٿي ۽ طالبن کي روحاني رهنمائي فراهم ڪري ٿي.',
  },
};

export default function IntroductionPage() {
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLanguageChange('en')}
                className={`${language === 'en' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                English
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLanguageChange('ur')}
                className={`${language === 'ur' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                اردو
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLanguageChange('sd')}
                className={`${language === 'sd' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                سنڌي
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1666175146838-78974290e6af?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkYXJnYWglMjBzaHJpbmV8ZW58MHx8fHwxNzYwMDA5NTAzfDA&ixlib=rb-4.1.0&q=85"
          alt="Dargah"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-end">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.title}</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">{t.biography}</h3>
              <p className="text-gray-600">{language === 'en' ? 'Download in English' : language === 'ur' ? 'اردو میں ڈاؤن لوڈ کریں' : 'سنڌي ۾ ڊائون لوڊ ڪريو'}</p>
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                <Download className="mr-2 h-4 w-4" />
                {t.downloadPDF}
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">{t.spiritualTeachings}</h3>
              <p className="text-gray-600">{language === 'en' ? 'Download in English' : language === 'ur' ? 'اردو میں ڈاؤن لوڈ کریں' : 'سنڌي ۾ ڊائون لوڊ ڪريو'}</p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                {t.downloadPDF}
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">{t.legacy}</h3>
              <p className="text-gray-600">{language === 'en' ? 'Download in English' : language === 'ur' ? 'اردو میں ڈاؤن لوڈ کریں' : 'سنڌي ۾ ڊائون لوڊ ڪريو'}</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Download className="mr-2 h-4 w-4" />
                {t.downloadPDF}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-emerald-800">{t.biography}</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
              {t.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-emerald-800">{t.spiritualTeachings}</h2>
              <p className="text-gray-700 leading-relaxed">{t.teachings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-emerald-800">{t.legacy}</h2>
              <p className="text-gray-700 leading-relaxed">{t.legacyText}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}