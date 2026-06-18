'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Book,
  Music,
  Video,
  Image as ImageIcon,
  Heart,
  Users,
  Feather
} from 'lucide-react';

const translations = {
  en: {
    home: 'Home',
    introduction: 'Introduction',
    saints: 'Saints',
    books: 'Books',
    hamd: 'Hamd',
    naat: 'Naat',
    dua: 'Dua',
    audio: 'Audio',
    video: 'Video',
    events: 'Upcoming Events',
    pressReleases: 'Press Releases',
    gallery: 'Gallery',
    visits: 'Visits',
    ursMubarak: 'Urs Mubarak',
    poetry: 'Poetry',
    services: 'Services',
    news: 'News',
    donate: 'Donate',
    contact: 'Contact',
    welcomeTitle: 'Dargah of Hazrat Shah Deewano Sultan',
    welcomeSubtitle: 'A Sacred Place of Spiritual Enlightenment',
    quickLinks: 'Quick Links',
    upcomingEvents: 'Upcoming Events',
    latestNews: 'Latest News',
    visitUs: 'Visit Us',
    address: 'The village of Thari Nizamani, situated approximately 20 km east of Matli town in the Badin District of Sindh, Pakistan',
    phone: '03138883646',
    email: 'info@dargah.com',
    copyright: '© 2026 Dargah of Hazrat Shah Deewano Sultan. All rights reserved.',
  },
  ur: {
    home: 'ہوم',
    introduction: 'تعارف',
    saints: 'بزرگان',
    books: 'کتب',
    hamd: 'حمد',
    naat: 'نعت',
    dua: 'دعا',
    audio: 'آڈیو',
    video: 'ویڈیو',
    events: 'آئندہ تقریبات',
    pressReleases: 'پریس ریلیز',
    gallery: 'گیلری',
    visits: 'زیارت',
    ursMubarak: 'عرس مبارک',
    poetry: 'شاعری',
    services: 'خدمات',
    news: 'خبریں',
    donate: 'عطیہ',
    contact: 'رابطہ',
    welcomeTitle: 'حضرت شاہ دیوانو سلطان کی درگاہ',
    welcomeSubtitle: 'روحانی روشنی کا مقدس مقام',
    quickLinks: 'فوری لنکس',
    upcomingEvents: 'آئندہ تقریبات',
    latestNews: 'تازہ خبریں',
    visitUs: 'ہماری زیارت کریں',
    address: 'گاؤں تھری نظامانی، جو کہ سندھ کے ضلع بدین میں ماتلي شہر سے تقریباً 20 کلومیٹر مشرق میں واقع ہے۔',
    phone: '03138883646',
    email: 'info@dargah.com',
    copyright: '© 2026 حضرت شاہ دیوانو سلطان کی درگاہ۔ تمام حقوق محفوظ ہیں۔',
  },
  sd: {
    home: 'گهر',
    introduction: 'تعارف',
    saints: 'بزرگ',
    books: 'ڪتاب',
    hamd: 'حمد',
    naat: 'نعت',
    dua: 'دعا',
    audio: 'آڊيو',
    video: 'وڊيو',
    events: 'ايندڙ واقعا',
    pressReleases: 'پريس رليز',
    gallery: 'گيلري',
    visits: 'زيارت',
    ursMubarak: 'عرس مبارڪ',
    poetry: 'شاعري',
    services: 'خدمتون',
    news: 'خبرون',
    donate: 'عطيو',
    contact: 'رابطو',
    welcomeTitle: 'حضرت شاهه ديوانو سلطان جي درگاهه',
    welcomeSubtitle: 'روحاني روشني جو مقدس جاءُ',
    quickLinks: 'تڪڙو لنڪس',
    upcomingEvents: 'ايندڙ واقعا',
    latestNews: 'تازو خبرون',
    visitUs: 'اسان جي زيارت ڪريو',
    address: 'درگاهه جو پتو، شهر، پاڪستانڳوٺ ٿري نظاماڻي، جيڪو سنڌ جي ضلعي بدين ۾ ماتلي شهر کان تقريباً 20 ڪلوميٽر اوڀر طرف واقع آهي۔',
    phone: '03138883646',
    email: 'info@dargah.com',
    copyright: '© 2026 حضرت شاهه ديوانو سلطان جي درگاهه. سڀ حق محفوظ آهن.',
  },
};

