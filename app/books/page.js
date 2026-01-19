'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Search, Book as BookIcon } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Books & Publications',
    backToHome: 'Back to Home',
    search: 'Search books...',
    download: 'Download PDF',
    noBooks: 'No books available',
    category: 'Category',
    all: 'All',
    spiritual: 'Spiritual',
    biography: 'Biography',
    poetry: 'Poetry',
    history: 'History',
    other: 'Other',
  },
  ur: {
    title: 'کتب اور اشاعتیں',
    backToHome: 'واپس ہوم پیج',
    search: 'کتب تلاش کریں...',
    download: 'پی ڈی ایف ڈاؤن لوڈ',
    noBooks: 'کوئی کتاب دستیاب نہیں',
    category: 'زمرہ',
    all: 'تمام',
    spiritual: 'روحانی',
    biography: 'سوانح',
    poetry: 'شاعری',
    history: 'تاریخ',
    other: 'دیگر',
  },
  sd: {
    title: 'ڪتاب ۽ اشاعتون',
    backToHome: 'واپس گهر',
    search: 'ڪتاب ڳوليو...',
    download: 'پي ڊي ايف ڊائون لوڊ',
    noBooks: 'ڪا به ڪتاب موجود ناهي',
    category: 'زمرو',
    all: 'سمورا',
    spiritual: 'روحاني',
    biography: 'سوانح',
    poetry: 'شاعري',
    history: 'تاريخ',
    other: 'ٻيا',
  },
};

export default function BooksPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    setIsRTL(language === 'ur' || language === 'sd');
    fetchBooks();
  }, [language]);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedCategory]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`/api/books?language=${language}`);
      const data = await response.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((book) =>
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
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
          src="https://images.unsplash.com/photo-1555169048-ee590a06ab39?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85"
          alt="Books"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <BookIcon className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">{t.all}</option>
              <option value="spiritual">{t.spiritual}</option>
              <option value="biography">{t.biography}</option>
              <option value="poetry">{t.poetry}</option>
              <option value="history">{t.history}</option>
              <option value="other">{t.other}</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{t.noBooks}</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-16 h-20 rounded flex items-center justify-center flex-shrink-0">
                      <BookIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{book.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                          {t[book.category] || book.category}
                        </span>
                        {book.pdfUrl && (
                          <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                              <Download className="mr-1 h-3 w-3" />
                              {t.download}
                            </Button>
                          </a>
                        )}
                      </div>
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