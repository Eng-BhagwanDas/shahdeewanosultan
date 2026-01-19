'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Sliders, Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';

export default function SliderManagement() {
  const [slides, setSlides] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    order: 1,
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slider');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Failed to fetch slides:', error);
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
    formDataUpload.append('type', 'slider');

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

  const clearPreview = () => {
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setUploadStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      alert('Slide added successfully!');
      setShowForm(false);
      setFormData({ title: '', imageUrl: '', order: slides.length + 1 });
      setPreviewUrl('');
      setUploadStatus('');
      fetchSlides();
    } catch (error) {
      alert('Failed to add slide');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slideId) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      await fetch(`/api/slider?id=${slideId}`, {
        method: 'DELETE',
      });
      alert('Slide deleted successfully');
      fetchSlides();
    } catch (error) {
      alert('Failed to delete slide');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slider Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage homepage slider images</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Slide
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Slide</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Slide Title (Optional)</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter slide title"
                  />
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
              
              {/* Image Upload Section */}
              <div className="space-y-3">
                <Label>Slider Image</Label>
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
                        className="max-h-48 mx-auto rounded-lg object-contain"
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
                      <p className="text-xs text-gray-500">Recommended size: 1920x600px</p>
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
                  placeholder="https://example.com/slide-image.jpg"
                  type="url"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button type="submit" disabled={loading || !formData.imageUrl} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Adding...' : 'Add Slide'}
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
          <CardTitle>All Slides ({slides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <div className="text-center py-12">
              <Sliders className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No slides yet</h3>
              <p className="mt-2 text-gray-600">Get started by uploading your first slide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div key={slide.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-emerald-100 w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-800 font-bold text-lg">{slide.order}</span>
                  </div>
                  <img src={slide.imageUrl} alt={slide.title || 'Slide'} className="w-40 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{slide.title || 'Untitled Slide'}</h3>
                    <p className="text-sm text-gray-500 truncate">{slide.imageUrl}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(slide.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
