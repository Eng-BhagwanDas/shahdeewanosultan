'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Default saints data as fallback (same structure as original)
const defaultSaintsData = {
  en: [
    {
      id: 'saint1',
      name: 'Hazrat Syed Sakhi Shah Deewano',
      title: 'The Spiritual Guide',
      content: 'Hazrat Syed Sakhi Shah Deewano was a renowned Sufi saint known for his profound spiritual wisdom and compassionate teachings. His life exemplified the principles of love, devotion, and service to humanity. Thousands of devotees were drawn to his spiritual gatherings where he would share divine knowledge and guide seekers on the path of righteousness. His teachings emphasized the importance of purifying the heart and developing a deep connection with the Divine through love and devotion.',
      pdfUrlEn: '',
      pdfUrlUr: '',
      pdfUrlSd: '',
    },
    {
      id: 'saint2',
      name: 'Hazrat Syed Sakhi Ismail Shah',
      title: 'The Light of Wisdom',
      content: 'Hazrat Syed Sakhi Ismail Shah was a distinguished spiritual master whose teachings illuminated the hearts of countless seekers. His profound knowledge of Islamic spirituality and his ability to guide disciples on the path of self-purification made him a revered figure. He emphasized the importance of inner transformation and the pursuit of divine knowledge as means to attain spiritual elevation.',
      pdfUrlEn: '',
      pdfUrlUr: '',
      pdfUrlSd: '',
    },
    {
      id: 'saint3',
      name: 'Faqir Abdul Qayoom Memon Aaziz',
      title: 'The Devoted Servant',
      content: 'Faqir Abdul Qayoom Memon Aaziz was a humble servant of God whose life was dedicated to spiritual practices and service to humanity. His simplicity and devotion inspired many to follow the path of righteousness. He was known for his powerful duas and his ability to guide people through spiritual difficulties. His legacy continues through the countless lives he touched with his wisdom and compassion.',
      pdfUrlEn: '',
      pdfUrlUr: '',
      pdfUrlSd: '',
    },
    {
      id: 'saint4',
      name: 'Faqir Dilshad Ali Mastano Dilber',
      title: 'The Heart Captivator',
      content: 'Faqir Dilshad Ali Mastano Dilber was a spiritual master whose divine love and ecstatic states captivated the hearts of devotees. His spiritual gatherings were filled with divine presence and his teachings focused on the transformative power of love for the Divine. He lived a life of complete surrender to Gods will and guided seekers to experience the joy of spiritual union.',
      pdfUrlEn: '',
      pdfUrlUr: '',
      pdfUrlSd: '',
    },
    {
      id: 'saint5',
      name: 'Sahib Zada Faqir Ali Raza Momin Ali',
      title: 'The Faithful Guide',
      content: 'Sahib Zada Faqir Ali Raza Momin Ali was a spiritual guide who carried forward the blessed legacy of his ancestors. His deep understanding of spiritual sciences and his practical approach to guiding disciples made him a beloved figure. He emphasized the importance of maintaining faith, performing regular spiritual practices, and serving humanity as means to attain divine pleasure.',
      pdfUrlEn: '',
      pdfUrlUr: '',
      pdfUrlSd: '',
    },
    {
      id: 'saint6',
      name: 'Sindh Rani',
      title: 'The Blessed Lady',
      content: 'Sindh Rani was a blessed spiritual personality whose devotion and piety made her an inspiration for women seekers. Her life demonstrated that spiritual excellence knows no gender boundaries. She was known for her powerful spiritual states and her ability to guide women on the path of spiritual development. Her legacy continues to inspire female devotees to pursue spiritual growth.',
      pdfUrlEn: '',
      pdfUrlUr: '',
      pdfUrlSd: '',
    },
  ],
  ur: [
    {
      id: 'saint1',
      name: 'حضرت سید ساکھی شاہ دیوانو',
      title: 'روحانی رہنما',
      content: 'حضرت سید ساکھی شاہ دیوانو ایک مشہور صوفی بزرگ تھے جو اپنی گہری روحانی حکمت اور مہربان تعلیمات کے لیے مشہور تھے۔ ان کی زندگی محبت، عقیدت اور انسانیت کی خدمت کے اصولوں کی مثال تھی۔ ہزاروں عقیدت مند ان کی روحانی محفلوں کی طرف کھینچے چلے آتے تھے جہاں وہ الہی علم بانٹتے اور طالبین کو راستبازی کے راستے پر رہنمائی فراہم کرتے تھے۔',
    },
    {
      id: 'saint2',
      name: 'حضرت سید ساکھی اسماعیل شاہ',
      title: 'حکمت کی روشنی',
      content: 'حضرت سید ساکھی اسماعیل شاہ ایک ممتاز روحانی استاد تھے جن کی تعلیمات نے بے شمار طالبین کے دلوں کو روشن کیا۔ اسلامی روحانیت کے بارے میں ان کا گہرا علم اور شاگردوں کو خود سازی کے راستے پر رہنمائی کرنے کی صلاحیت نے انہیں ایک قابل احترام شخصیت بنا دیا۔',
    },
    {
      id: 'saint3',
      name: 'فقیر عبدالقیوم میمن عزیز',
      title: 'وقف خادم',
      content: 'فقیر عبدالقیوم میمن عزیز خدا کے ایک عاجز خادم تھے جن کی زندگی روحانی مشقوں اور انسانیت کی خدمت کے لیے وقف تھی۔ ان کی سادگی اور عقیدت نے بہت سے لوگوں کو راستبازی کے راستے پر چلنے کی ترغیب دی۔ وہ اپنی طاقتور دعاؤں اور روحانی مشکلات میں لوگوں کی رہنمائی کرنے کی صلاحیت کے لیے مشہور تھے۔',
    },
    {
      id: 'saint4',
      name: 'فقیر دلشاد علی مستانو دلبر',
      title: 'دل ربا',
      content: 'فقیر دلشاد علی مستانو دلبر ایک روحانی استاد تھے جن کی الہی محبت اور وجدانی کیفیات نے عقیدت مندوں کے دلوں کو مسخر کر لیا۔ ان کی روحانی محفلیں الہی حضور سے بھری ہوتی تھیں اور ان کی تعلیمات الہی محبت کی تبدیلی کی طاقت پر مرکوز تھیں۔',
    },
    {
      id: 'saint5',
      name: 'صاحبزادہ فقیر علی رضا مومن علی',
      title: 'وفادار رہنما',
      content: 'صاحبزادہ فقیر علی رضا مومن علی ایک روحانی رہنما تھے جنہوں نے اپنے آباؤ اجداد کی مبارک میراث کو آگے بڑھایا۔ روحانی علوم کی ان کی گہری سمجھ اور شاگردوں کی رہنمائی کے لیے ان کا عملی انداز انہیں ایک محبوب شخصیت بنا۔',
    },
    {
      id: 'saint6',
      name: 'سندھ رانی',
      title: 'مبارک خاتون',
      content: 'سندھ رانی ایک مبارک روحانی شخصیت تھیں جن کی عقیدت اور تقویٰ نے انہیں خواتین طالبات کے لیے ایک تحریک بنا دیا۔ ان کی زندگی نے ثابت کیا کہ روحانی کمال صنفی حدود نہیں جانتا۔ وہ اپنی طاقتور روحانی کیفیات اور روحانی ترقی کے راستے پر خواتین کی رہنمائی کرنے کی صلاحیت کے لیے مشہور تھیں۔',
    },
  ],
  sd: [
    {
      id: 'saint1',
      name: 'حضرت سيد ساکهي شاهه دیوانو',
      title: 'روحاني رهنما',
      content: 'حضرت سيد ساکهي شاهه دیوانو هڪ مشهور صوفي بزرگ هئا جيڪي پنهنجي گهري روحاني حڪمت ۽ مهربان تعليمات لاءِ مشهور هئا. هنن جي زندگي محبت، عقيدت ۽ انسانيت جي خدمت جي اصولن جو مثال هئي. هزارين عقيدتمند هنن جي روحاني محفلن جي طرف ڇڪي ايندا هئا جتي هو الهي علم ونڊيندا ۽ طالبن کي راستبازي جي رستي تي رهنمائي فراهم ڪندا هئا.',
    },
    {
      id: 'saint2',
      name: 'حضرت سيد ساکهي اسماعيل شاهه',
      title: 'حڪمت جي روشني',
      content: 'حضرت سيد ساکهي اسماعيل شاهه هڪ ممتاز روحاني استاد هئا جن جي تعليمات بي شمار طالبن جي دلين کي روشن ڪيو. اسلامي روحانيت بابت هنن جو گهرو علم ۽ شاگردن کي خود سازي جي رستي تي رهنمائي ڪرڻ جي صلاحيت هنن کي هڪ قابل احترام شخصيت بڻايو.',
    },
    {
      id: 'saint3',
      name: 'فقير عبدالقيوم ميمڻ عزيز',
      title: 'وقف خادم',
      content: 'فقير عبدالقيوم ميمڻ عزيز خدا جو هڪ عاجز خادم هئا جن جي زندگي روحاني مشقن ۽ انسانيت جي خدمت لاءِ وقف هئي. هنن جي سادگي ۽ عقيدت ڪيترن ئي ماڻهن کي راستبازي جي رستي تي هلڻ جي ترغيب ڏني. هو پنهنجي طاقتور دعائن ۽ روحاني مشڪلاتن ۾ ماڻهن جي رهنمائي ڪرڻ جي صلاحيت لاءِ مشهور هئا.',
    },
    {
      id: 'saint4',
      name: 'فقير دلشاد علي مستانو دلبر',
      title: 'دل ربا',
      content: 'فقير دلشاد علي مستانو دلبر هڪ روحاني استاد هئا جن جي الهي محبت ۽ وجداني ڪيفيتن عقيدتمندن جي دلين کي مسخر ڪري ڇڏيو. هنن جون روحاني محفلون الهي حضور سان ڀريل هونديون هيون ۽ هنن جون تعليمات الهي محبت جي تبديلي جي طاقت تي مرڪوز هيون.',
    },
    {
      id: 'saint5',
      name: 'صاحبزاده فقير علي رضا مومن علي',
      title: 'وفادار رهنما',
      content: 'صاحبزاده فقير علي رضا مومن علي هڪ روحاني رهنما هئا جن پنهنجي ابا جي مبارڪ ميراث کي اڳتي وڌايو. روحاني علمن جي هنن جي گهري سمجهه ۽ شاگردن جي رهنمائي لاءِ هنن جو عملي انداز هنن کي هڪ محبوب شخصيت بڻايو.',
    },
    {
      id: 'saint6',
      name: 'سنڌ راڻي',
      title: 'مبارڪ عورت',
      content: 'سنڌ راڻي هڪ مبارڪ روحاني شخصيت هئي جن جي عقيدت ۽ تقويٰ هنن کي عورتن جي طالبات لاءِ هڪ تحريڪ بڻايو. هنن جي زندگي ثابت ڪيو ته روحاني ڪمال صنفي حدن کي نٿو ڄاڻي. هو پنهنجي طاقتور روحاني ڪيفيتن ۽ روحاني ترقي جي رستي تي عورتن جي رهنمائي ڪرڻ جي صلاحيت لاءِ مشهور هئي.',
    },
  ],
};

