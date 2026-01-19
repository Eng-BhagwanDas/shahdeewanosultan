'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Upcoming Events',
    backToHome: 'Back to Home',
    noEvents: 'No upcoming events',
    checkBack: 'Check back soon for upcoming events and celebrations',
    date: 'Date',
    time: 'Time',
    location: 'Location',
  },
  ur: {
    title: 'آئندہ تقریبات',
    backToHome: 'واپس ہوم پیج',
    noEvents: 'کوئی آئندہ تقریب نہیں',
    checkBack: 'آنے والی تقریبات اور جشن کے لیے جلد واپس آئیں',
    date: 'تاریخ',
    time: 'وقت',
    location: 'مقام',
  },
  sd: {
    title: 'ايندڙ واقعا',
    backToHome: 'واپس گھر',
    noEvents: 'ڪو به ايندڙ واقعو ناهي',
    checkBack: 'ايندڙ واقعن ۽ جشن لاءِ جلد واپس ڏسو',
    date: 'تاريخ',
    time: 'وقت',
    location: 'جڳھ',
  },
};

export default function EventsPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    setIsRTL(language === 'ur' || language === 'sd');
    fetchEvents();
  }, [language]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events?language=${language}`);
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ur' || lang === 'sd');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'ur' ? 'ur-PK' : 'sd-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to render Google Maps embed
  const renderMap = (mapUrl) => {
    if (!mapUrl) return null;

    // Extract coordinates or place ID from Google Maps URL
    let embedUrl = '';

    // Handle different Google Maps URL formats
    if (mapUrl.includes('maps.app.goo.gl') || mapUrl.includes('goo.gl/maps')) {
      // Short URL - use as is with embed prefix
      embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapUrl)}&output=embed`;
    } else if (mapUrl.includes('@')) {
      // URL with coordinates (e.g., @lat,lng,zoom)
      const coordMatch = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        const [, lat, lng] = coordMatch;
        embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
      }
    } else if (mapUrl.includes('/place/')) {
      // Place URL
      const placeMatch = mapUrl.match(/\/place\/([^/]+)/);
      if (placeMatch) {
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(placeMatch[1])}&output=embed`;
      }
    }

    // Fallback: try to use the URL directly
    if (!embedUrl && mapUrl.includes('google.com/maps')) {
      embedUrl = mapUrl.replace(/^https?:\/\/(www\.)?google\.[^/]+\/maps/, 'https://maps.google.com/maps') + '&output=embed';
    }

    if (!embedUrl) return null;

    return (
      <div className="mt-4 rounded-lg overflow-hidden border-2 border-emerald-200 shadow-lg">
        <iframe
          src={embedUrl}
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
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
          src="https://images.unsplash.com/photo-1733935610436-e1911fbee9e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxkYXJnYWglMjBzaHJpbmV8ZW58MHx8fHwxNzYwMDA5NTAzfDA&ixlib=rb-4.1.0&q=85"
          alt="Events"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <CalendarIcon className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{t.noEvents}</h3>
            <p className="mt-2 text-gray-600">{t.checkBack}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-xl transition-shadow overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0">
                      <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                      <span className="text-xs">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-emerald-600" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {renderMap(event.mapUrl)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}