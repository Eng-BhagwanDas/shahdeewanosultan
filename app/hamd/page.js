'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, Download, Music } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Hamd - Praise of Allah',
    backToHome: 'Back to Home',
    subtitle: 'Divine Praises in Honor of the Almighty',
    play: 'Play',
    pause: 'Pause',
    download: 'Download',
    noAudio: 'No Hamd available yet',
    description: 'Hamd is a form of praising Allah (God) in Islamic tradition. These beautiful recitations glorify the Creator and express gratitude for His countless blessings.',
  },
  ur: {
    title: 'حمد - اللہ کی حمد',
    backToHome: 'واپس ہوم پیج',
    subtitle: 'خالق کائنات کی حمد و ثنا',
    play: 'چلائیں',
    pause: 'روکیں',
    download: 'ڈاؤن لوڈ',
    noAudio: 'ابھی کوئی حمد دستیاب نہیں',
    description: 'حمد اسلامی روایت میں اللہ تعالیٰ کی تعریف کی ایک شکل ہے۔ یہ خوبصورت تلاوتیں خالق کی تمجید کرتی ہیں اور ان کی بے شمار نعمتوں پر شکر گزاری کا اظہار کرتی ہیں۔',
  },
  sd: {
    title: 'حمد - الله جي حمد',
    backToHome: 'واپس گهر',
    subtitle: 'خالق ڪائنات جي حمد و ثنا',
    play: 'هلايو',
    pause: 'روڪيو',
    download: 'ڊائون لوڊ',
    noAudio: 'هاڻي ڪا به حمد موجود ناهي',
    description: 'حمد اسلامي روايت ۾ الله تعاليٰ جي تعريف جي هڪ صورت آهي. اهي سهڻيون تلاوتون خالق جي تمجيد ڪن ٿيون ۽ سندن بي شمار نعمتن تي شڪر گذاري جو اظهار ڪن ٿيون.',
  },
};

export default function HamdPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);
  const t = translations[language];

  useEffect(() => {
    setIsRTL(language === 'ur' || language === 'sd');
    fetchAudio();
  }, [language]);

  const fetchAudio = async () => {
    try {
      const response = await fetch(`/api/audio?language=${language}&category=hamd`);
      const data = await response.json();
      setAudioFiles(data.audioFiles || []);
    } catch (error) {
      console.error('Failed to fetch audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ur' || lang === 'sd');
  };

  // Helper to detect URL type and render appropriate player
  const renderAudioPlayer = (audioUrl) => {
    if (!audioUrl) return null;

    // YouTube detection
    if (audioUrl.includes('youtube.com') || audioUrl.includes('youtu.be')) {
      let videoId = '';
      if (audioUrl.includes('youtube.com/watch')) {
        videoId = new URL(audioUrl).searchParams.get('v');
      } else if (audioUrl.includes('youtu.be/')) {
        videoId = audioUrl.split('youtu.be/')[1].split('?')[0];
      }

      if (videoId) {
        return (
          <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        );
      }
    }

    // Google Drive detection
    if (audioUrl.includes('drive.google.com')) {
      const fileIdMatch = audioUrl.match(/\/d\/([^/]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return (
          <div className="mt-4">
            <iframe
              src={`https://drive.google.com/file/d/${fileId}/preview`}
              width="100%"
              height="80"
              allow="autoplay"
              className="rounded-lg"
            />
          </div>
        );
      }
    }

    // Default: Direct audio file
    return (
      <div className="mt-4">
        <audio controls className="w-full" src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      </div>
    );
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
        <img src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200" alt="Hamd" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <Music className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2 opacity-90">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Description */}
        <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <p className="text-lg text-gray-700 text-center leading-relaxed">{t.description}</p>
          </CardContent>
        </Card>

        {/* Audio List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : audioFiles.length === 0 ? (
          <div className="text-center py-12">
            <Music className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{t.noAudio}</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {audioFiles.map((audio) => (
              <Card key={audio.id} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{audio.title}</h3>
                      {audio.artist && <p className="text-sm text-emerald-600 mb-2">{audio.artist}</p>}
                      {audio.description && <p className="text-sm text-gray-600 mb-2">{audio.description}</p>}
                      {renderAudioPlayer(audio.audioUrl)}
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
