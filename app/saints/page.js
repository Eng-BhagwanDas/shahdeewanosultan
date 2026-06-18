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
      name: 'Faqeer Abdul Qayoom Aaziz',
      title: 'Khadmeen Darbar-e-Alia',
      content: 'Faqeer Abdul Qayoom Aaziz was a dedicated custodian and one of the devoted Khadmeen of Darbar-e-Alia whose life was spent in spiritual practices, the service of the sacred shrine, and humanity. His simplicity, deep devotion, and selfless service inspired many to follow the path of righteousness. He was known for his powerful duas and his ability to guide people through spiritual difficulties. His legacy continues through the countless lives he touched with his wisdom and compassion.',
      pdfUrlEn: '',
      pdfUrlUr: '',
      pdfUrlSd: '',
    },
    {
      id: 'saint4',
      name: 'Faqeer Dilshad Ali Mastano Dilbar',
      title: 'The Heart Captivator',
      content: 'Faqeer Dilshad Ali Mastano Dilbar was a spiritual master whose divine love and ecstatic states captivated the hearts of devotees. His spiritual gatherings were filled with divine presence and his teachings focused on the transformative power of love for the Divine. He lived a life of complete surrender to Gods will and guided seekers to experience the joy of spiritual union.',
      pdfUrlEn: '',
      pdfUrlUr: '',
      pdfUrlSd: '',
    },
    {
      id: 'saint5',
      name: 'Sahibzada Faqeer Ali Raza Momin Ali',
      title: 'The Faithful Guide',
      content: 'Sahibzada Faqeer Ali Raza Momin Ali was a spiritual guide who carried forward the blessed legacy of his ancestors. His deep understanding of spiritual sciences and his practical approach to guiding disciples made him a beloved figure. He emphasized the importance of maintaining faith, performing regular spiritual practices, and serving humanity as means to attain divine pleasure.',
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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('saint1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabId = params.get('id');
      if (tabId) {
        setActiveTab(tabId);
      }
    }
  }, []);

  // Local translation dictionary for UI elements
  const t = {
    en: {
      backHome: 'Back to Home',
      title: 'Blessed Saints',
      subtitle: 'Lives of the Saints',
      desc: 'Discover the spiritual legacy and teachings of our revered masters.',
      nobleSaint: 'Noble Saint',
      downloads: 'Downloads & Resources',
      comingSoon: 'Coming Soon',
      pdfDownload: 'Download PDF',
      loading: 'Loading Spiritual Wisdom...',
    },
    ur: {
      backHome: 'ہوم پیج پر واپس جائیں',
      title: 'مقدس بزرگان',
      subtitle: 'اولیاء اللہ کا تذکرہ',
      desc: 'ہمارے معزز بزرگوں کی روحانی میراث اور تعلیمات کو دریافت کریں۔',
      nobleSaint: 'عظیم بزرگ',
      downloads: 'ڈاؤن لوڈ اور وسائل',
      comingSoon: 'جلد آرہا ہے',
      pdfDownload: 'پی ڈی ایف ڈاؤن لوڈ کریں',
      loading: 'روحانی علم لوڈ ہو رہا ہے...',
    },
    sd: {
      backHome: 'مکيه صفحي ڏانهن واپس',
      title: 'مقدس بزرگ',
      subtitle: 'اولياء الله جو ذڪر',
      desc: 'اسان جي معزز بزرگن جي روحاني ورثي ۽ تعليمات کي دريافت ڪريو.',
      nobleSaint: 'عظيم بزرگ',
      downloads: 'ڊائون لوڊ ۽ وسيلا',
      comingSoon: 'جلد اچي رهيو آهي',
      pdfDownload: 'پي ڊي ايف ڊائون لوڊ',
      loading: 'روحاني علم لوڊ ٿي رهيو آهي...',
    }
  }[language];

  // Fetch saints data from database for all languages
  useEffect(() => {
    const fetchAllSaints = async () => {
      try {
        const res = await fetch('/api/saints?language=all');
        const data = await res.json();
        const allSaints = data.saints || [];

        const enSaints = allSaints.filter(s => s.language === 'en');
        const urSaints = allSaints.filter(s => s.language === 'ur');
        const sdSaints = allSaints.filter(s => s.language === 'sd');

        const newSaintsData = { ...defaultSaintsData };

        const mergeSaintsData = (defaultSaints, apiSaints) => {
          if (!apiSaints || apiSaints.length === 0) return defaultSaints;
          
          const merged = [...defaultSaints];
          const matchedApiIds = new Set();

          const processedDefaults = merged.map((defaultSaint) => {
            const apiSaint = apiSaints.find(
              (s) => s.id === defaultSaint.id || s.saintId === defaultSaint.id
            );
            if (apiSaint) {
              matchedApiIds.add(apiSaint.id || apiSaint.saintId);
              return {
                id: apiSaint.saintId || apiSaint.id,
                name: apiSaint.name || defaultSaint.name,
                title: apiSaint.title || defaultSaint.title,
                content: apiSaint.content || apiSaint.biography || defaultSaint.content,
                pdfUrlEn: apiSaint.pdfUrlEn || apiSaint.pdfUrl || defaultSaint.pdfUrlEn,
                pdfUrlUr: apiSaint.pdfUrlUr || defaultSaint.pdfUrlUr,
                pdfUrlSd: apiSaint.pdfUrlSd || defaultSaint.pdfUrlSd,
                imageUrl: apiSaint.imageUrl || defaultSaint.imageUrl || '',
                order: apiSaint.order || defaultSaint.order || 99,
              };
            }
            return defaultSaint;
          });

          const newApiSaints = apiSaints
            .filter((s) => !matchedApiIds.has(s.id) && !matchedApiIds.has(s.saintId))
            .map((apiSaint, idx) => ({
              id: apiSaint.saintId || apiSaint.id || `new_saint_${idx}`,
              name: apiSaint.name,
              title: apiSaint.title,
              content: apiSaint.content || apiSaint.biography || '',
              pdfUrlEn: apiSaint.pdfUrlEn || apiSaint.pdfUrl || '',
              pdfUrlUr: apiSaint.pdfUrlUr || '',
              pdfUrlSd: apiSaint.pdfUrlSd || '',
              imageUrl: apiSaint.imageUrl || '',
              order: apiSaint.order || 100 + idx,
            }));

          const combined = [...processedDefaults, ...newApiSaints];
          return combined.sort((a, b) => (a.order || 99) - (b.order || 99));
        };

        newSaintsData.en = mergeSaintsData(defaultSaintsData.en, enSaints);
        
        newSaintsData.ur = mergeSaintsData(defaultSaintsData.ur, urSaints).map(s => {
          const apiMatch = urSaints?.find(db => db.id === s.id || db.saintId === s.id);
          if (apiMatch) {
             s.pdfUrlUr = apiMatch.pdfUrlUr || apiMatch.pdfUrl || s.pdfUrlUr;
          }
          return s;
        });

        newSaintsData.sd = mergeSaintsData(defaultSaintsData.sd, sdSaints).map(s => {
          const apiMatch = sdSaints?.find(db => db.id === s.id || db.saintId === s.id);
          if (apiMatch) {
             s.pdfUrlSd = apiMatch.pdfUrlSd || apiMatch.pdfUrl || s.pdfUrlSd;
          }
          return s;
        });

        setSaintsData(newSaintsData);
      } catch (error) {
        console.error('Failed to fetch saints:', error);
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
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-emerald-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_0)] [background-size:20px_20px]" />
        <div className="text-center relative z-10">
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
            <span className="text-amber-400 text-3xl">☪</span>
          </div>
          <p className="text-amber-200/90 text-lg font-light tracking-wide animate-pulse">
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-zinc-950 via-emerald-950 to-zinc-950 text-white ${isRTL ? 'rtl' : 'ltr'} ${language === 'ur' ? 'font-urdu' : language === 'sd' ? 'font-sindhi' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-emerald-950/80 border-b border-emerald-800/30 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white transition-colors rounded-xl border border-white/5 bg-white/5">
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {t.backHome}
              </Button>
            </Link>
            
            <h1 className="text-lg md:text-2xl font-bold text-center flex-1 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
              {t.title}
            </h1>
            
            <div className="flex space-x-1.5 bg-black/20 p-1 rounded-xl border border-white/5">
              {['en', 'ur', 'sd'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-300 font-semibold ${
                    language === lang
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 shadow-md font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang === 'en' ? 'ENG' : lang === 'ur' ? 'اردو' : 'سنڌي'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-emerald-950 to-zinc-950 border-b border-emerald-900/30">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fbbf24_1px,transparent_0)] [background-size:20px_20px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-amber-400 text-xl drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">☪</span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          
          <h2 className={`text-4xl md:text-6xl text-white mb-4 drop-shadow-md tracking-wide ${language === 'ur' ? 'font-urdu font-normal leading-[2.2]' : language === 'sd' ? 'font-sindhi font-normal leading-[2.0]' : 'font-bold font-serif'}`}>
            {t.subtitle}
          </h2>
          <p className={`text-emerald-200/80 max-w-2xl mx-auto font-light ${language === 'ur' ? 'text-lg md:text-xl leading-[2.2]' : language === 'sd' ? 'text-lg md:text-xl leading-[2.0]' : 'text-base md:text-xl leading-relaxed'}`}>
            {t.desc}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="flex flex-col lg:flex-row gap-8 md:gap-12">

          {/* Sidebar / Tabs List */}
          <TabsList className="flex flex-row flex-nowrap lg:flex-col items-stretch justify-start w-full lg:w-1/4 h-auto bg-transparent p-0 gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 min-w-0 border-none no-scrollbar mobile-tab-list">
            {saints.map((saint) => (
              <TabsTrigger
                key={saint.id}
                value={saint.id}
                className={cn(
                  "relative flex flex-col items-start justify-center p-5 rounded-2xl border transition-all duration-300 text-left whitespace-normal h-auto min-h-[6.5rem] w-64 sm:w-72 lg:w-full shrink-0 flex-shrink-0 group mobile-tab-trigger",
                  "border-emerald-800/20 bg-emerald-950/15 text-gray-300 hover:text-white hover:bg-emerald-900/30 hover:border-amber-500/20",
                  "data-[state=active]:bg-emerald-900/60 data-[state=active]:border-amber-400 data-[state=active]:text-amber-400 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/5 data-[state=active]:scale-[1.02]",
                  isRTL 
                    ? "data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:right-0 data-[state=active]:after:top-1/4 data-[state=active]:after:bottom-1/4 data-[state=active]:after:w-1 data-[state=active]:after:bg-amber-400 data-[state=active]:after:rounded-l-full"
                    : "data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:top-1/4 data-[state=active]:after:bottom-1/4 data-[state=active]:after:w-1 data-[state=active]:after:bg-amber-400 data-[state=active]:after:rounded-r-full"
                )}
              >
                <span className={cn(
                  "text-sm md:text-base line-clamp-1 w-full transition-colors group-hover:text-white group-data-[state=active]:text-amber-400",
                  isRTL ? "text-right" : "text-left",
                  language === 'ur' ? 'font-urdu font-normal leading-[1.8]' : language === 'sd' ? 'font-sindhi font-normal leading-[1.8]' : 'font-bold'
                )}>
                  {saint.name}
                </span>
                <span className={cn(
                  "text-xs mt-1.5 font-light line-clamp-1 w-full transition-colors opacity-75 group-hover:opacity-100",
                  isRTL ? "text-right text-emerald-400/80" : "text-left text-emerald-300/80",
                  language === 'ur' ? 'font-urdu font-normal leading-[1.8]' : language === 'sd' ? 'font-sindhi font-normal leading-[1.8]' : ''
                )}>
                  {saint.title}
                </span>
                
                {isRTL ? (
                  <ChevronRight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-300 rotate-180" />
                ) : (
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-300" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {saints.map((saint) => (
              <TabsContent key={saint.id} value={saint.id} className="mt-0 focus-visible:outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                <Card className="border border-emerald-500/20 shadow-2xl bg-emerald-950/20 backdrop-blur-md overflow-hidden rounded-3xl relative gold-glow">
                  <CardContent className="p-0">
                    
                    {/* Header Image Cover */}
                    <div className="relative h-64 md:h-[400px] w-full overflow-hidden group">
                      <img
                        src={saint.imageUrl || "https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85"}
                        alt={saint.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/45 to-transparent"></div>
                      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                      
                      <div className={`absolute bottom-0 ${isRTL ? 'right-0 text-right' : 'left-0 text-left'} p-6 md:p-10 text-white w-full`}>
                        <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full backdrop-blur-md shadow-sm">
                          <span className="text-amber-400">✦</span>
                          <span>{t.nobleSaint}</span>
                        </div>
                        
                        <h2 className={`text-2xl md:text-5xl mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] ${language === 'ur' ? 'font-urdu font-normal leading-[2.2]' : language === 'sd' ? 'font-sindhi font-normal leading-[2.0]' : 'font-bold font-serif leading-tight'}`}>
                          {saint.name}
                        </h2>
                        <p className={`text-amber-200/90 text-base md:text-xl font-medium drop-shadow-md italic ${language === 'ur' ? 'font-urdu font-normal leading-[1.8]' : language === 'sd' ? 'font-sindhi font-normal leading-[1.8]' : ''}`}>{saint.title}</p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-12 bg-gradient-to-b from-emerald-950/45 to-zinc-950/60">
                      <div className="prose prose-invert prose-lg max-w-none">
                        <p className={`whitespace-pre-line text-gray-200/95 text-justify ${language === 'ur' ? 'font-urdu text-xl md:text-2xl leading-[2.2]' : language === 'sd' ? 'font-sindhi text-lg md:text-xl leading-[1.8]' : 'text-base md:text-lg leading-relaxed'}`}>
                          {saint.content}
                        </p>
                      </div>

                      {/* Downloads and Resources Section */}
                      <div className="mt-12 pt-8 border-t border-emerald-900/40">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                          <Download className="h-5 w-5 text-amber-400" />
                          <span className="font-serif tracking-wide">{t.downloads}</span>
                        </h3>

                        <div className="grid sm:grid-cols-3 gap-6">
                          {[
                            { lang: 'English', code: 'En', label: 'English PDF', url: saint.pdfUrlEn, color: 'from-amber-500/20 to-yellow-600/10 hover:border-amber-400/40 hover:from-amber-500/30' },
                            { lang: 'Urdu', code: 'Ur', label: 'Urdu PDF', url: saint.pdfUrlUr, color: 'from-emerald-500/20 to-teal-600/10 hover:border-emerald-400/40 hover:from-emerald-500/30' },
                            { lang: 'Sindhi', code: 'Sd', label: 'Sindhi PDF', url: saint.pdfUrlSd, color: 'from-cyan-500/20 to-blue-600/10 hover:border-cyan-400/40 hover:from-cyan-500/30' }
                          ].map((item) => {
                            const hasUrl = !!item.url;
                            return (
                              <div key={item.code} className="group relative">
                                {hasUrl ? (
                                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                                    <div className={`h-full p-5 rounded-2xl border border-emerald-800/20 bg-gradient-to-br ${item.color} transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between min-h-[110px]`}>
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90">
                                          {item.lang}
                                        </span>
                                        <Download className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                      </div>
                                      <div className={`font-semibold text-white group-hover:text-amber-300 transition-colors text-sm sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}>
                                        {t.pdfDownload}
                                      </div>
                                    </div>
                                  </a>
                                ) : (
                                  <div className="h-full p-5 rounded-2xl border border-emerald-900/30 bg-emerald-950/10 opacity-50 flex flex-col justify-between min-h-[110px]">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                        {item.lang}
                                      </span>
                                      <Download className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div className={`font-semibold text-gray-500 text-sm sm:text-base ${isRTL ? 'text-right' : 'text-left'}`}>
                                      {t.comingSoon}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
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
