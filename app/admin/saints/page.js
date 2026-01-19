'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Users, Upload, Loader2, CheckCircle, Pencil } from 'lucide-react';

const saintsList = [
  { id: 'saint1', nameEn: 'Hazrat Syed Sakhi Shah Deewano', order: 1 },
  { id: 'saint2', nameEn: 'Hazrat Syed Sakhi Ismail Shah', order: 2 },
  { id: 'saint3', nameEn: 'Faqir Abdul Qayoom Memon Aaziz', order: 3 },
  { id: 'saint4', nameEn: 'Faqir Dilshad Ali Mastano Dilber', order: 4 },
  { id: 'saint5', nameEn: 'Sahib Zada Faqir Ali Raza Momin Ali', order: 5 },
  { id: 'saint6', nameEn: 'Sindh Rani', order: 6 },
];

export default function SaintsManagement() {
  const [saints, setSaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ en: false, ur: false, sd: false });
  const [uploadStatus, setUploadStatus] = useState({ en: '', ur: '', sd: '' });
  const fileInputRefs = { en: useRef(null), ur: useRef(null), sd: useRef(null) };

  const [formData, setFormData] = useState({
    saintId: '',
    nameEn: '',
    nameUr: '',
    nameSd: '',
    titleEn: '',
    titleUr: '',
    titleSd: '',
    contentEn: '',
    contentUr: '',
    contentSd: '',
    pdfUrlEn: '',
    pdfUrlUr: '',
    pdfUrlSd: '',
    order: 1,
  });

  useEffect(() => {
    fetchSaints();
  }, []);

  const fetchSaints = async () => {
    try {
      const response = await fetch('/api/saints?language=en');
      const data = await response.json();
      setSaints(data.saints || []);
    } catch (error) {
      console.error('Failed to fetch saints:', error);
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
        setUploadStatus(prev => ({ ...prev, [lang]: `✓ ${file.name}` }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
      setUploadStatus(prev => ({ ...prev, [lang]: 'Failed' }));
    } finally {
      setUploading(prev => ({ ...prev, [lang]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const languages = ['en', 'ur', 'sd'];
      for (const lang of languages) {
        const langKey = lang.charAt(0).toUpperCase() + lang.slice(1);
        const saintData = {
          saintId: formData.saintId,
          // Use 'id' for the backend to identify the document
          id: formData.saintId,
          name: formData[`name${langKey}`],
          title: formData[`title${langKey}`],
          content: formData[`content${langKey}`],
          pdfUrl: formData[`pdfUrl${langKey}`],
          // Store all PDF URLs in each language record for cross-reference
          pdfUrlEn: formData.pdfUrlEn,
          pdfUrlUr: formData.pdfUrlUr,
          pdfUrlSd: formData.pdfUrlSd,
          order: formData.order,
          language: lang,
        };

        const method = isEditing ? 'PUT' : 'POST';
        const response = await fetch('/api/saints', {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saintData),
        });

        if (!response.ok) {
          const resData = await response.json();
          throw new Error(resData.error || `Failed to save ${lang.toUpperCase()} profile`);
        }
      }

      alert(isEditing ? 'Saint profile updated successfully!' : 'Saint profile saved successfully in all languages!');
      setShowForm(false);
      resetForm();
      fetchSaints();
    } catch (error) {
      console.error('Save error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      saintId: '',
      nameEn: '',
      nameUr: '',
      nameSd: '',
      titleEn: '',
      titleUr: '',
      titleSd: '',
      contentEn: '',
      contentUr: '',
      contentSd: '',
      pdfUrlEn: '',
      pdfUrlUr: '',
      pdfUrlSd: '',
      order: saints.length + 1,
    });
    setUploadStatus({ en: '', ur: '', sd: '' });
    setIsEditing(false);
  };

  const handleDelete = async (saintId) => {
    if (!confirm('Are you sure you want to delete this saint profile?')) return;
    try {
      // Delete from all languages
      await fetch(`/api/saints?id=${saintId}`, { method: 'DELETE' });
      alert('Saint profile deleted successfully');
      fetchSaints();
    } catch (error) {
      alert('Failed to delete saint profile');
    }
  };

  const loadPredefinedSaint = (saint) => {
    setFormData({
      ...formData,
      saintId: saint.id,
      nameEn: saint.nameEn,
      order: saint.order,
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = async (saintId) => {
    setLoading(true);
    try {
      // Fetch specific saint data for each language
      const [enRes, urRes, sdRes] = await Promise.all([
        fetch(`/api/saints/${saintId}?language=en`),
        fetch(`/api/saints/${saintId}?language=ur`),
        fetch(`/api/saints/${saintId}?language=sd`),
      ]);

      const [enData, urData, sdData] = await Promise.all([
        enRes.json(),
        urRes.json(),
        sdRes.json(),
      ]);

      const enSaint = enData.saint || {};
      const urSaint = urData.saint || {};
      const sdSaint = sdData.saint || {};

      setFormData({
        saintId: saintId,
        nameEn: enSaint.name || '',
        nameUr: urSaint.name || '',
        nameSd: sdSaint.name || '',
        titleEn: enSaint.title || '',
        titleUr: urSaint.title || '',
        titleSd: sdSaint.title || '',
        contentEn: enSaint.content || '',
        contentUr: urSaint.content || '',
        contentSd: sdSaint.content || '',
        pdfUrlEn: enSaint.pdfUrlEn || enSaint.pdfUrl || '',
        pdfUrlUr: urSaint.pdfUrlUr || urSaint.pdfUrl || '',
        pdfUrlSd: sdSaint.pdfUrlSd || sdSaint.pdfUrl || '',
        order: enSaint.order || 1,
      });

      setIsEditing(true);
      setShowForm(true);
    } catch (error) {
      console.error('Failed to fetch details:', error);
      alert('Failed to load saint details');
    } finally {
      setLoading(false);
    }
  };

  const renderPdfUpload = (lang, label) => {
    const langKey = lang.charAt(0).toUpperCase() + lang.slice(1);
    return (
      <div className="space-y-2">
        <Label>PDF File ({label})</Label>
        <div className="flex items-center space-x-2">
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
            size="sm"
            onClick={() => fileInputRefs[lang].current?.click()}
            disabled={uploading[lang]}
          >
            {uploading[lang] ? (
              <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Uploading</>
            ) : (
              <><Upload className="mr-1 h-3 w-3" /> Upload PDF</>
            )}
          </Button>
          {uploadStatus[lang] && (
            <span className={`text-xs ${uploadStatus[lang].includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
              {uploadStatus[lang]}
            </span>
          )}
        </div>
        {formData[`pdfUrl${langKey}`] && (
          <div className="flex items-center space-x-1 text-xs text-emerald-600">
            <CheckCircle className="h-3 w-3" />
            <span className="truncate">{formData[`pdfUrl${langKey}`]}</span>
          </div>
        )}
        <Input
          value={formData[`pdfUrl${langKey}`]}
          onChange={(e) => setFormData({ ...formData, [`pdfUrl${langKey}`]: e.target.value })}
          placeholder="Or enter PDF URL manually"
          type="url"
          className="text-sm"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saints Management</h1>
          <p className="text-gray-600 mt-2">Manage saint profiles in all languages</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); resetForm(); }} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Close Form' : 'Add Saint Profile'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Saint Profile' : 'Add Saint Profile'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Quick Select Predefined Saints</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {saintsList.map((saint) => (
                    <Button
                      key={saint.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => loadPredefinedSaint(saint)}
                      className="text-xs"
                    >
                      {saint.nameEn}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Saint ID <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.saintId}
                    onChange={(e) => setFormData({ ...formData, saintId: e.target.value })}
                    placeholder="e.g., saint1, saint2, etc."
                    required
                    readOnly={isEditing}
                    className={isEditing ? 'bg-gray-100' : ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">Use same ID for linking across languages</p>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ur">Urdu</TabsTrigger>
                  <TabsTrigger value="sd">Sindhi</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label>Name (English) <span className="text-red-500">*</span></Label>
                    <Input value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Title (English)</Label>
                    <Input value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} placeholder="e.g., The Spiritual Guide" />
                  </div>
                  <div>
                    <Label>Biography (English)</Label>
                    <Textarea value={formData.contentEn} onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })} rows={6} placeholder="Enter the saint's biography..." />
                  </div>
                  {renderPdfUpload('en', 'English')}
                </TabsContent>

                <TabsContent value="ur" className="space-y-4">
                  <div>
                    <Label>Name (Urdu) <span className="text-red-500">*</span></Label>
                    <Input value={formData.nameUr} onChange={(e) => setFormData({ ...formData, nameUr: e.target.value })} dir="rtl" required />
                  </div>
                  <div>
                    <Label>Title (Urdu)</Label>
                    <Input value={formData.titleUr} onChange={(e) => setFormData({ ...formData, titleUr: e.target.value })} dir="rtl" placeholder="روحانی رہنما" />
                  </div>
                  <div>
                    <Label>Biography (Urdu)</Label>
                    <Textarea value={formData.contentUr} onChange={(e) => setFormData({ ...formData, contentUr: e.target.value })} dir="rtl" rows={6} placeholder="سوانح حیات درج کریں..." />
                  </div>
                  {renderPdfUpload('ur', 'Urdu')}
                </TabsContent>

                <TabsContent value="sd" className="space-y-4">
                  <div>
                    <Label>Name (Sindhi) <span className="text-red-500">*</span></Label>
                    <Input value={formData.nameSd} onChange={(e) => setFormData({ ...formData, nameSd: e.target.value })} dir="rtl" required />
                  </div>
                  <div>
                    <Label>Title (Sindhi)</Label>
                    <Input value={formData.titleSd} onChange={(e) => setFormData({ ...formData, titleSd: e.target.value })} dir="rtl" placeholder="روحاني رهنما" />
                  </div>
                  <div>
                    <Label>Biography (Sindhi)</Label>
                    <Textarea value={formData.contentSd} onChange={(e) => setFormData({ ...formData, contentSd: e.target.value })} dir="rtl" rows={6} placeholder="سوانح حيات لکو..." />
                  </div>
                  {renderPdfUpload('sd', 'Sindhi')}
                </TabsContent>
              </Tabs>

              <div className="flex space-x-3">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Saving...' : (isEditing ? 'Update Saint Profile' : 'Save Saint Profile')}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Saints ({saints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {saints.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No saint profiles yet</h3>
              <p className="mt-2 text-gray-600">Get started by adding saint profiles using the predefined saints above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {saints.sort((a, b) => (a.order || 0) - (b.order || 0)).map((saint) => (
                <div key={saint.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-800 font-bold">{saint.order || '?'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{saint.saintId || saint.id}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">{saint.name}</h3>
                      {saint.title && <p className="text-sm text-emerald-600">{saint.title}</p>}
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{saint.content}</p>
                      <div className="flex space-x-3 mt-2">
                        {saint.pdfUrl && (
                          <a href={saint.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            📄 PDF
                          </a>
                        )}
                        {saint.pdfUrlEn && (
                          <a href={saint.pdfUrlEn} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">
                            EN PDF
                          </a>
                        )}
                        {saint.pdfUrlUr && (
                          <a href={saint.pdfUrlUr} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            UR PDF
                          </a>
                        )}
                        {saint.pdfUrlSd && (
                          <a href={saint.pdfUrlSd} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline">
                            SD PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(saint.saintId || saint.id)} className="text-blue-600 hover:text-blue-700">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(saint.saintId || saint.id)} className="text-red-600 hover:text-red-700">
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
