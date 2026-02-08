'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Image as ImageIcon, Upload, Loader2, CheckCircle, X, Layers, Link as LinkIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const bulkInputRef = useRef(null);

  // Single Upload State
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    category: 'general',
  });

  // Bulk Upload State
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkCategory, setBulkCategory] = useState('general');
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(data.gallery || []);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select an image file (JPG, PNG, GIF, WEBP)');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setUploadStatus('');

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('type', 'gallery');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({ ...prev, imageUrl: result.url }));
        setUploadStatus(`✓ ${file.name} uploaded successfully`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
      setUploadStatus('Upload failed');
      setPreviewUrl('');
    } finally {
      setUploading(false);
    }
  };

  const handleBulkFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      status: 'pending', // pending, uploading, success, error
      id: Math.random().toString(36).substr(2, 9)
    }));
    setBulkFiles(prev => [...prev, ...newFiles]);
  };

  const removeBulkFile = (id) => {
    setBulkFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) return;

    setUploading(true);
    setBulkProgress({ current: 0, total: bulkFiles.length });

    const pendingFiles = bulkFiles.filter(f => f.status === 'pending' || f.status === 'error');
    let completedCount = bulkFiles.length - pendingFiles.length;

    for (const fileObj of pendingFiles) {
      // Update status to uploading
      setBulkFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f));

      try {
        // 1. Upload File
        const formDataUpload = new FormData();
        formDataUpload.append('file', fileObj.file);
        formDataUpload.append('type', 'gallery');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        const uploadResult = await uploadRes.json();

        if (!uploadResult.success) throw new Error(uploadResult.error);

        // 2. Create Gallery Entry
        const galleryData = {
          title: '', // Optional title
          imageUrl: uploadResult.url,
          category: bulkCategory
        };

        const galleryRes = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(galleryData),
        });

        if (!galleryRes.ok) throw new Error('Failed to save to database');

        // Success
        setBulkFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'success' } : f));
      } catch (error) {
        console.error(error);
        setBulkFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error', error: error.message } : f));
      }

      completedCount++;
      setBulkProgress({ current: completedCount, total: bulkFiles.length });
    }

    setUploading(false);
    fetchImages(); // Refresh list
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      alert('Image added successfully!');
      setShowForm(false);
      setFormData({ title: '', imageUrl: '', category: 'general' });
      setUploadStatus('');
      setPreviewUrl('');
      fetchImages();
    } catch (error) {
      alert('Failed to add image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await fetch(`/api/gallery?id=${imageId}`, {
        method: 'DELETE',
      });
      alert('Image deleted successfully');
      fetchImages();
    } catch (error) {
      alert('Failed to delete image');
    }
  };

  const clearPreview = () => {
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setUploadStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage gallery images</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700">
          {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {showForm ? 'Close Form' : 'Add New Images'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Images</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="single">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Single Image (Link/Upload)
                </TabsTrigger>
                <TabsTrigger value="bulk">
                  <Layers className="mr-2 h-4 w-4" />
                  Bulk Upload
                </TabsTrigger>
              </TabsList>

              {/* Single Image Form */}
              <TabsContent value="single">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Image Title (Optional)</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter image title"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="general">General</option>
                        <option value="shrine">Shrine</option>
                        <option value="events">Events</option>
                        <option value="urs">Urs Mubarak</option>
                        <option value="visitors">Visitors</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Image Source</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
                        className="hidden"
                        onChange={handleFileUpload}
                      />

                      {previewUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-lg object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={clearPreview}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <div className="flex justify-center gap-2 mb-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                            >
                              {uploading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                              ) : (
                                <><Upload className="mr-2 h-4 w-4" /> Upload File</>
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mb-4">Supports JPG, PNG, GIF, WEBP</p>

                          <div className="flex items-center gap-2">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-xs text-gray-500">OR</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                          </div>

                          <div className="mt-4">
                            <Input
                              value={formData.imageUrl}
                              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                              placeholder="Paste image URL here (https://...)"
                              type="url"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {uploadStatus && (
                      <p className={`text-sm ${uploadStatus.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                        {uploadStatus}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" disabled={loading || !formData.imageUrl} className="bg-emerald-600 hover:bg-emerald-700">
                      {loading ? 'Saving...' : 'Save Image'}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Bulk Upload Form */}
              <TabsContent value="bulk">
                <div className="space-y-4">
                  <div>
                    <Label>Assign Category to All</Label>
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                    >
                      <option value="general">General</option>
                      <option value="shrine">Shrine</option>
                      <option value="events">Events</option>
                      <option value="urs">Urs Mubarak</option>
                      <option value="visitors">Visitors</option>
                    </select>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <input
                      type="file"
                      ref={bulkInputRef}
                      accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
                      multiple
                      className="hidden"
                      onChange={handleBulkFileSelect}
                    />
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => bulkInputRef.current?.click()}
                      disabled={uploading}
                      className="mb-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Select Multiple Files
                    </Button>
                    <p className="text-xs text-gray-500">Select multiple images to upload at once</p>
                  </div>

                  {bulkFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm">Selected Files ({bulkFiles.length})</h4>
                        {uploading && (
                          <span className="text-xs text-gray-500">
                            Processing {bulkProgress.current} / {bulkProgress.total}
                          </span>
                        )}
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2">
                        {bulkFiles.map((f) => (
                          <div key={f.id} className="flex items-center justify-between bg-white p-2 rounded border text-sm">
                            <div className="flex items-center truncate max-w-[70%]">
                              {f.status === 'success' ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : f.status === 'error' ? (
                                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              ) : f.status === 'uploading' ? (
                                <Loader2 className="h-4 w-4 text-blue-500 animate-spin mr-2 flex-shrink-0" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                              )}
                              <span className="truncate">{f.file.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {f.error && <span className="text-xs text-red-500 truncate max-w-[100px]">{f.error}</span>}
                              {!uploading && f.status !== 'success' && (
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeBulkFile(f.id)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={handleBulkUpload}
                          disabled={uploading || bulkFiles.filter(f => f.status === 'pending' || f.status === 'error').length === 0}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          {uploading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                          ) : (
                            <><Upload className="mr-2 h-4 w-4" /> Upload All Pending</>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Images ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No images yet</h3>
              <p className="mt-2 text-gray-600">Get started by uploading your first image</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group rounded-lg overflow-hidden border">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={image.imageUrl}
                      alt={image.title || 'Gallery'}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {image.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm truncate">{image.title}</p>
                      </div>
                    )}
                  </div>
                  {image.category && image.category !== 'general' && (
                    <span className="absolute top-2 left-2 text-xs bg-emerald-600 text-white px-2 py-1 rounded shadow-sm">
                      {image.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
