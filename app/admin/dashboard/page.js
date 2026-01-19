'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Users,
  Book,
  Music,
  Video,
  Calendar,
  Image as ImageIcon,
  Newspaper,
  TrendingUp,
  Sliders,
  Feather,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    saints: 0,
    books: 0,
    audio: 0,
    videos: 0,
    events: 0,
    gallery: 0,
    news: 0,
    slider: 0,
    poetry: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Slider Images', value: stats.slider, icon: Sliders, color: 'bg-orange-500', href: '/admin/slider' },
    { name: 'Saints', value: stats.saints, icon: Users, color: 'bg-emerald-500', href: '/admin/saints' },
    { name: 'Books', value: stats.books, icon: Book, color: 'bg-blue-500', href: '/admin/books' },
    { name: 'Audio Files', value: stats.audio, icon: Music, color: 'bg-purple-500', href: '/admin/audio' },
    { name: 'Videos', value: stats.videos, icon: Video, color: 'bg-red-500', href: '/admin/videos' },
    { name: 'Poetry', value: stats.poetry, icon: Feather, color: 'bg-indigo-500', href: '/admin/poetry' },
    { name: 'Events', value: stats.events, icon: Calendar, color: 'bg-yellow-500', href: '/admin/events' },
    { name: 'Gallery Images', value: stats.gallery, icon: ImageIcon, color: 'bg-pink-500', href: '/admin/gallery' },
    { name: 'News Articles', value: stats.news, icon: Newspaper, color: 'bg-teal-500', href: '/admin/news' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Dargah Admin Panel</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">View Website</p>
                  <p className="text-2xl font-bold text-emerald-600">Frontend</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/saints">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">View Saints</p>
                  <p className="text-2xl font-bold text-blue-600">Public Page</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/introduction">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Introduction</p>
                  <p className="text-2xl font-bold text-purple-600">Public Page</p>
                </div>
                <Book className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold">Manage Slider Images</p>
                <p className="text-sm text-gray-600">Upload and organize homepage slider images</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold">Add Saints Profiles</p>
                <p className="text-sm text-gray-600">Create detailed profiles for saints in all three languages</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold">Upload Books & Media</p>
                <p className="text-sm text-gray-600">Add PDFs, audio files, and video links</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <p className="font-semibold">Create Events & News</p>
                <p className="text-sm text-gray-600">Keep visitors informed about upcoming events and news</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}