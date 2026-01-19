'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Video } from 'lucide-react';

export default function VideosManagement() {
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const videoId = extractYouTubeId(formData.youtubeUrl);
      if (!videoId) {
        alert('Invalid YouTube URL');
        setLoading(false);
        return;
      }

      await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          videoId,
        }),
      });

      alert('Video added successfully!');
      setShowForm(false);
      setFormData({ title: '', description: '', youtubeUrl: '' });
      fetchVideos();
    } catch (error) {
      alert('Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await fetch(`/api/videos?id=${videoId}`, { method: 'DELETE' });
      alert('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      alert('Failed to delete video');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Videos Management</h1>
          <p className="text-gray-600 mt-2">Manage YouTube video links</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Video
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Video</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Video Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter video title" required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter video description" rows={3} />
              </div>
              <div>
                <Label>YouTube URL</Label>
                <Input value={formData.youtubeUrl} onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." type="url" required />
                <p className="text-xs text-gray-500 mt-1">Paste the full YouTube video URL</p>
              </div>
              <div className="flex space-x-3">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Adding...' : 'Add Video'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Videos ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No videos yet</h3>
              <p className="mt-2 text-gray-600">Get started by adding your first video</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{video.title}</h3>
                    {video.description && <p className="text-sm text-gray-600 mt-1">{video.description}</p>}
                    <Button variant="outline" size="sm" onClick={() => handleDelete(video.id)} className="text-red-600 hover:text-red-700 mt-3">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
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