export default function SaintsPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [saintsData, setSaintsData] = useState(defaultSaintsData);
  const [loading, setLoading] = useState(true);

  // Fetch saints data from database for all languages
  useEffect(() => {
    const fetchAllSaints = async () => {
      setLoading(true);
      try {
        // Fetch saints for all three languages
        const [enRes, urRes, sdRes] = await Promise.all([
          fetch('/api/saints?language=en'),
          fetch('/api/saints?language=ur'),
          fetch('/api/saints?language=sd'),
        ]);

        const [enData, urData, sdData] = await Promise.all([
          enRes.json(),
          urRes.json(),
          sdRes.json(),
        ]);

        const newSaintsData = { ...defaultSaintsData };

        // Process English saints
        if (enData.saints && enData.saints.length > 0) {
          newSaintsData.en = enData.saints.map((saint, index) => ({
            id: saint.saintId || saint.id || `saint${index + 1}`,
            name: saint.name,
            title: saint.title,
            content: saint.content || saint.biography || '',
            pdfUrlEn: saint.pdfUrl || '',
            pdfUrlUr: saint.pdfUrlUr || '',
            pdfUrlSd: saint.pdfUrlSd || '',
            imageUrl: saint.imageUrl || '',
          }));
        }

        // Process Urdu saints
        if (urData.saints && urData.saints.length > 0) {
          newSaintsData.ur = urData.saints.map((saint, index) => ({
            id: saint.saintId || saint.id || `saint${index + 1}`,
            name: saint.name,
            title: saint.title,
            content: saint.content || saint.biography || '',
            pdfUrlEn: saint.pdfUrlEn || '',
            pdfUrlUr: saint.pdfUrl || '',
            pdfUrlSd: saint.pdfUrlSd || '',
            imageUrl: saint.imageUrl || '',
          }));
        }

        // Process Sindhi saints
        if (sdData.saints && sdData.saints.length > 0) {
          newSaintsData.sd = sdData.saints.map((saint, index) => ({
            id: saint.saintId || saint.id || `saint${index + 1}`,
            name: saint.name,
            title: saint.title,
            content: saint.content || saint.biography || '',
            pdfUrlEn: saint.pdfUrlEn || '',
            pdfUrlUr: saint.pdfUrlUr || '',
            pdfUrlSd: saint.pdfUrl || '',
            imageUrl: saint.imageUrl || '',
          }));
        }

        setSaintsData(newSaintsData);
      } catch (error) {
        console.error('Failed to fetch saints:', error);
        // Keep default data on error
      } finally {
        setLoading(false);
      }
    };

    fetchAllSaints();
  }, []);

  const saints = saintsData[language];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ur' || lang === 'sd');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Back to Home' : language === 'ur' ? 'واپس ہوم پیج' : 'واپس گهر'}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-center flex-1">
              {language === 'en' ? 'Blessed Saints' : language === 'ur' ? 'مقدس بزرگان' : 'مقدس بزرگ'}
            </h1>
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
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1632782532013-bd3f5f9197db?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85"
          alt="Saints"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {language === 'en' ? 'Our Blessed Saints' : language === 'ur' ? 'ہمارے مقدس بزرگان' : 'اسان جا مقدس بزرگ'}
          </h1>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue={saints[0]?.id || 'saint1'} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
            {saints.map((saint, index) => (
              <TabsTrigger key={saint.id} value={saint.id} className="text-sm">
                {language === 'en' ? `Saint ${index + 1}` : language === 'ur' ? `بزرگ ${index + 1}` : `بزرگ ${index + 1}`}
              </TabsTrigger>
            ))}
          </TabsList>

          {saints.map((saint) => (
            <TabsContent key={saint.id} value={saint.id}>
              <Card>
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className={`font-bold text-emerald-800 mb-2 ${language === 'ur' ? 'font-urdu text-4xl md:text-5xl' :
                        language === 'sd' ? 'font-sindhi text-3xl md:text-4xl' :
                          'text-3xl md:text-4xl'
                      }`}>
                      {saint.name}
                    </h2>
                    <p className="text-xl text-gray-600 mb-6">{saint.title}</p>
                    <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mb-8"></div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                      <p className={`text-gray-700 whitespace-pre-line ${language === 'ur' ? 'font-urdu text-xl leading-[2.5]' :
                        language === 'sd' ? 'font-sindhi text-lg leading-relaxed' :
                          'text-lg leading-relaxed'
                        }`}>
                        {saint.content}
                      </p>
                    </div>
                    <div>
                      <img
                        src={saint.imageUrl || "https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85"}
                        alt={saint.name}
                        className="rounded-lg shadow-xl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-emerald-50 border-emerald-200">
                      <CardContent className="p-6 text-center">
                        <h3 className="font-bold mb-2 text-emerald-800">
                          {language === 'en' ? 'English Version' : language === 'ur' ? 'انگریزی ورژن' : 'انگريزي ورزن'}
                        </h3>
                        {saint.pdfUrlEn ? (
                          <a href={saint.pdfUrlEn} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                              <Download className="mr-2 h-4 w-4" />
                              {language === 'en' ? 'Download PDF' : language === 'ur' ? 'پی ڈی ایف ڈاؤن لوڈ' : 'پي ڊي ايف ڊائون لوڊ'}
                            </Button>
                          </a>
                        ) : (
                          <Button className="bg-gray-400 cursor-not-allowed" disabled>
                            <Download className="mr-2 h-4 w-4" />
                            {language === 'en' ? 'Coming Soon' : language === 'ur' ? 'جلد آرہا ہے' : 'جلد اچي رهيو آهي'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-6 text-center">
                        <h3 className="font-bold mb-2 text-blue-800">
                          {language === 'en' ? 'Urdu Version' : language === 'ur' ? 'اردو ورژن' : 'اردو ورزن'}
                        </h3>
                        {saint.pdfUrlUr ? (
                          <a href={saint.pdfUrlUr} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <Download className="mr-2 h-4 w-4" />
                              {language === 'en' ? 'Download PDF' : language === 'ur' ? 'پی ڈی ایف ڈاؤن لوڈ' : 'پي ڊي ايف ڊائون لوڊ'}
                            </Button>
                          </a>
                        ) : (
                          <Button className="bg-gray-400 cursor-not-allowed" disabled>
                            <Download className="mr-2 h-4 w-4" />
                            {language === 'en' ? 'Coming Soon' : language === 'ur' ? 'جلد آرہا ہے' : 'جلد اچي رهيو آهي'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-6 text-center">
                        <h3 className="font-bold mb-2 text-purple-800">
                          {language === 'en' ? 'Sindhi Version' : language === 'ur' ? 'سندھی ورژن' : 'سنڌي ورزن'}
                        </h3>
                        {saint.pdfUrlSd ? (
                          <a href={saint.pdfUrlSd} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-purple-600 hover:bg-purple-700">
                              <Download className="mr-2 h-4 w-4" />
                              {language === 'en' ? 'Download PDF' : language === 'ur' ? 'پی ڈی ایف ڈاؤن لوڈ' : 'پي ڊي ايف ڊائون لوڊ'}
                            </Button>
                          </a>
                        ) : (
                          <Button className="bg-gray-400 cursor-not-allowed" disabled>
                            <Download className="mr-2 h-4 w-4" />
                            {language === 'en' ? 'Coming Soon' : language === 'ur' ? 'جلد آرہا ہے' : 'جلد اچي رهيو آهي'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