const defaultSliderImages = [
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1666175146838-78974290e6af?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkYXJnYWglMjBzaHJpbmV8ZW58MHx8fHwxNzYwMDA5NTAzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1666175146759-ce6a39f991ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxkYXJnYWglMjBzaHJpbmV8ZW58MHx8fHwxNzYwMDA5NTAzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1632782532013-bd3f5f9197db?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1733935610436-e1911fbee9e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxkYXJnYWglMjBzaHJpbmV8ZW58MHx8fHwxNzYwMDA5NTAzfDA&ixlib=rb-4.1.0&q=85',
];

const homeSaints = [
  {
    id: 'saint1',
    name: {
      en: 'Hazrat Syed Sakhi Shah Deewano Sultan',
      ur: 'حضرت سید سخی شاہ دیوانو سلطان',
      sd: 'حضرت سيد سخي شاهه ديوانو سلطان'
    },
    title: {
      en: 'Founder of the Lineage',
      ur: 'سلسلے کے بانی',
      sd: 'سلسلي جو باني'
    },
    desc: {
      en: 'The great spiritual master and founder whose divine light continues to guide seekers.',
      ur: 'عظیم روحانی پیشوا اور بانی جن کا روحانی نور آج بھی سالکین کی رہنمائی کرتا ہے۔',
      sd: 'عظيم روحاني رهبر ۽ باني جنهن جي روحاني روشني سالڪن جي رهنمائي ڪري ٿي۔'
    }
  },
  {
    id: 'saint2',
    name: {
      en: 'Hazrat Syed Sakhi Ismail Shah',
      ur: 'حضرت سید سخی اسماعیل شاہ',
      sd: 'حضرت سيد سخي اسماعيل شاهه'
    },
    title: {
      en: 'Torchbearer of Light',
      ur: 'نور کے علمبردار',
      sd: 'روشني جو علمبردار'
    },
    desc: {
      en: 'A beacon of devotion and spiritual teachings who nurtured the souls of the faithful.',
      ur: 'عقیدت اور روحانی تعلیمات کا ایک مینار جنہوں نے مومنین کے دلوں کو منور کیا۔',
      sd: 'عقيدت ۽ روحاني تعليمات جو هڪ روشن مينار جنهن سالڪن کي سيراب ڪيو۔'
    }
  },
  {
    id: 'saint5',
    name: {
      en: 'Sahibzada Faqeer Ali Raza Momin Ali',
      ur: 'صاحبزادہ فقیر علی رضا مومن علی',
      sd: 'صاحبزاده فقير علي رضا مومن علي'
    },
    title: {
      en: 'Current Custodian & Guide',
      ur: 'موجودہ سجادہ نشین اور رہنما',
      sd: 'موجوده سجاده نشين ۽ روحاني رهبر'
    },
    desc: {
      en: 'Leading the spiritual mission with wisdom, compassion, and commitment to service.',
      ur: 'حکمت، ہمدردی اور خدمت کے عزم کے ساتھ روحانی مشن کی قیادت کر رہے ہیں۔',
      sd: 'حڪمت، شفقت ۽ خلقِ خدا جي خدمت واري عزم سان روحاني مشن جي اڳواڻي ڪري رهيا آهن۔'
    }
  },
  {
    id: 'saint3',
    name: {
      en: 'Faqeer Abdul Qayoom Aaziz',
      ur: 'فقیر عبدالقیوم عاجز',
      sd: 'فقير عبدالقيوم عاجز'
    },
    title: {
      en: 'Khadmeen Darbar-e-Alia',
      ur: 'خادمین دربار عالیہ',
      sd: 'خادمين دربار عاليه'
    },
    desc: {
      en: 'A humble servant dedicated to spiritual practices and service to humanity.',
      ur: 'روحانی ریاضتوں اور انسانیت کی خدمت کے لیے وقف ایک عاجز خادم۔',
      sd: 'روحاني رياضتن ۽ انسانيت جي خدمت لاءِ وقف هڪ عاجز خادم۔'
    }
  }
];

