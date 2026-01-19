'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Music, Download, Play } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Audio Collection',
    backToHome: 'Back to Home',
    subtitle: 'Listen to Hamd, Naat, and Dua',
    noAudio: 'No audio files available',
    all: 'All',
    hamd: 'Hamd',
    naat: 'Naat',
    dua: 'Dua',
    qawwali: 'Qawwali',
    other: 'Other',
    category: 'Category',
  },
  ur: {
    title: 'آڈیو مجموعہ',
    backToHome: 'واپس ہوم پیج',
    subtitle: 'حمد، نعت اور دعا سنیں',
    noAudio: 'کوئی آڈیو فائل دستیاب نہیں',
    all: 'تمام',
    hamd: 'حمد',
    naat: 'نعت',
    dua: 'دعا',
    qawwali: 'قوالی',
    other: 'دیگر',
    category: 'زمرہ',
  },
  sd: {
    title: 'آڊيو مجموعو',
    backToHome: 'واپس گهر',
    subtitle: 'حمد، نعت ۽ دعا ٻڌو',
    noAudio: 'ڪا به آڊيو فائل موجود ناهي',
    all: 'سمورا',
    hamd: 'حمد',
    naat: 'نعت',
    dua: 'دعا',
    qawwali: 'قوالي',
    other: 'ٻيا',
    category: 'زمرو',
  },
};

export default function AudioPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
  const [filteredAudio, setFilteredAudio] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    setIsRTL(language === 'ur' || language === 'sd');
    fetchAudio();
  }, [language]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredAudio(audioFiles);
    } else {
      setFilteredAudio(audioFiles.filter((audio) => audio.category === selectedCategory));
    }
  }, [selectedCategory, audioFiles]);

  const fetchAudio = async () => {
    try {
      const response = await fetch(`/api/audio?language=${language}`);
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
        <img src="https://images.unsplash.com/photo-1542414110-ae27fdb87ee1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85" alt="Audio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <Music className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="all">{t.all}</option>
            <option value="hamd">{t.hamd}</option>
            <option value="naat">{t.naat}</option>
            <option value="dua">{t.dua}</option>
            <option value="qawwali">{t.qawwali}</option>
            <option value="other">{t.other}</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : filteredAudio.length === 0 ? (
          <div className="text-center py-12">
            <Music className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{t.noAudio}</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAudio.map((audio) => {
              const bgColor =
                audio.category === 'hamd' ? 'bg-green-500' :
                  audio.category === 'naat' ? 'bg-blue-500' :
                    audio.category === 'dua' ? 'bg-purple-500' :
                      'bg-gray-500';

              return (
                <Card key={audio.id} className="hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                        <Music className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{t[audio.category] || audio.category}</span>
                        <h3 className="text-lg font-bold text-gray-900 mt-2">{audio.title}</h3>
                        {audio.artist && <p className="text-sm text-emerald-600">{audio.artist}</p>}
                        {audio.description && <p className="text-sm text-gray-600 mt-1">{audio.description}</p>}
                        {renderAudioPlayer(audio.audioUrl)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
