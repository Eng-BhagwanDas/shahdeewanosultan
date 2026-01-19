'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Image as ImageIcon, Upload, Loader2, CheckCircle, X } from 'lucide-react';

export default function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    category: 'general',
  });

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
          <Plus className="mr-2 h-4 w-4" />
          Add New Image
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Image</CardTitle>
          </CardHeader>
          <CardContent>
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

              {/* Image Upload Section */}
              <div className="space-y-3">
                <Label>Image File</Label>
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="mb-2"
                      >
                        {uploading ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                        ) : (
                          <><Upload className="mr-2 h-4 w-4" /> Choose Image</>
                        )}
                      </Button>
                      <p className="text-xs text-gray-500">Supports JPG, PNG, GIF, WEBP</p>
                    </div>
                  )}
                </div>
                
                {uploadStatus && (
                  <p className={`text-sm ${uploadStatus.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                    {uploadStatus}
                  </p>
                )}

                <div className="text-xs text-gray-500 text-center">Or enter URL manually:</div>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>

              <div className="flex space-x-3">
                <Button type="submit" disabled={loading || !formData.imageUrl} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Adding...' : 'Add Image'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); clearPreview(); }}>
                  Cancel
                </Button>
              </div>
            </form>
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
                <div key={image.id} className="relative group rounded-lg overflow-hidden">
                  <img 
                    src={image.imageUrl} 
                    alt={image.title || 'Gallery'} 
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
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
                    <span className="absolute top-2 left-2 text-xs bg-emerald-600 text-white px-2 py-1 rounded">
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
