'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Music, Upload, Loader2, CheckCircle, Play } from 'lucide-react';

const AUDIO_CATEGORIES = {
  en: [
    { value: 'hamd', label: 'Hamd' },
    { value: 'naat', label: 'Naat' },
    { value: 'dua', label: 'Dua' },
    { value: 'qawwali', label: 'Qawwali' },
    { value: 'other', label: 'Other' },
  ],
  ur: [
    { value: 'hamd', label: 'حمد' },
    { value: 'naat', label: 'نعت' },
    { value: 'dua', label: 'دعا' },
    { value: 'qawwali', label: 'قوالی' },
    { value: 'other', label: 'دیگر' },
  ],
  sd: [
    { value: 'hamd', label: 'حمد' },
    { value: 'naat', label: 'نعت' },
    { value: 'dua', label: 'دعا' },
    { value: 'qawwali', label: 'قوالي' },
    { value: 'other', label: 'ٻيا' },
  ],
};

export default function AudioManagement() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    titleEn: '',
    titleUr: '',
    titleSd: '',
    descriptionEn: '',
    descriptionUr: '',
    descriptionSd: '',
    audioUrl: '',
    artist: '',
    categoryEn: 'hamd',
    categoryUr: 'hamd',
    categorySd: 'hamd',
  });

  useEffect(() => {
    fetchAudio();
  }, []);

  const fetchAudio = async () => {
    try {
      const response = await fetch('/api/audio?language=en');
      const data = await response.json();
      setAudioFiles(data.audioFiles || []);
    } catch (error) {
      console.error('Failed to fetch audio:', error);
    }
  };

  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select an audio file (MP3, WAV, OGG)');
      return;
    }

    setUploading(true);
    setUploadStatus('');

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('type', 'audio');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({ ...prev, audioUrl: result.url }));
        setUploadStatus(`✓ ${file.name} uploaded successfully`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
      setUploadStatus('Upload failed');
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
        const audioData = {
          title: formData[`title${langKey}`],
          description: formData[`description${langKey}`],
          audioUrl: formData.audioUrl,
          artist: formData.artist,
          category: formData[`category${langKey}`],
          language: lang,
        };
        await fetch('/api/audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(audioData),
        });
      }
      alert('Audio added successfully in all languages!');
      setShowForm(false);
      setFormData({
        titleEn: '', titleUr: '', titleSd: '',
        descriptionEn: '', descriptionUr: '', descriptionSd: '',
        audioUrl: '', artist: '',
        categoryEn: 'hamd', categoryUr: 'hamd', categorySd: 'hamd',
      });
      setUploadStatus('');
      fetchAudio();
    } catch (error) {
      alert('Failed to add audio');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (audioId) => {
    if (!confirm('Are you sure you want to delete this audio?')) return;
    try {
      await fetch(`/api/audio?id=${audioId}`, { method: 'DELETE' });
      alert('Audio deleted successfully');
      fetchAudio();
    } catch (error) {
      alert('Failed to delete audio');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audio Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage audio files (Hamd, Naat, Dua)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Audio
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Artist/Reciter</Label>
                <Input
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  placeholder="Enter artist name"
                />
              </div>

              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ur">Urdu</TabsTrigger>
                  <TabsTrigger value="sd">Sindhi</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label>Title (English)</Label>
                    <Input value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Category (English)</Label>
                    <select
                      value={formData.categoryEn}
                      onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {AUDIO_CATEGORIES.en.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Description (English)</Label>
                    <Textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} rows={3} />
                  </div>
                </TabsContent>
                <TabsContent value="ur" className="space-y-4">
                  <div>
                    <Label>Title (Urdu)</Label>
                    <Input value={formData.titleUr} onChange={(e) => setFormData({ ...formData, titleUr: e.target.value })} dir="rtl" required />
                  </div>
                  <div>
                    <Label>Category (Urdu)</Label>
                    <select
                      value={formData.categoryUr}
                      onChange={(e) => setFormData({ ...formData, categoryUr: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-urdu"
                      dir="rtl"
                    >
                      {AUDIO_CATEGORIES.ur.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Description (Urdu)</Label>
                    <Textarea value={formData.descriptionUr} onChange={(e) => setFormData({ ...formData, descriptionUr: e.target.value })} dir="rtl" rows={3} />
                  </div>
                </TabsContent>
                <TabsContent value="sd" className="space-y-4">
                  <div>
                    <Label>Title (Sindhi)</Label>
                    <Input value={formData.titleSd} onChange={(e) => setFormData({ ...formData, titleSd: e.target.value })} dir="rtl" required />
                  </div>
                  <div>
                    <Label>Category (Sindhi)</Label>
                    <select
                      value={formData.categorySd}
                      onChange={(e) => setFormData({ ...formData, categorySd: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-sindhi"
                      dir="rtl"
                    >
                      {AUDIO_CATEGORIES.sd.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Description (Sindhi)</Label>
                    <Textarea value={formData.descriptionSd} onChange={(e) => setFormData({ ...formData, descriptionSd: e.target.value })} dir="rtl" rows={3} />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Audio Upload Section */}
              <div className="space-y-3">
                <Label>Audio File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*,.mp3,.wav,.ogg"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Music className="mx-auto h-12 w-12 text-gray-400 mb-3" />
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
                      <><Upload className="mr-2 h-4 w-4" /> Choose Audio File</>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">Supports MP3, WAV, OGG formats</p>
                </div>

                {uploadStatus && (
                  <p className={`text-sm ${uploadStatus.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                    {uploadStatus}
                  </p>
                )}

                {formData.audioUrl && (
                  <div className="flex items-center space-x-2 text-sm text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Audio uploaded: {formData.audioUrl}</span>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center">Or enter URL manually:</div>
                <Input
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  placeholder="https://example.com/audio.mp3"
                  type="url"
                />
              </div>

              <div className="flex space-x-3">
                <Button type="submit" disabled={loading || !formData.audioUrl} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Adding...' : 'Add Audio'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Audio Files ({audioFiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {audioFiles.length === 0 ? (
            <div className="text-center py-12">
              <Music className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No audio files yet</h3>
              <p className="mt-2 text-gray-600">Get started by uploading your first audio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {audioFiles.map((audio) => (
                <div key={audio.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${audio.category === 'hamd' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                      audio.category === 'naat' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        audio.category === 'dua' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                          'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}>
                      <Music className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${audio.category === 'hamd' ? 'bg-green-100 text-green-800' :
                          audio.category === 'naat' ? 'bg-blue-100 text-blue-800' :
                            audio.category === 'dua' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {audio.category?.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{audio.title}</h3>
                      {audio.artist && <p className="text-sm text-gray-500">{audio.artist}</p>}
                      <p className="text-sm text-gray-600 mt-1">{audio.description}</p>
                      {audio.audioUrl && (
                        <audio controls className="w-full mt-3 h-10" src={audio.audioUrl}></audio>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(audio.id)} className="text-red-600 hover:text-red-700 ml-4">
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
