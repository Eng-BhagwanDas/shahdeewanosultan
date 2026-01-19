'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Newspaper as NewsIcon, Calendar } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'News & Press Releases',
    backToHome: 'Back to Home',
    subtitle: 'Stay updated with the latest news',
    noNews: 'No news articles available',
    news: 'News',
    press_release: 'Press Release',
    announcement: 'Announcement',
  },
  ur: {
    title: 'خبریں اور پریس ریلیز',
    backToHome: 'واپس ہوم پیج',
    subtitle: 'تازہ ترین خبروں سے باخبر رہیں',
    noNews: 'کوئی خبر دستیاب نہیں',
    news: 'خبر',
    press_release: 'پریس ریلیز',
    announcement: 'اعلان',
  },
  sd: {
    title: 'خبرون ۽ پريس رليز',
    backToHome: 'واپس گهر',
    subtitle: 'تازو خبرن سان باخبر رهو',
    noNews: 'ڪا به خبر موجود ناهي',
    news: 'خبر',
    press_release: 'پريس رليز',
    announcement: 'اعلان',
  },
};

export default function NewsPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    setIsRTL(language === 'ur' || language === 'sd');
    fetchNews();
  }, [language]);

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news?language=${language}`);
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
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

      <div className="relative h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85" alt="News" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <NewsIcon className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <NewsIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{t.noNews}</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((article) => (
              <Card key={article.id} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                      <NewsIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {t[article.category] || article.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">{article.title}</h2>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</p>
                    </div>
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
