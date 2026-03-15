'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Calendar, Upload, Loader2, CheckCircle, MapPin, Clock, ImageIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from 'react';

export default function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleUr: '',
    titleSd: '',
    descriptionEn: '',
    descriptionUr: '',
    descriptionSd: '',
    date: '',
    time: '',
    locationEn: '',
    locationUr: '',
    locationSd: '',
    mapUrl: '', // Google Maps link
    imageUrl: '',
  });

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);
    setUploadStatus('');

    try {
      const ext = file.name.split('.').pop();
      const filename = `${uuidv4()}.${ext}`;
      const filePath = `events/${filename}`;

      const { data, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
      setUploadStatus(`✓ ${file.name} uploaded`);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const languages = ['en', 'ur', 'sd'];

      for (const lang of languages) {
        const langKey = lang.charAt(0).toUpperCase() + lang.slice(1);
        const eventData = {
          title: formData[`title${langKey}`],
          description: formData[`description${langKey}`],
          location: formData[`location${langKey}`],
          mapUrl: formData.mapUrl,
          imageUrl: formData.imageUrl,
          date: formData.date,
          time: formData.time,
          language: lang,
        };

        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to add event');
        }
      }

      alert('Event added successfully in all languages!');
      setShowForm(false);
      setFormData({
        titleEn: '', titleUr: '', titleSd: '',
        descriptionEn: '', descriptionUr: '', descriptionSd: '',
        date: '', time: '',
        locationEn: '', locationUr: '', locationSd: '',
        mapUrl: '', imageUrl: '',
      });
      setUploadStatus('');
      fetchEvents();
    } catch (error) {
      console.error('Submit error:', error);
      alert(`Failed to add event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE',
      });
      alert('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-2">Manage upcoming events and celebrations</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Event
        </Button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Event</CardTitle>
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
                    <Label>Event Title (English)</Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Enter event title in English"
                      required
                    />
                  </div>
                  <div>
                    <Label>Description (English)</Label>
                    <Textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      placeholder="Enter event description in English"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Location (English)</Label>
                    <Input
                      value={formData.locationEn}
                      onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                      placeholder="Dargah Sharif"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="ur" className="space-y-4">
                  <div>
                    <Label>Event Title (Urdu)</Label>
                    <Input
                      value={formData.titleUr}
                      onChange={(e) => setFormData({ ...formData, titleUr: e.target.value })}
                      placeholder="تقریب کا عنوان درج کریں"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <Label>Description (Urdu)</Label>
                    <Textarea
                      value={formData.descriptionUr}
                      onChange={(e) => setFormData({ ...formData, descriptionUr: e.target.value })}
                      placeholder="تقریب کی تفصیل درج کریں"
                      dir="rtl"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Location (Urdu)</Label>
                    <Input
                      value={formData.locationUr}
                      onChange={(e) => setFormData({ ...formData, locationUr: e.target.value })}
                      placeholder="درگاہ شریف"
                      dir="rtl"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="sd" className="space-y-4">
                  <div>
                    <Label>Event Title (Sindhi)</Label>
                    <Input
                      value={formData.titleSd}
                      onChange={(e) => setFormData({ ...formData, titleSd: e.target.value })}
                      placeholder="واقعي جو عنوان لکو"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <Label>Description (Sindhi)</Label>
                    <Textarea
                      value={formData.descriptionSd}
                      onChange={(e) => setFormData({ ...formData, descriptionSd: e.target.value })}
                      placeholder="واقعي جي تفصيل لکو"
                      dir="rtl"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Location (Sindhi)</Label>
                    <Input
                      value={formData.locationSd}
                      onChange={(e) => setFormData({ ...formData, locationSd: e.target.value })}
                      placeholder="درگاهه شريف"
                      dir="rtl"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Event Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Event Time (Optional)</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              {/* Event Image Upload */}
              <div className="space-y-3">
                <Label>Event Image (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="event-image-upload"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="event-image-upload" className="cursor-pointer">
                    {formData.imageUrl ? (
                      <div className="relative w-full h-40 mb-3 group">
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                          <Upload className="text-white h-8 w-8" />
                        </div>
                      </div>
                    ) : (
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('event-image-upload').click()}
                      disabled={uploading}
                      className="mb-2"
                    >
                      {uploading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload className="mr-2 h-4 w-4" /> {formData.imageUrl ? 'Change Image' : 'Upload Event Image'}</>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP formats</p>
                  </label>
                </div>
                {uploadStatus && (
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3" /> {uploadStatus}
                  </p>
                )}
              </div>

              <div>
                <Label>Google Maps Location Link (Optional)</Label>
                <Input
                  type="url"
                  value={formData.mapUrl}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Tip: Open Google Maps → Click "Share" → Copy link and paste here
                </p>
              </div>

              <div className="flex space-x-3">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Adding...' : 'Add Event'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>All Events ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No events yet</h3>
              <p className="mt-2 text-gray-600">Get started by adding your first event</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow gap-4"
                >
                  <div className="flex items-start space-x-4 w-full sm:w-auto flex-1">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 w-full h-full flex flex-col items-center justify-center text-white">
                          <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                          <span className="text-xs uppercase">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">EN</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        {event.time && (
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                            {event.time}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-700 w-full sm:w-auto self-end sm:self-auto"
                  >
                    <Trash2 className="h-4 w-4 sm:mr-2" />
                    <span className="sm:hidden">Delete Event</span>
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
