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
  Users
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
    address: 'Dargah Address, City, Pakistan',
    phone: '+92 XXX XXXXXXX',
    email: 'info@dargah.com',
    copyright: '© 2025 Dargah of Hazrat Shah Deewano Sultan. All rights reserved.',
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
    address: 'درگاہ کا پتہ، شہر، پاکستان',
    phone: '+92 XXX XXXXXXX',
    email: 'info@dargah.com',
    copyright: '© 2025 حضرت شاہ دیوانو سلطان کی درگاہ۔ تمام حقوق محفوظ ہیں۔',
  },
  sd: {
    home: 'گھر',
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
    address: 'درگاهه جو پتو، شهر، پاڪستان',
    phone: '+92 XXX XXXXXXX',
    email: 'info@dargah.com',
    copyright: '© 2025 حضرت شاهه ديوانو سلطان جي درگاهه. سڀ حق محفوظ آهن.',
  },
};

const defaultSliderImages = [
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1666175146838-78974290e6af?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkYXJnYWglMjBzaHJpbmV8ZW58MHx8fHwxNzYwMDA5NTAzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1666175146759-ce6a39f991ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxkYXJnYWglMjBzaHJpbmV8ZW58MHx8fHwxNzYwMDA5NTAzfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1632782532013-bd3f5f9197db?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1733935610436-e1911fbee9e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxkYXJnYWglMjBzaHJpbmV8ZW58MHx8fHwxNzYwMDA5NTAzfDA&ixlib=rb-4.1.0&q=85',
];

