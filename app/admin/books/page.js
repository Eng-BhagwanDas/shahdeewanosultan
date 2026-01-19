'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Download, Upload, FileText, Loader2, CheckCircle } from 'lucide-react';

const CATEGORIES = {
  en: [
    { value: 'spiritual', label: 'Spiritual' },
    { value: 'biography', label: 'Biography' },
    { value: 'poetry', label: 'Poetry' },
    { value: 'history', label: 'History' },
    { value: 'other', label: 'Other' },
  ],
  ur: [
    { value: 'spiritual', label: 'روحانی' },
    { value: 'biography', label: 'سیرت' },
    { value: 'poetry', label: 'شاعری' },
    { value: 'history', label: 'تاریخ' },
    { value: 'other', label: 'دیگر' },
  ],
  sd: [
    { value: 'spiritual', label: 'روحاني' },
    { value: 'biography', label: 'سيرت' },
    { value: 'poetry', label: 'شاعري' },
    { value: 'history', label: 'تاريخ' },
    { value: 'other', label: 'ٻيا' },
  ],
};

export default function BooksManagement() {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ en: false, ur: false, sd: false });
  const [uploadStatus, setUploadStatus] = useState({ en: '', ur: '', sd: '' });
  const fileInputRefs = { en: useRef(null), ur: useRef(null), sd: useRef(null) };

  const [formData, setFormData] = useState({
    titleEn: '',
    titleUr: '',
    titleSd: '',
    descriptionEn: '',
    descriptionUr: '',
    descriptionSd: '',
    pdfUrlEn: '',
    pdfUrlUr: '',
    pdfUrlSd: '',
    categoryEn: 'spiritual',
    categoryUr: 'spiritual',
    categorySd: 'spiritual',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      // Fetch books from all languages
      const [enRes, urRes, sdRes] = await Promise.all([
        fetch('/api/books?language=en'),
        fetch('/api/books?language=ur'),
        fetch('/api/books?language=sd'),
      ]);

      const [enData, urData, sdData] = await Promise.all([
        enRes.json(),
        urRes.json(),
        sdRes.json(),
      ]);

      // Combine all books and add language label for display
      const allBooks = [
        ...(enData.books || []).map(b => ({ ...b, languageLabel: 'EN' })),
        ...(urData.books || []).map(b => ({ ...b, languageLabel: 'UR' })),
        ...(sdData.books || []).map(b => ({ ...b, languageLabel: 'SD' })),
      ];

      setBooks(allBooks);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const handleFileUpload = async (lang) => {
    const file = fileInputRefs[lang].current?.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    setUploading(prev => ({ ...prev, [lang]: true }));
    setUploadStatus(prev => ({ ...prev, [lang]: '' }));

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('type', 'books');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        const langKey = lang.charAt(0).toUpperCase() + lang.slice(1);
        setFormData(prev => ({ ...prev, [`pdfUrl${langKey}`]: result.url }));
        setUploadStatus(prev => ({ ...prev, [lang]: `✓ ${file.name} uploaded` }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
      setUploadStatus(prev => ({ ...prev, [lang]: 'Upload failed' }));
    } finally {
      setUploading(prev => ({ ...prev, [lang]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const languages = ['en', 'ur', 'sd'];
      let savedCount = 0;

      for (const lang of languages) {
        const langKey = lang.charAt(0).toUpperCase() + lang.slice(1);
        const title = formData[`title${langKey}`];

        // Only save if title is provided for this language
        if (!title || title.trim() === '') {
          continue; // Skip this language
        }

        const bookData = {
          title: title,
          description: formData[`description${langKey}`],
          pdfUrl: formData[`pdfUrl${langKey}`],
          category: formData[`category${langKey}`],
          language: lang,
        };

        await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });

        savedCount++;
      }

      if (savedCount === 0) {
        alert('Please provide at least one book title!');
      } else {
        alert(`Book added successfully in ${savedCount} language(s)!`);
        setShowForm(false);
        setFormData({
          titleEn: '', titleUr: '', titleSd: '',
          descriptionEn: '', descriptionUr: '', descriptionSd: '',
          pdfUrlEn: '', pdfUrlUr: '', pdfUrlSd: '',
          categoryEn: 'spiritual', categoryUr: 'spiritual', categorySd: 'spiritual',
        });
        setUploadStatus({ en: '', ur: '', sd: '' });
        fetchBooks();
      }
    } catch (error) {
      alert('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await fetch(`/api/books?id=${bookId}`, { method: 'DELETE' });
      alert('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      alert('Failed to delete book');
    }
  };

  const renderFileUpload = (lang, label) => {
    const langKey = lang.charAt(0).toUpperCase() + lang.slice(1);
    return (
      <div className="space-y-2">
        <Label>PDF File ({label})</Label>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRefs[lang]}
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={() => handleFileUpload(lang)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRefs[lang].current?.click()}
            disabled={uploading[lang]}
            className="flex-1"
          >
            {uploading[lang] ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="mr-2 h-4 w-4" /> Choose PDF</>
            )}
          </Button>
        </div>
        {uploadStatus[lang] && (
          <p className={`text-sm ${uploadStatus[lang].includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
            {uploadStatus[lang]}
          </p>
        )}
        {formData[`pdfUrl${langKey}`] && (
          <div className="flex items-center space-x-2 text-sm text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            <span>PDF uploaded: {formData[`pdfUrl${langKey}`]}</span>
          </div>
        )}
        <div className="text-xs text-gray-500">Or enter URL manually:</div>
        <Input
          value={formData[`pdfUrl${langKey}`]}
          onChange={(e) => setFormData({ ...formData, [`pdfUrl${langKey}`]: e.target.value })}
          placeholder="https://example.com/book.pdf"
          type="url"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Books Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage books & PDF documents</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Book
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ur">Urdu</TabsTrigger>
                  <TabsTrigger value="sd">Sindhi</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label>Title (English)</Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Enter book title in English"
                      required
                    />
                  </div>
                  <div>
                    <Label>Category (English)</Label>
                    <select
                      value={formData.categoryEn}
                      onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {CATEGORIES.en.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Description (English)</Label>
                    <Textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      placeholder="Enter book description in English"
                      rows={4}
                    />
                  </div>
                  {renderFileUpload('en', 'English')}
                </TabsContent>

                <TabsContent value="ur" className="space-y-4">
                  <div>
                    <Label>Title (Urdu)</Label>
                    <Input
                      value={formData.titleUr}
                      onChange={(e) => setFormData({ ...formData, titleUr: e.target.value })}
                      placeholder="عنوان درج کریں"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <Label>Category (Urdu)</Label>
                    <select
                      value={formData.categoryUr}
                      onChange={(e) => setFormData({ ...formData, categoryUr: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-urdu"
                      dir="rtl"
                    >
                      {CATEGORIES.ur.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Description (Urdu)</Label>
                    <Textarea
                      value={formData.descriptionUr}
                      onChange={(e) => setFormData({ ...formData, descriptionUr: e.target.value })}
                      placeholder="تفصیل درج کریں"
                      dir="rtl"
                      rows={4}
                    />
                  </div>
                  {renderFileUpload('ur', 'Urdu')}
                </TabsContent>

                <TabsContent value="sd" className="space-y-4">
                  <div>
                    <Label>Title (Sindhi)</Label>
                    <Input
                      value={formData.titleSd}
                      onChange={(e) => setFormData({ ...formData, titleSd: e.target.value })}
                      placeholder="عنوان لکو"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <Label>Category (Sindhi)</Label>
                    <select
                      value={formData.categorySd}
                      onChange={(e) => setFormData({ ...formData, categorySd: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-sindhi"
                      dir="rtl"
                    >
                      {CATEGORIES.sd.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Description (Sindhi)</Label>
                    <Textarea
                      value={formData.descriptionSd}
                      onChange={(e) => setFormData({ ...formData, descriptionSd: e.target.value })}
                      placeholder="تفصیل لکو"
                      dir="rtl"
                      rows={4}
                    />
                  </div>
                  {renderFileUpload('sd', 'Sindhi')}
                </TabsContent>
              </Tabs>



              <div className="flex space-x-3">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Adding...' : 'Add Book'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Books ({books.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No books yet</h3>
              <p className="mt-2 text-gray-600">Get started by adding your first book</p>
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-12 h-14 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{book.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                          {book.languageLabel || book.language?.toUpperCase() || 'EN'}
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                          {book.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {book.pdfUrl && (
                      <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(book.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
