'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Feather, BookOpen } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Sufi Poetry',
    backToHome: 'Back to Home',
    subtitle: 'Divine Verses of Spiritual Masters',
    noPoetry: 'No poetry available yet',
    description: 'Sufi poetry is a profound expression of divine love and spiritual longing. The blessed saints of this shrine have left behind beautiful verses that continue to inspire seekers of truth.',
    viewMore: 'Read Full Poem',
  },
  ur: {
    title: 'صوفی شاعری',
    backToHome: 'واپس ہوم پیج',
    subtitle: 'روحانی اساتذہ کے الہی کلام',
    noPoetry: 'ابھی کوئی شاعری دستیاب نہیں',
    description: 'صوفی شاعری الہی محبت اور روحانی تڑپ کا گہرا اظہار ہے۔ اس درگاہ کے مبارک بزرگوں نے خوبصورت کلام چھوڑا ہے جو حق کے طالبین کو مسلسل متاثر کرتا رہتا ہے۔',
    viewMore: 'مکمل کلام پڑھیں',
  },
  sd: {
    title: 'صوفي شاعري',
    backToHome: 'واپس گهر',
    subtitle: 'روحاني استادن جا الهي ڪلام',
    noPoetry: 'هاڻي ڪا به شاعري موجود ناهي',
    description: 'صوفي شاعري الهي محبت ۽ روحاني تڙپ جو گهرو اظهار آهي. هن درگاهه جي مبارڪ بزرگن سهڻا ڪلام ڇڏيا آهن جيڪي حق جي طالبن کي مسلسل متاثر ڪندا رهن ٿا.',
    viewMore: 'مڪمل ڪلام پڙهو',
  },
};

export default function PoetryPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [poetry, setPoetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    setIsRTL(language === 'ur' || language === 'sd');
    fetchPoetry();
  }, [language]);

  const fetchPoetry = async () => {
    try {
      const response = await fetch(`/api/poetry?language=${language}`);
      const data = await response.json();
      setPoetry(data.poetry || []);
    } catch (error) {
      console.error('Failed to fetch poetry:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200" alt="Poetry" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <Feather className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2 opacity-90">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Description */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">{t.description}</p>
          </CardContent>
        </Card>

        {/* Poetry List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : poetry.length === 0 ? (
          <div className="text-center py-12">
            <Feather className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{t.noPoetry}</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {poetry.map((poem) => (
              <Card key={poem.id} className="hover:shadow-xl transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                    <h3 className="text-xl font-bold text-white">{poem.title}</h3>
                    {poem.poet && <p className="text-indigo-200">{poem.poet}</p>}
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{poem.excerpt || poem.content?.substring(0, 300)}...</p>
                    <Button variant="outline" className="mt-4">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {t.viewMore}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
