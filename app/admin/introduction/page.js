'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2, CheckCircle, Save } from 'lucide-react';

export default function IntroductionManagement() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Track uploading state for 3 PDF types across 3 languages
  const [uploading, setUploading] = useState({
    en: { biography: false, teachings: false, legacy: false },
    ur: { biography: false, teachings: false, legacy: false },
    sd: { biography: false, teachings: false, legacy: false }
  });
  
  const [uploadStatus, setUploadStatus] = useState({
    en: { biography: '', teachings: '', legacy: '' },
    ur: { biography: '', teachings: '', legacy: '' },
    sd: { biography: '', teachings: '', legacy: '' }
  });

  const fileInputRefs = {
    en: { biography: useRef(null), teachings: useRef(null), legacy: useRef(null) },
    ur: { biography: useRef(null), teachings: useRef(null), legacy: useRef(null) },
    sd: { biography: useRef(null), teachings: useRef(null), legacy: useRef(null) }
  };

  const [formData, setFormData] = useState({
    en: { biography: '', biographyPdf: '', teachings: '', teachingsPdf: '', legacy: '', legacyPdf: '' },
    ur: { biography: '', biographyPdf: '', teachings: '', teachingsPdf: '', legacy: '', legacyPdf: '' },
    sd: { biography: '', biographyPdf: '', teachings: '', teachingsPdf: '', legacy: '', legacyPdf: '' }
  });

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setFetching(true);
    try {
      const langs = ['en', 'ur', 'sd'];
      const responses = await Promise.all(
        langs.map(lang => fetch(`/api/content?page=introduction&language=${lang}`))
      );
      
      const data = await Promise.all(responses.map(res => res.json()));
      
      const newFormData = { ...formData };
      langs.forEach((lang, index) => {
        if (data[index]?.content) {
          // Initialize with fetched data, falling back to empty string if undefined
          newFormData[lang] = {
            biography: data[index].content.biography || '',
            biographyPdf: data[index].content.biographyPdf || '',
            teachings: data[index].content.spiritualTeachings || '',
            teachingsPdf: data[index].content.teachingsPdf || '',
            legacy: data[index].content.legacy || '',
            legacyPdf: data[index].content.legacyPdf || '',
          };
        }
      });
      
      setFormData(newFormData);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleTextChange = (lang, field, value) => {
    setFormData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (lang, section) => {
    const file = fileInputRefs[lang][section].current?.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    setUploading(prev => ({ ...prev, [lang]: { ...prev[lang], [section]: true } }));
    setUploadStatus(prev => ({ ...prev, [lang]: { ...prev[lang], [section]: '' } }));

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('type', 'books'); // store in books/documents folder in supabase

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          [lang]: {
            ...prev[lang],
            [`${section}Pdf`]: result.url
          }
        }));
        setUploadStatus(prev => ({ ...prev, [lang]: { ...prev[lang], [section]: `✓ ${file.name}` } }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
      setUploadStatus(prev => ({ ...prev, [lang]: { ...prev[lang], [section]: 'Failed' } }));
    } finally {
      setUploading(prev => ({ ...prev, [lang]: { ...prev[lang], [section]: false } }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const languages = ['en', 'ur', 'sd'];
      
      for (const lang of languages) {
        const payload = {
          pageName: 'introduction',
          language: lang,
          biography: formData[lang].biography,
          biographyPdf: formData[lang].biographyPdf,
          spiritualTeachings: formData[lang].teachings,
          teachingsPdf: formData[lang].teachingsPdf,
          legacy: formData[lang].legacy,
          legacyPdf: formData[lang].legacyPdf,
        };

        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const resData = await response.json();
          throw new Error(resData.error || `Failed to save ${lang.toUpperCase()} content`);
        }
      }

      alert('Introduction contents saved successfully in all languages!');
    } catch (error) {
      console.error('Save error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (lang, sectionName, sectionKey, labelText, placeholder) => {
    const isRtl = lang === 'ur' || lang === 'sd';
    return (
      <Card className="mb-6 border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 pb-4 border-b">
          <CardTitle className="text-lg">{sectionName}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <Label className="mb-2 block">{labelText} Content</Label>
            <Textarea
              value={formData[lang][sectionKey]}
              onChange={(e) => handleTextChange(lang, sectionKey, e.target.value)}
              dir={isRtl ? 'rtl' : 'ltr'}
              rows={8}
              placeholder={placeholder}
              className={`resize-y ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <Label className="mb-2 block">{labelText} PDF Upload</Label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <input
                type="file"
                ref={fileInputRefs[lang][sectionKey]}
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={() => handleFileUpload(lang, sectionKey)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRefs[lang][sectionKey].current?.click()}
                disabled={uploading[lang][sectionKey]}
                className="bg-white"
              >
                {uploading[lang][sectionKey] ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="mr-2 h-4 w-4" /> Select PDF</>
                )}
              </Button>
              
              <div className="flex-1 w-full">
                <Input
                  value={formData[lang][`${sectionKey}Pdf`]}
                  onChange={(e) => handleTextChange(lang, `${sectionKey}Pdf`, e.target.value)}
                  placeholder="Or enter PDF URL manually"
                  type="url"
                  className="w-full text-sm bg-white"
                />
              </div>
            </div>
            
            {uploadStatus[lang][sectionKey] && (
              <p className={`text-sm mt-2 font-medium ${uploadStatus[lang][sectionKey].includes('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                {uploadStatus[lang][sectionKey]}
              </p>
            )}
            
            {formData[lang][`${sectionKey}Pdf`] && !uploadStatus[lang][sectionKey] && (
               <div className="flex items-center space-x-1 mt-2 text-sm text-emerald-600 font-medium">
                 <CheckCircle className="h-4 w-4" />
                 <span className="truncate">PDF is linked</span>
               </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Introduction Content</h1>
          <p className="text-slate-500 mt-1">Manage biography, teachings, and legacy content with their PDFs.</p>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
             <><Save className="mr-2 h-4 w-4" /> Save All Changes</>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="en" className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="border-b px-4 py-3 bg-slate-50 rounded-t-xl">
            <TabsList className="grid w-full sm:w-96 grid-cols-3">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ur">Urdu (اردو)</TabsTrigger>
              <TabsTrigger value="sd">Sindhi (سنڌي)</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="en" className="mt-0 space-y-2">
              {renderSection('en', 'Biography & Background', 'biography', 'Biography', 'Enter the biography text here... (Paragraphs are supported)')}
              {renderSection('en', 'Spiritual Teachings', 'teachings', 'Teachings', 'Enter the teachings text here...')}
              {renderSection('en', 'Legacy', 'legacy', 'Legacy', 'Enter the legacy text here...')}
            </TabsContent>

            <TabsContent value="ur" className="mt-0 space-y-2">
              {renderSection('ur', 'سوانح حیات (Biography)', 'biography', 'Biography', 'سوانح حیات درج کریں...')}
              {renderSection('ur', 'روحانی تعلیمات (Spiritual Teachings)', 'teachings', 'Teachings', 'روحانی تعلیمات درج کریں...')}
              {renderSection('ur', 'میراث (Legacy)', 'legacy', 'Legacy', 'میراث کے بارے میں درج کریں...')}
            </TabsContent>

            <TabsContent value="sd" className="mt-0 space-y-2">
              {renderSection('sd', 'سوانح حيات (Biography)', 'biography', 'Biography', 'سوانح حيات لکو...')}
              {renderSection('sd', 'روحاني تعليمات (Spiritual Teachings)', 'teachings', 'Teachings', 'روحاني تعليمات لکو...')}
              {renderSection('sd', 'ميراث (Legacy)', 'legacy', 'Legacy', 'ميراث جي باري ۾ لکو...')}
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading} size="lg" className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto px-8">
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</>
            ) : (
               <><Save className="mr-2 h-4 w-4" /> Save Content</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
