'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Book,
  Music,
  Video,
  Calendar,
  Image as ImageIcon,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  Sliders,
  Feather,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Slider', href: '/admin/slider', icon: Sliders },
  { name: 'Saints', href: '/admin/saints', icon: Users },
  { name: 'Books', href: '/admin/books', icon: Book },
  { name: 'Audio', href: '/admin/audio', icon: Music },
  { name: 'Videos', href: '/admin/videos', icon: Video },
  { name: 'Poetry', href: '/admin/poetry', icon: Feather },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'News', href: '/admin/news', icon: Newspaper },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === '/admin/login') return;

    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token) {
      router.push('/admin/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-gradient-to-b from-emerald-900 to-emerald-800 text-white`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-emerald-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl text-emerald-700">☪</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">Dargah Admin</h1>
                <p className="text-xs text-emerald-200">Content Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-700/50'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-emerald-700">
            {user && (
              <div className="mb-3">
                <p className="text-sm text-emerald-200">Logged in as</p>
                <p className="font-semibold">{user.username}</p>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-emerald-100 hover:bg-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-emerald-600 hover:bg-emerald-700"
          size="icon"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}