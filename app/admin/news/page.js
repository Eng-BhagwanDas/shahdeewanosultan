'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Newspaper } from 'lucide-react';

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleUr: '',
    titleSd: '',
    contentEn: '',
    contentUr: '',
    contentSd: '',
    category: 'news',
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news?language=en');
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const languages = ['en', 'ur', 'sd'];
      for (const lang of languages) {
        const langKey = lang.charAt(0).toUpperCase() + lang.slice(1);
        const newsData = {
          title: formData[`title${langKey}`],
          content: formData[`content${langKey}`],
          category: formData.category,
          language: lang,
        };

        await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsData),
        });
      }

      alert('News article added successfully in all languages!');
      setShowForm(false);
      setFormData({
        titleEn: '',
        titleUr: '',
        titleSd: '',
        contentEn: '',
        contentUr: '',
        contentSd: '',
        category: 'news',
      });
      fetchNews();
    } catch (error) {
      alert('Failed to add news article');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (newsId) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await fetch(`/api/news?id=${newsId}`, { method: 'DELETE' });
      alert('Article deleted successfully');
      fetchNews();
    } catch (error) {
      alert('Failed to delete article');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News & Press Releases</h1>
          <p className="text-gray-600 mt-2">Manage news articles and press releases</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add News Article
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add News Article</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Category</Label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="news">News</option>
                  <option value="press_release">Press Release</option>
                  <option value="announcement">Announcement</option>
                </select>
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
                    <Label>Content (English)</Label>
                    <Textarea value={formData.contentEn} onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })} rows={8} />
                  </div>
                </TabsContent>

                <TabsContent value="ur" className="space-y-4">
                  <div>
                    <Label>Title (Urdu)</Label>
                    <Input value={formData.titleUr} onChange={(e) => setFormData({ ...formData, titleUr: e.target.value })} dir="rtl" required />
                  </div>
                  <div>
                    <Label>Content (Urdu)</Label>
                    <Textarea value={formData.contentUr} onChange={(e) => setFormData({ ...formData, contentUr: e.target.value })} dir="rtl" rows={8} />
                  </div>
                </TabsContent>

                <TabsContent value="sd" className="space-y-4">
                  <div>
                    <Label>Title (Sindhi)</Label>
                    <Input value={formData.titleSd} onChange={(e) => setFormData({ ...formData, titleSd: e.target.value })} dir="rtl" required />
                  </div>
                  <div>
                    <Label>Content (Sindhi)</Label>
                    <Textarea value={formData.contentSd} onChange={(e) => setFormData({ ...formData, contentSd: e.target.value })} dir="rtl" rows={8} />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex space-x-3">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Adding...' : 'Add Article'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Articles ({news.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {news.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No articles yet</h3>
              <p className="mt-2 text-gray-600">Get started by adding your first article</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((article) => (
                <div key={article.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {article.category?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.content}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-700 ml-4">
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
