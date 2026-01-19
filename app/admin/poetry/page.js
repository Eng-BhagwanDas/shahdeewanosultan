'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Feather, Edit } from 'lucide-react';

export default function PoetryManagement() {
  const [poetry, setPoetry] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleUr: '',
    titleSd: '',
    contentEn: '',
    contentUr: '',
    contentSd: '',
    poet: '',
    category: 'sufi',
  });

  useEffect(() => {
    fetchPoetry();
  }, []);

  const fetchPoetry = async () => {
    try {
      const response = await fetch('/api/poetry?language=en');
      const data = await response.json();
      setPoetry(data.poetry || []);
    } catch (error) {
      console.error('Failed to fetch poetry:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const languages = ['en', 'ur', 'sd'];
      for (const lang of languages) {
        const langKey = lang.charAt(0).toUpperCase() + lang.slice(1);
        const poetryData = {
          title: formData[`title${langKey}`],
          content: formData[`content${langKey}`],
          poet: formData.poet,
          category: formData.category,
          language: lang,
        };
        await fetch('/api/poetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(poetryData),
        });
      }
      alert('Poetry added successfully in all languages!');
      setShowForm(false);
      setFormData({
        titleEn: '', titleUr: '', titleSd: '',
        contentEn: '', contentUr: '', contentSd: '',
        poet: '', category: 'sufi',
      });
      fetchPoetry();
    } catch (error) {
      alert('Failed to add poetry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (poetryId) => {
    if (!confirm('Are you sure you want to delete this poetry?')) return;
    try {
      await fetch(`/api/poetry?id=${poetryId}`, { method: 'DELETE' });
      alert('Poetry deleted successfully');
      fetchPoetry();
    } catch (error) {
      alert('Failed to delete poetry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Poetry Management</h1>
          <p className="text-gray-600 mt-2">Manage Sufi poetry and verses</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Poetry
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Poetry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Poet Name</Label>
                  <Input
                    value={formData.poet}
                    onChange={(e) => setFormData({ ...formData, poet: e.target.value })}
                    placeholder="Enter poet name"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="sufi">Sufi Poetry</option>
                    <option value="ghazal">Ghazal</option>
                    <option value="kalam">Kalam</option>
                    <option value="rubai">Rubai</option>
                    <option value="other">Other</option>
                  </select>
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
                    <Label>Title (English)</Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Enter poetry title"
                      required
                    />
                  </div>
                  <div>
                    <Label>Poetry Content (English)</Label>
                    <Textarea
                      value={formData.contentEn}
                      onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                      placeholder="Enter the poetry verses..."
                      rows={8}
                      required
                    />
                  </div>
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
                    <Label>Poetry Content (Urdu)</Label>
                    <Textarea
                      value={formData.contentUr}
                      onChange={(e) => setFormData({ ...formData, contentUr: e.target.value })}
                      placeholder="کلام درج کریں..."
                      dir="rtl"
                      rows={8}
                      required
                    />
                  </div>
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
                    <Label>Poetry Content (Sindhi)</Label>
                    <Textarea
                      value={formData.contentSd}
                      onChange={(e) => setFormData({ ...formData, contentSd: e.target.value })}
                      placeholder="ڪلام لکو..."
                      dir="rtl"
                      rows={8}
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex space-x-3">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Adding...' : 'Add Poetry'}
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
          <CardTitle>All Poetry ({poetry.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {poetry.length === 0 ? (
            <div className="text-center py-12">
              <Feather className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No poetry yet</h3>
              <p className="mt-2 text-gray-600">Get started by adding your first poetry</p>
            </div>
          ) : (
            <div className="space-y-4">
              {poetry.map((poem) => (
                <div
                  key={poem.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Feather className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
                            {poem.category?.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{poem.title}</h3>
                        {poem.poet && <p className="text-sm text-gray-500">By: {poem.poet}</p>}
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-line line-clamp-3">
                          {poem.content?.substring(0, 200)}...
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(poem.id)}
                      className="text-red-600 hover:text-red-700 ml-4"
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