export default function Home() {
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRTL, setIsRTL] = useState(false);
  const [sliderImages, setSliderImages] = useState(defaultSliderImages);

  const t = translations[language];

  // Fetch slider images from database
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const response = await fetch('/api/slider');
        const data = await response.json();
        if (data.slides && data.slides.length > 0) {
          // Use database slides if available
          setSliderImages(data.slides.map(slide => slide.imageUrl));
        }
      } catch (error) {
        console.error('Failed to fetch slider:', error);
        // Keep default images on error
      }
    };
    fetchSlider();
  }, []);

  useEffect(() => {
    setIsRTL(language === 'ur' || language === 'sd');
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const menuItems = [
    { key: 'home', icon: null, href: '/' },
    { key: 'introduction', icon: null, href: '/introduction' },
    { key: 'saints', icon: null, href: '/saints' },
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
    { key: 'poetry', icon: null, href: '/poetry' },
    { key: 'services', icon: null, href: '/services' },
    { key: 'news', icon: null, href: '/news' },
    { key: 'donate', icon: Heart, href: '/donate' },
    { key: 'contact', icon: Phone, href: '/contact' },
  ];

  const quickLinks = [
    { key: 'saints', icon: Users, color: 'bg-emerald-500', href: '/saints' },
    { key: 'books', icon: Book, color: 'bg-blue-500', href: '/books' },
    { key: 'audio', icon: Music, color: 'bg-purple-500', href: '/audio' },
    { key: 'video', icon: Video, color: 'bg-indigo-500', href: '/videos' },
    { key: 'events', icon: Calendar, color: 'bg-orange-500', href: '/events' },
    { key: 'gallery', icon: ImageIcon, color: 'bg-pink-500', href: '/gallery' },
    { key: 'visits', icon: MapPin, color: 'bg-teal-500', href: '/visits' },
    { key: 'donate', icon: Heart, color: 'bg-red-500', href: '/donate' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl text-emerald-700">☪</span>
              </div>
              <h1 className="text-xl font-bold">{t.welcomeTitle}</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className={`${language === 'en' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  English
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('ur')}
                  className={`${language === 'ur' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  اردو
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('sd')}
                  className={`${language === 'sd' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  سنڌي
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-1 pb-4 overflow-x-auto">
            {menuItems.slice(0, 10).map((item) => (
              item.href && (item.href.startsWith('/') ? (
                <Link key={item.key} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/10 whitespace-nowrap"
                  >
                    {t[item.key]}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={item.key}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10 whitespace-nowrap"
                  onClick={() => window.location.hash = item.href}
                >
                  {t[item.key]}
                </Button>
              ))
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-emerald-900 border-t border-emerald-600">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <div className="flex space-x-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className={`${language === 'en' ? 'bg-white/20' : ''}`}
                >
                  English
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('ur')}
                  className={`${language === 'ur' ? 'bg-white/20' : ''}`}
                >
                  اردو
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('sd')}
                  className={`${language === 'sd' ? 'bg-white/20' : ''}`}
                >
                  سنڌي
                </Button>
              </div>
              {menuItems.map((item) => (
                item.href && item.href.startsWith('/') ? (
                  <Link key={item.key} href={item.href} className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      {t[item.key]}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={item.key}
                    variant="ghost"
                    className="w-full justify-start hover:bg-white/10"
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {t[item.key]}
                  </Button>
                )
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Marquee Headline */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-lg font-semibold mx-8">☪ {t.welcomeTitle} - {t.welcomeSubtitle}</span>
          <span className="text-lg font-semibold mx-8">☪ {t.upcomingEvents}: {t.ursMubarak}</span>
          <span className="text-lg font-semibold mx-8">☪ {t.visitUs}</span>
        </div>
      </div>

      {/* Hero Slider */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">{t.welcomeTitle}</h2>
                <p className="text-xl md:text-2xl mb-8">{t.welcomeSubtitle}</p>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  {t.visitUs}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-800">{t.quickLinks}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {quickLinks.map((link) => {
            const cardContent = (
              <Card key={link.key} className="hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`${link.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <link.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{t[link.key]}</h3>
                </CardContent>
              </Card>
            );
            
            return link.href?.startsWith('/') ? (
              <Link key={link.key} href={link.href}>
                {cardContent}
              </Link>
            ) : cardContent;
          })}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85"
                alt="Islamic Pattern"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-emerald-800">{t.introduction}</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {language === 'en' && 'Welcome to the sacred Dargah of Hazrat Shah Deewano Sultan, a place of spiritual enlightenment and divine blessings. This holy shrine has been a beacon of faith and devotion for generations.'}
                {language === 'ur' && 'حضرت شاہ دیوانو سلطان کی مقدس درگاہ میں خوش آمدید، یہ روحانی روشنی اور الہی برکتوں کا مقام ہے۔ یہ مقدس مزار نسلوں سے ایمان اور عقیدت کی روشنی ہے۔'}
                {language === 'sd' && 'حضرت شاهه ديوانو سلطان جي مقدس درگاهه ۾ ڀلي ڪري آيا، هي روحاني روشني ۽ خدائي برڪتن جو جاءُ آهي۔ هي مقدس مزار نسلن کان ايمان ۽ عقيدت جي روشني آهي۔'}
              </p>
              <Link href="/introduction">
                <Button className="bg-emerald-600 hover:bg-emerald-700">{t.introduction}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-800">{t.upcomingEvents}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-emerald-600 mr-2" />
                  <span className="text-gray-600">Date: Coming Soon</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{t.ursMubarak}</h3>
                <p className="text-gray-600">
                  {language === 'en' && 'Annual Urs celebration with qawwali, ziyarat, and spiritual gatherings.'}
                  {language === 'ur' && 'سالانہ عرس کی تقریب قوالی، زیارت اور روحانی اجتماعات کے ساتھ۔'}
                  {language === 'sd' && 'سالانه عرس جو جشن قوالي، زيارت ۽ روحاني گڏجاڻين سان.'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t.visitUs}</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-1" />
                  <span>{t.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>{t.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{t.email}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t.quickLinks}</h3>
              <div className="space-y-2">
                {menuItems.slice(0, 6).map((item) => (
                  <div key={item.key}>
                    <Button variant="link" className="text-white hover:text-emerald-200 p-0">
                      {t[item.key]}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t.services}</h3>
              <div className="space-y-2">
                {['hamd', 'naat', 'audio', 'gallery', 'donate'].map((key) => (
                  <div key={key}>
                    <Button variant="link" className="text-white hover:text-emerald-200 p-0">
                      {t[key]}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-700 pt-8 text-center">
            <p>{t.copyright}</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}