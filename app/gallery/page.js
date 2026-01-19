'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Gallery',
    backToHome: 'Back to Home',
    noImages: 'No images in gallery',
    subtitle: 'Explore moments from the Dargah',
    all: 'All',
    shrine: 'Shrine',
    events: 'Events',
    urs: 'Urs Mubarak',
    visitors: 'Visitors',
  },
  ur: {
    title: '\u06af\u06cc\u0644\u0631\u06cc',
    backToHome: '\u0648\u0627\u067e\u0633 \u06c1\u0648\u0645 \u067e\u06cc\u062c',
    noImages: '\u06af\u06cc\u0644\u0631\u06cc \u0645\u06cc\u06ba \u06a9\u0648\u0626\u06cc \u062a\u0635\u0648\u06cc\u0631 \u0646\u06c1\u06cc\u06ba',
    subtitle: '\u062f\u0631\u06af\u0627\u06c1 \u06a9\u06d2 \u0644\u0645\u062d\u0627\u062a \u062f\u06cc\u06a9\u06be\u06cc\u06ba',
    all: 'سب',
    shrine: 'مزار',
    events: 'تقاریب',
    urs: 'عرس مبارک',
    visitors: 'زائرین',
  },
  sd: {
    title: '\u06af\u064a\u0644\u0631\u064a',
    backToHome: '\u0648\u0627\u067e\u0633 \u06af\u0647\u0631',
    noImages: '\u06af\u064a\u0644\u0631\u064a \u06fe \u06aa\u0627 \u0628\u0647 \u062a\u0635\u0648\u064a\u0631 \u0646\u0627\u0647\u064a',
    subtitle: '\u062f\u0631\u06af\u0627\u0647\u0647 \u062c\u0627 \u0644\u0645\u062d\u0627 \u068f\u0633\u0648',
    all: 'سڀ',
    shrine: 'مزار',
    events: 'تقريبون',
    urs: 'عرس مبارڪ',
    visitors: 'زائرين',
  },
};

export default function GalleryPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const t = translations[language];

  const categories = [
    { id: 'all', label: t.all },
    { id: 'shrine', label: t.shrine },
    { id: 'events', label: t.events },
    { id: 'urs', label: t.urs },
    { id: 'visitors', label: t.visitors },
  ];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);


  useEffect(() => {
    setIsRTL(language === 'ur' || language === 'sd');
    fetchImages();
  }, [language]);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(data.gallery || []);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ur' || lang === 'sd');
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };


  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, filteredImages.length]);


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
            <div className="flex-1" />

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1666175146759-ce6a39f991ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxkYXJnYWglMjBzaHJpbmV8ZW58MHx8fHwxNzYwMDA5NTAzfDA&ixlib=rb-4.1.0&q=85"
          alt="Gallery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <ImageIcon className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className={`${selectedCategory === category.id
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'hover:bg-emerald-50 text-emerald-700 border-emerald-200'
                } transition-all duration-300 rounded-full px-6`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{t.noImages}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && filteredImages.length > 0 && (

        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={prevImage}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Image */}
          <div className="max-w-5xl max-h-[90vh] px-4">
            <img
              src={filteredImages[currentImageIndex].imageUrl}
              alt={filteredImages[currentImageIndex].title || 'Gallery image'}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {filteredImages[currentImageIndex].title && (
              <p className="text-white text-center mt-4 text-lg">
                {filteredImages[currentImageIndex].title}
              </p>
            )}
            <p className="text-white/60 text-center mt-2">
              {currentImageIndex + 1} / {filteredImages.length}
            </p>
          </div>


          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={nextImage}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}
    </div>
  );
}