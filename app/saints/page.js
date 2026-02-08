'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Default saints data as fallback
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
    <div className={`min-h-screen bg-neutral-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Back to Home' : language === 'ur' ? 'واپس ہوم پیج' : 'واپس گهر'}
              </Button>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-center flex-1 tracking-wide">
              {language === 'en' ? 'Blessed Saints' : language === 'ur' ? 'مقدس بزرگان' : 'مقدس بزرگ'}
            </h1>
            <div className="flex space-x-1">
              {['en', 'ur', 'sd'].map((lang) => (
                <Button
                  key={lang}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLanguageChange(lang)}
                  className={cn(
                    "uppercase text-xs font-semibold px-2 hover:bg-white/10 hover:text-white",
                    language === lang ? "bg-white/20 text-white ring-1 ring-white/30" : "text-emerald-100"
                  )}
                >
                  {lang === 'en' ? 'ENG' : lang === 'ur' ? 'اردو' : 'سنڌي'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-emerald-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
            {language === 'en' ? 'Lives of the Saints' : language === 'ur' ? 'اولیاء اللہ کا تذکرہ' : 'اولياء الله جو ذڪر'}
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl opacity-90 max-w-2xl">
            {language === 'en'
              ? 'Discover the spiritual legacy and teachings of our revered masters.'
              : language === 'ur'
                ? 'ہمارے معزز بزرگوں کی روحانی میراث اور تعلیمات کو دریافت کریں۔'
                : 'اسان جي معزز بزرگن جي روحاني ورثي ۽ تعليمات کي دريافت ڪريو.'}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <Tabs defaultValue={saints[0]?.id || 'saint1'} orientation="vertical" className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar / Tabs List */}
          <TabsList className="flex lg:flex-col items-stretch justify-start lg:w-1/4 h-auto bg-transparent p-0 space-x-2 lg:space-x-0 lg:space-y-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 min-w-0">
            {saints.map((saint) => (
              <TabsTrigger
                key={saint.id}
                value={saint.id}
                className={cn(
                  "relative flex flex-col items-start justify-center p-4 rounded-xl border border-transparent transition-all duration-300 text-left whitespace-normal h-auto min-h-[5rem]",
                  "data-[state=active]:bg-white data-[state=active]:border-emerald-100 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02]",
                  "data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:top-1/4 data-[state=active]:after:bottom-1/4 data-[state=active]:after:w-1 data-[state=active]:after:bg-emerald-500 data-[state=active]:after:rounded-r-full",
                  "hover:bg-white/50 hover:border-emerald-100/50"
                )}
              >
                <span className={cn(
                  "font-bold text-base md:text-lg line-clamp-2 w-full",
                  "data-[state=active]:text-emerald-800 text-slate-600"
                )}>
                  {saint.name}
                </span>
                <span className="text-xs text-emerald-600/70 mt-1 uppercase tracking-wider font-semibold hidden md:block">
                  {saint.title?.split(' ')[0]}...
                </span>
                {isRTL ? (
                  <ChevronRight className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-200 opacity-0 data-[state=active]:opacity-100 transition-opacity rotate-180" />
                ) : (
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-200 opacity-0 data-[state=active]:opacity-100 transition-opacity" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {saints.map((saint) => (
              <TabsContent key={saint.id} value={saint.id} className="mt-0 focus-visible:outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl ring-1 ring-slate-900/5">
                  <div className="md:flex">
                    {/* Image Section - Mobile: Top, Desktop: Right Side or Left Side? Let's go with standard Layout */}
                  </div>

                  <CardContent className="p-0">
                    <div className="relative h-64 md:h-96 w-full overflow-hidden group">
                      <img
                        src={saint.imageUrl || "https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85"}
                        alt={saint.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-8 text-white">
                        <div className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider uppercase bg-emerald-500/90 rounded-full backdrop-blur-md">
                          {language === 'en' ? 'Noble Saint' : language === 'ur' ? 'عظیم بزرگ' : 'عظيم بزرگ'}
                        </div>
                        <h2 className={`font-bold text-3xl md:text-5xl leading-tight mb-2 ${language === 'ur' ? 'font-urdu' : language === 'sd' ? 'font-sindhi' : ''}`}>
                          {saint.name}
                        </h2>
                        <p className="text-emerald-100 text-lg font-medium">{saint.title}</p>
                      </div>
                    </div>

                    <div className="p-8 md:p-12">
                      <div className="prose prose-lg max-w-none prose-headings:text-emerald-900 prose-p:text-slate-600 prose-a:text-emerald-600">
                        <p className={`whitespace-pre-line ${language === 'ur' ? 'font-urdu text-xl leading-[2.2]' : language === 'sd' ? 'font-sindhi text-lg leading-relaxed' : 'text-lg leading-relaxed text- justify'}`}>
                          {saint.content}
                        </p>
                      </div>

                      <div className="mt-12 pt-8 border-t border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                          <Download className="mr-2 h-5 w-5 text-emerald-500" />
                          {language === 'en' ? 'Downloads & Resources' : language === 'ur' ? 'ڈاؤن لوڈ اور وسائل' : 'ڊائون لوڊ ۽ وسيلا'}
                        </h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                          {/* PDF Buttons */}
                          {[
                            { lang: 'English', code: 'En', labelEn: 'English PDF', labelUr: 'انگریزی پی ڈی ایف', labelSd: 'انگريزي پي ڊي ايف', url: saint.pdfUrlEn, color: 'emerald' },
                            { lang: 'Urdu', code: 'Ur', labelEn: 'Urdu PDF', labelUr: 'اردو پی ڈی ایف', labelSd: 'اردو پي ڊي ايف', url: saint.pdfUrlUr, color: 'blue' },
                            { lang: 'Sindhi', code: 'Sd', labelEn: 'Sindhi PDF', labelUr: 'سندھی پی ڈی ایف', labelSd: 'سنڌي پي ڊي ايف', url: saint.pdfUrlSd, color: 'purple' }
                          ].map((item) => (
                            <div key={item.code} className="group relative">
                              {item.url ? (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                                  <div className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer 
                                      ${item.color === 'emerald' ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-300' :
                                      item.color === 'blue' ? 'bg-blue-50 border-blue-100 hover:border-blue-300' :
                                        'bg-purple-50 border-purple-100 hover:border-purple-300'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className={`text-xs font-bold uppercase tracking-wider 
                                          ${item.color === 'emerald' ? 'text-emerald-600' :
                                          item.color === 'blue' ? 'text-blue-600' :
                                            'text-purple-600'}`}>
                                        {item.lang}
                                      </span>
                                      <Download className={`h-4 w-4 opacity-50 
                                          ${item.color === 'emerald' ? 'text-emerald-600' :
                                          item.color === 'blue' ? 'text-blue-600' :
                                            'text-purple-600'}`} />
                                    </div>
                                    <div className={`font-semibold ${isRTL ? 'text-right' : 'text-left'} 
                                         ${item.color === 'emerald' ? 'text-emerald-900 cover' :
                                        item.color === 'blue' ? 'text-blue-900' :
                                          'text-purple-900'}`}>
                                      {language === 'en' ? item.labelEn : language === 'ur' ? item.labelUr : item.labelSd}
                                    </div>
                                  </div>
                                </a>
                              ) : (
                                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 opacity-60">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                      {item.lang}
                                    </span>
                                    <Download className="h-4 w-4 text-slate-300" />
                                  </div>
                                  <div className={`font-semibold text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {language === 'en' ? 'Coming Soon' : language === 'ur' ? 'جلد آرہا ہے' : 'جلد اچي رهيو آهي'}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