export default function Home() {
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRTL, setIsRTL] = useState(false);
  const [sliderImages, setSliderImages] = useState(defaultSliderImages);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const t = translations[language];

  // Fetch slider images from database
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const response = await fetch('/api/slider');
        const data = await response.json();
        if (data.slides && data.slides.length > 0) {
          setSliderImages(data.slides.map(slide => slide.imageUrl));
        }
      } catch (error) {
        console.error('Failed to fetch slider:', error);
      }
    };
    fetchSlider();
  }, []);

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events?language=${language}`);
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, [language]);

  useEffect(() => {
    setIsRTL(language === 'ur' || language === 'sd');
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const getFontClass = () => {
    if (language === 'ur') return 'font-urdu font-normal leading-[2.2]';
    if (language === 'sd') return 'font-sindhi font-normal leading-[2.0]';
    return 'font-sans';
  };

  const getHeadingStyle = () => {
    if (language === 'ur') return 'font-urdu font-normal leading-[2.2] text-4xl sm:text-5xl md:text-6xl lg:text-7xl';
    if (language === 'sd') return 'font-sindhi font-normal leading-[2.0] text-4xl sm:text-5xl md:text-6xl lg:text-7xl';
    return 'font-serif font-bold tracking-wide text-3xl sm:text-5xl md:text-6xl lg:text-7xl';
  };

  const desktopNavGroups = [
    { key: 'home', href: '/' },
    { key: 'introduction', href: '/introduction' },
    { key: 'saints', href: '/saints' },
    { key: 'books', href: '/books' },
    {
      key: 'media',
      label: { en: 'Media', ur: 'میڈیا', sd: 'ميڊيا' },
      items: [
        { key: 'hamd', href: '/hamd' },
        { key: 'naat', href: '/naat' },
        { key: 'dua', href: '/dua' },
        { key: 'audio', href: '/audio' },
        { key: 'video', href: '/videos' },
        { key: 'poetry', href: '/poetry' },
        { key: 'gallery', href: '/gallery' },
      ]
    },
    {
      key: 'info',
      label: { en: 'Info', ur: 'معلومات', sd: 'معلومات' },
      items: [
        { key: 'events', href: '/events' },
        { key: 'news', href: '/news' },
        { key: 'visits', href: '/visits' },
        { key: 'ursMubarak', href: '/urs' },
        { key: 'services', href: '/services' },
      ]
    },
    { key: 'donate', href: '/donate' },
    { key: 'contact', href: '/contact' }
  ];

  const quickLinks = [
    { key: 'saints', icon: Users, color: 'from-emerald-600 to-teal-700', href: '/saints' },
    { key: 'books', icon: Book, color: 'from-blue-600 to-indigo-700', href: '/books' },
    { key: 'audio', icon: Music, color: 'from-purple-600 to-pink-700', href: '/audio' },
    { key: 'video', icon: Video, color: 'from-amber-600 to-orange-700', href: '/videos' },
    { key: 'events', icon: Calendar, color: 'from-teal-600 to-emerald-700', href: '/events' },
    { key: 'gallery', icon: ImageIcon, color: 'from-pink-600 to-rose-700', href: '/gallery' },
  ];

  const mobileMenuItems = [
    { key: 'home', icon: null, href: '/' },
    { key: 'introduction', icon: null, href: '/introduction' },
    { key: 'saints', icon: Users, href: '/saints' },
    { key: 'books', icon: Book, href: '/books' },
    { key: 'hamd', icon: Music, href: '/hamd' },
    { key: 'naat', icon: Music, href: '/naat' },
    { key: 'dua', icon: null, href: '/dua' },
    { key: 'audio', icon: Music, href: '/audio' },
    { key: 'video', icon: Video, href: '/videos' },
    { key: 'events', icon: Calendar, href: '/events' },
    { key: 'pressReleases', icon: null, href: '/news' },
    { key: 'gallery', icon: ImageIcon, href: '/gallery' },
    { key: 'visits', icon: MapPin, href: '/visits' },
    { key: 'ursMubarak', icon: null, href: '/urs' },
    { key: 'poetry', icon: Feather, href: '/poetry' },
    { key: 'services', icon: null, href: '/services' },
    { key: 'donate', icon: Heart, href: '/donate' },
    { key: 'contact', icon: Phone, href: '/contact' },
  ];

  return (
    <div className={`min-h-screen bg-zinc-50 ${getFontClass()} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="emerald-glass text-white shadow-xl sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3.5">
            <div className="flex items-center space-x-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md shadow-amber-500/10 group-hover:rotate-12 transition-transform duration-500">
                <span className="text-xl text-emerald-950 font-bold">☪</span>
              </div>
              <div className="flex flex-col">
                <h1 className={`text-base sm:text-lg tracking-wide text-white ${language === 'ur' ? 'font-urdu font-normal leading-normal' : language === 'sd' ? 'font-sindhi font-normal' : 'font-bold font-serif'}`}>
                  {language === 'en' ? 'Hazrat Shah Deewano Sultan' : t.welcomeTitle}
                </h1>
                <span className="text-[10px] text-amber-400/90 tracking-widest uppercase font-medium">
                  {language === 'en' ? 'Sacred Shrine' : language === 'ur' ? 'مبارک آستانہ' : 'مبارڪ آستانو'}
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {desktopNavGroups.map((group) => {
                if (group.items) {
                  return (
                    <div key={group.key} className="relative group/dropdown">
                      <button className="flex items-center space-x-1 hover:text-amber-400 px-4 py-2 text-sm font-medium transition-colors text-white/95">
                        <span>{group.label[language]}</span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover/dropdown:rotate-180 transition-transform duration-300" />
                      </button>
                      <div className="absolute left-0 mt-1.5 w-52 bg-emerald-950/95 backdrop-blur-md border border-emerald-800/40 rounded-xl shadow-2xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 z-50 p-2.5 space-y-1">
                        {group.items.map((item) => (
                          <Link key={item.key} href={item.href}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left text-white/90 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-light rounded-lg py-2"
                            >
                              {t[item.key]}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link key={group.key} href={group.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-white/10 text-white/95 hover:text-white px-4 py-2 font-medium"
                    >
                      {t[group.key]}
                    </Button>
                  </Link>
                );
              })}

              {/* Language Selector */}
              <div className="flex items-center space-x-1.5 border-l border-white/20 pl-4 ml-4 shrink-0">
                {['en', 'ur', 'sd'].map((lang) => {
                  const label = lang === 'en' ? 'English' : lang === 'ur' ? 'اردو' : 'سنڌي';
                  const active = language === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all duration-300 font-medium ${
                        active
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 border-amber-400 font-semibold shadow-sm shadow-amber-500/25'
                          : 'border-white/10 hover:border-white/30 text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-emerald-950 border-t border-emerald-800/40 max-h-[80vh] overflow-y-auto">
            <div className="container mx-auto px-4 py-5 space-y-4">
              {/* Language Selector */}
              <div className="flex space-x-2 pb-4 border-b border-emerald-900/60 justify-center">
                {['en', 'ur', 'sd'].map((lang) => {
                  const label = lang === 'en' ? 'English' : lang === 'ur' ? 'اردو' : 'سنڌي';
                  const active = language === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex-1 py-2 text-center rounded-xl border text-sm transition-all duration-300 font-medium ${
                        active
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 border-amber-400 font-semibold'
                          : 'border-white/10 text-white/80 hover:bg-white/5'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-2 gap-2">
                {mobileMenuItems.map((item) => (
                  <Link key={item.key} href={item.href} className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/95 hover:bg-white/10 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-light text-left"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t[item.key]}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Marquee Headline */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-600 to-yellow-600 text-white py-2.5 overflow-hidden w-full border-y border-amber-500/20 shadow-inner">
        <div className="animate-smooth-marquee whitespace-nowrap items-center">
          {[1, 2, 3].map((i) => (
            <span key={i} className="text-xs sm:text-sm font-semibold tracking-wider flex items-center shrink-0">
              <span className="mx-6 text-amber-300 text-base">✦</span>
              <span>{t.welcomeTitle} - {t.welcomeSubtitle}</span>
              <span className="mx-6 text-amber-300 text-base">✦</span>
              <span>{t.upcomingEvents}: {t.ursMubarak}</span>
              <span className="mx-6 text-amber-300 text-base">✦</span>
              <span>{t.visitUs}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero Slider */}
      <div className="relative h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden w-full bg-zinc-950">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 transform ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-black/40 to-black/60 flex items-center justify-center">
              <div className="text-center text-white px-4 w-full max-w-4xl mx-auto">
                <span className="text-amber-400 text-xs sm:text-sm font-semibold tracking-widest uppercase block mb-3 animate-fade-in">
                  {language === 'en' ? 'Welcome to the Shrine' : language === 'ur' ? 'آستانہ عالیہ پر خوش آمدید' : 'آستاني عالي تي ڀلي ڪري آيا'}
                </span>
                <h2 className={`mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${getHeadingStyle()}`}>
                  {t.welcomeTitle}
                </h2>
                
                {/* Decorative separator line */}
                <div className="flex items-center justify-center space-x-4 my-5 sm:my-7">
                  <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
                  <span className="text-amber-400 text-lg drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">☪</span>
                  <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
                </div>

                <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-8 font-light text-gray-200/90 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                  {t.welcomeSubtitle}
                </p>
                <div className="flex justify-center space-x-4">
                  <a href="#quick-links">
                    <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-emerald-950 font-bold px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-base transition-all duration-300 transform hover:-translate-y-0.5 border border-amber-400/30">
                      {t.visitUs}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white h-8 w-8 sm:h-12 sm:w-12 rounded-full border border-white/10"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white h-8 w-8 sm:h-12 sm:w-12 rounded-full border border-white/10"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-amber-400 w-8 shadow-sm shadow-amber-500' : 'bg-white/40 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Sections wrapped in Islamic Pattern background */}
      <div className="islamic-pattern">
        
        {/* Quick Links Section */}
        <div id="quick-links" className="container mx-auto px-4 py-24 scroll-mt-20">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-emerald-950 font-serif">{t.quickLinks}</h2>
          <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto mb-16" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.key} href={link.href}>
                <Card className="gold-glow border border-emerald-800/10 shadow-md hover:shadow-2xl bg-white/95 backdrop-blur-sm transition-all duration-300 rounded-2xl overflow-hidden group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-md`}>
                      <link.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 tracking-wide text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                      {t[link.key]}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 py-24 text-white relative overflow-hidden">
          {/* Subtle geometric overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_0)] [background-size:20px_20px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Image Frame */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                <div className="relative p-1.5 bg-gradient-to-tr from-amber-500 via-emerald-600 to-amber-300 rounded-2xl shadow-2xl">
                  <img
                    src="https://yawkgfeihmspuubqulil.supabase.co/storage/v1/object/public/uploads/introimg/introimg.jpg"
                    alt="Dargah Hazrat Shah Deewano Sultan"
                    className="rounded-xl w-full h-[300px] sm:h-[400px] object-cover"
                  />
                </div>
              </div>

              {/* Content info */}
              <div>
                <span className="text-amber-400 font-semibold uppercase tracking-wider text-xs sm:text-sm bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-block mb-4">
                  {language === 'en' ? 'Sacred Heritage' : language === 'ur' ? 'مقدس ورثہ' : 'مقدس ورثو'}
                </span>
                <h2 className={`mb-6 text-white text-3xl sm:text-4xl md:text-5xl ${language === 'ur' ? 'font-urdu font-normal leading-[2.2]' : language === 'sd' ? 'font-sindhi font-normal leading-[2.0]' : 'font-bold font-serif'}`}>
                  {t.introduction}
                </h2>
                <div className="w-20 h-1 bg-amber-400 rounded-full mb-6" />
                <p className={`text-gray-300 mb-8 font-light ${language === 'ur' ? 'font-urdu text-lg sm:text-xl leading-[2.2]' : language === 'sd' ? 'font-sindhi text-base sm:text-lg leading-[2.0]' : 'text-base sm:text-lg leading-relaxed'}`}>
                  {language === 'en' && 'Welcome to the sacred Dargah of Hazrat Syed Sakhi Shah Deewano Sultan, a place of spiritual enlightenment, peace, and divine blessings. For generations, this holy shrine has been a sanctuary for seekers of truth, spreading the message of love, unity, and selfless devotion.'}
                  {language === 'ur' && 'حضرت سید سخی شاہ دیوانو سلطان کی مقدس درگاہ میں خوش آمدید، یہ مقام روحانی بصیرت، قلبی سکون اور الہی برکتوں کا سرچشمہ ہے۔ یہ مقدس مزار نسلوں سے حق کے متلاشیوں کے لیے پناہ گاہ رہا ہے، جہاں سے محبت، ہم آہنگی اور بے لوث خدمت کا پیغام پھیلایا جاتا ہے۔'}
                  {language === 'sd' && 'حضرت سيد سخي شاهه ديوانو سلطان جي مقدس درگاهه ۾ ڀلي ڪري آيا، هيءُ جاءِ روحاني سجاڳي، امن ۽ خدائي رحمتن جو منبع آهي۔ هيءُ مقدس مزار نسلن کان سچ جي ڳولا ڪندڙن لاءِ پناهه گاهه رهيو آهي، جتان محبت، ٻڌي ۽ نيڪيءَ جو پيغام عام ڪيو وڃي ٿو۔'}
                </p>
                <Link href="/introduction">
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-emerald-950 font-bold px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
                    {language === 'en' ? 'Explore History' : language === 'ur' ? 'تاریخ دریافت کریں' : 'تاريخ ڳوليو'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Saints Section */}
        <div id="saints-lineage" className="container mx-auto px-4 py-24 border-b border-emerald-900/10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className={`text-amber-600 font-semibold uppercase tracking-wider text-xs sm:text-sm bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-block mb-4 ${language === 'ur' ? 'font-urdu' : language === 'sd' ? 'font-sindhi' : ''}`}>
              {language === 'en' ? 'Spiritual Lineage' : language === 'ur' ? 'روحانی سلسلہ' : 'روحاني سلسلو'}
            </span>
            <h2 className={`text-3xl md:text-5xl mb-4 text-emerald-950 ${language === 'ur' ? 'font-urdu font-normal leading-[1.6]' : language === 'sd' ? 'font-sindhi font-normal leading-[1.6]' : 'font-serif font-bold'}`}>
              {language === 'en' ? 'The Noble Saints' : language === 'ur' ? 'برگزیدہ ہستیاں' : 'مقدس هستيون'}
            </h2>
            <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto my-4" />
            <p className={`text-gray-600 font-light text-base md:text-lg ${language === 'ur' ? 'font-urdu leading-[1.8]' : language === 'sd' ? 'font-sindhi leading-[1.8]' : ''}`}>
              {language === 'en' ? 'Discover the sacred history, teachings, and life stories of the spiritual guides who have graced this holy seat.' 
                : language === 'ur' ? 'اس مقدس آستانے کو زینت بخشنے والے روحانی رہنماؤں کی مقدس تاریخ، تعلیمات اور سوانح حیات دریافت کریں۔' 
                : 'هن مقدس آستاني کي زينت بخشيندڙ روحاني رهبرن جي مقدس تاريخ، تعليمات ۽ سوانح حيات ڳوليو۔'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeSaints.map((saint) => {
              const IconComponent = {
                saint1: Feather,
                saint2: Heart,
                saint5: Users,
                saint3: Book
              }[saint.id] || Feather;

              return (
                <Link key={saint.id} href={`/saints?id=${saint.id}`} className="group">
                  <div className="relative overflow-hidden rounded-3xl bg-white border border-emerald-800/10 p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full min-h-[360px] justify-between">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-amber-500/5 group-hover:bg-amber-500/10 transition-all duration-500 blur-xl pointer-events-none" />
                    
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      <span className={`text-[10px] text-amber-600 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase inline-block mb-3 ${language === 'ur' ? 'font-urdu' : language === 'sd' ? 'font-sindhi' : ''}`}>
                        {saint.title[language]}
                      </span>
                      
                      <h3 className={`text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-800 transition-colors line-clamp-2 ${language === 'ur' ? 'font-urdu font-normal leading-[1.6]' : language === 'sd' ? 'font-sindhi font-normal leading-[1.6]' : 'font-serif'}`}>
                        {saint.name[language]}
                      </h3>
                      
                      <p className={`text-gray-600 leading-relaxed font-light text-sm line-clamp-4 ${language === 'ur' ? 'font-urdu leading-[1.8]' : language === 'sd' ? 'font-sindhi leading-[1.8]' : ''}`}>
                        {saint.desc[language]}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-6">
                      <span className="text-xs text-emerald-800 group-hover:text-amber-600 font-semibold flex items-center space-x-1.5 transition-colors duration-300">
                        <span className={language === 'ur' ? 'font-urdu' : language === 'sd' ? 'font-sindhi' : ''}>
                          {language === 'en' ? 'Read Biography' : language === 'ur' ? 'سوانح حیات پڑھیں' : 'سوانح حيات پڙهو'}
                        </span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link href="/saints">
              <Button className="bg-emerald-900 hover:bg-emerald-800 text-white font-medium px-8 py-5 rounded-xl shadow-lg transition-all duration-300 border border-emerald-800/20 text-sm">
                <span className={language === 'ur' ? 'font-urdu' : language === 'sd' ? 'font-sindhi' : ''}>
                  {language === 'en' ? 'Explore All Saints' : language === 'ur' ? 'تمام بزرگان کی تفصیلات' : 'سڀني بزرگن جو احوال'}
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Events Section */}
        <div className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-emerald-950 font-serif">{t.upcomingEvents}</h2>
            <div className="w-20 h-1 bg-amber-500 rounded-full mx-auto mb-16" />
            
            {eventsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm border border-emerald-800/10 rounded-2xl max-w-lg mx-auto">
                <Calendar className="mx-auto h-16 w-16 mb-4 text-emerald-700/30" />
                <p className="text-gray-500 font-medium">
                  {language === 'en' ? 'No upcoming events scheduled' : language === 'ur' ? 'کوئی آئندہ تقریب طے نہیں ہے' : 'ڪو به ايندڙ واقعو طي ٿيل ناهي'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {events.slice(0, 3).map((event) => (
                  <Card key={event.id} className="gold-glow border border-emerald-800/10 shadow-md hover:shadow-2xl bg-white/95 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full group">
                    <CardContent className="p-8 flex flex-col h-full">
                      {/* Date Badge */}
                      <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3.5 py-2 rounded-full text-xs font-semibold w-fit border border-amber-100/50 mb-6">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <span>
                          {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'ur' ? 'ur-PK' : 'sd-PK', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-800 transition-colors">{event.title}</h3>
                      <p className="text-gray-600 leading-relaxed font-light mb-6 flex-1 line-clamp-4">{event.description}</p>
                      
                      <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-sm mt-auto">
                        <Link href="/events" className="text-emerald-700 hover:text-amber-600 font-semibold flex items-center space-x-1 transition-colors group-hover:translate-x-1 duration-300">
                          <span>{language === 'en' ? 'View Details' : language === 'ur' ? 'تفصیلات دیکھیں' : 'تفصيل ڏسو'}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-zinc-950 to-black text-gray-400 py-16 border-t border-emerald-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Brand & Contact */}
            <div className="md:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <span className="text-xl text-emerald-950 font-bold">☪</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">{t.welcomeTitle}</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {t.welcomeSubtitle}
              </p>
              <div className="space-y-4 pt-2">
                <a href="https://www.google.com/maps/place/Shrine+of+Shah+Deewano+Sultan./@25.0509363,68.8409216,17z/data=!3m1!4b1!4m6!3m5!1s0x394c2624a69d24ed:0x8a9c8643fa361994!8m2!3d25.0509363!4d68.8409216!16s%2Fg%2F12hl0mzf1?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="flex items-start text-gray-400 hover:text-amber-400 transition-colors group">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-sm leading-relaxed">{t.address}</span>
                </a>
                <a href="https://wa.me/923138883646" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-amber-400 transition-colors group">
                  <Phone className="h-5 w-5 mr-3 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-sm">{t.phone}</span>
                </a>
                <a href="mailto:info@dargah.com" className="flex items-center text-gray-400 hover:text-amber-400 transition-colors group">
                  <Mail className="h-5 w-5 mr-3 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-sm">{t.email}</span>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-white font-bold text-base tracking-wider uppercase mb-6 relative w-fit">
                {t.quickLinks}
                <div className="absolute -bottom-1 left-0 w-8 h-[2px] bg-amber-400" />
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'home', href: '/' },
                  { key: 'introduction', href: '/introduction' },
                  { key: 'saints', href: '/saints' },
                  { key: 'books', href: '/books' },
                  { key: 'events', href: '/events' },
                  { key: 'news', href: '/news' },
                ].map((item) => (
                  <Link key={item.key} href={item.href} className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all duration-300 w-fit">
                    {t[item.key]}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Media Services */}
            <div>
              <h3 className="text-white font-bold text-base tracking-wider uppercase mb-6 relative w-fit">
                {language === 'en' ? 'Media' : language === 'ur' ? 'میڈیا' : 'ميڊيا'}
                <div className="absolute -bottom-1 left-0 w-8 h-[2px] bg-amber-400" />
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'hamd', href: '/hamd' },
                  { key: 'naat', href: '/naat' },
                  { key: 'dua', href: '/dua' },
                  { key: 'audio', href: '/audio' },
                  { key: 'video', href: '/videos' },
                  { key: 'gallery', href: '/gallery' },
                ].map((item) => (
                  <Link key={item.key} href={item.href} className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all duration-300 w-fit">
                    {t[item.key]}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 4: Devotional Services */}
            <div>
              <h3 className="text-white font-bold text-base tracking-wider uppercase mb-6 relative w-fit">
                {language === 'en' ? 'Services' : language === 'ur' ? 'خدمات' : 'خدمتون'}
                <div className="absolute -bottom-1 left-0 w-8 h-[2px] bg-amber-400" />
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'visits', href: '/visits' },
                  { key: 'ursMubarak', href: '/urs' },
                  { key: 'poetry', href: '/poetry' },
                  { key: 'services', href: '/services' },
                  { key: 'donate', href: '/donate' },
                  { key: 'contact', href: '/contact' },
                ].map((item) => (
                  <Link key={item.key} href={item.href} className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all duration-300 w-fit">
                    {t[item.key]}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-8 mt-12 text-center text-sm text-gray-500 font-light flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>{t.copyright}</p>
            <div className="flex items-center space-x-2 text-xs text-amber-500/60">
              <span>Made with Devotion</span>
              <Heart className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}