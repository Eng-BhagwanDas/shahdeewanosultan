'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Contact Us',
    backToHome: 'Back to Home',
    subtitle: 'Get in touch with us',
    name: 'Your Name',
    email: 'Your Email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    sending: 'Sending...',
    contactInfo: 'Contact Information',
    address: 'Dargah Address',
    addressDetail: 'Dargah of Hazrat Shah Deewano Sultan, City, Pakistan',
    phone: 'Phone',
    phoneNumber: '+92 XXX XXXXXXX',
    email: 'Email',
    emailAddress: 'info@dargah.com',
    visitingHours: 'Visiting Hours',
    hours: 'Open daily from sunrise to sunset',
    successMessage: 'Thank you for your message! We will get back to you soon.',
  },
  ur: {
    title: '\u06c1\u0645 \u0633\u06d2 \u0631\u0627\u0628\u0637\u06c1 \u06a9\u0631\u06cc\u06ba',
    backToHome: '\u0648\u0627\u067e\u0633 \u06c1\u0648\u0645 \u067e\u06cc\u062c',
    subtitle: '\u06c1\u0645 \u0633\u06d2 \u0631\u0627\u0628\u0637\u06c1 \u06a9\u0631\u06cc\u06ba',
    name: '\u0622\u067e \u06a9\u0627 \u0646\u0627\u0645',
    email: '\u0622\u067e \u06a9\u0627 \u0627\u06cc\u0645\u06cc\u0644',
    subject: '\u0645\u0648\u0636\u0648\u0639',
    message: '\u067e\u06cc\u063a\u0627\u0645',
    send: '\u067e\u06cc\u063a\u0627\u0645 \u0628\u06be\u06cc\u062c\u06cc\u06ba',
    sending: '\u0628\u06be\u06cc\u062c\u0627 \u062c\u0627 \u0631\u06c1\u0627 \u06c1\u06d2...',
    contactInfo: '\u0631\u0627\u0628\u0637\u06c1 \u06a9\u06cc \u0645\u0639\u0644\u0648\u0645\u0627\u062a',
    address: '\u062f\u0631\u06af\u0627\u06c1 \u06a9\u0627 \u067e\u062a\u06c1',
    addressDetail: '\u062d\u0636\u0631\u062a \u0634\u0627\u06c1 \u062f\u06cc\u0648\u0627\u0646\u0648 \u0633\u0644\u0637\u0627\u0646 \u06a9\u06cc \u062f\u0631\u06af\u0627\u06c1\u060c \u0634\u06c1\u0631\u060c \u067e\u0627\u06a9\u0633\u062a\u0627\u0646',
    phone: '\u0641\u0648\u0646',
    phoneNumber: '+92 XXX XXXXXXX',
    emailAddress: 'info@dargah.com',
    visitingHours: '\u0632\u06cc\u0627\u0631\u062a \u06a9\u06d2 \u0627\u0648\u0642\u0627\u062a',
    hours: '\u0637\u0644\u0648\u0639 \u0622\u0641\u062a\u0627\u0628 \u0633\u06d2 \u063a\u0631\u0648\u0628 \u0622\u0641\u062a\u0627\u0628 \u062a\u06a9 \u0631\u0648\u0632\u0627\u0646\u06c1 \u06a9\u06be\u0644\u0627',
    successMessage: '\u0622\u067e \u06a9\u06d2 \u067e\u06cc\u063a\u0627\u0645 \u06a9\u06d2 \u0644\u06cc\u06d2 \u0634\u06a9\u0631\u06cc\u06c1\u06d4 \u06c1\u0645 \u062c\u0644\u062f \u06c1\u06cc \u0622\u067e \u0633\u06d2 \u0631\u0627\u0628\u0637\u06c1 \u06a9\u0631\u06cc\u06ba \u06af\u06d2\u06d4',
  },
  sd: {
    title: '\u0627\u0633\u0627\u0646 \u0633\u0627\u0646 \u0631\u0627\u0628\u0637\u0648 \u06aa\u0631\u064a\u0648',
    backToHome: '\u0648\u0627\u067e\u0633 \u06af\u0647\u0631',
    subtitle: '\u0627\u0633\u0627\u0646 \u0633\u0627\u0646 \u0631\u0627\u0628\u0637\u0648 \u06aa\u0631\u064a\u0648',
    name: '\u062a\u0648\u0647\u0627\u0646\u062c\u0648 \u0646\u0627\u0644\u0648',
    email: '\u062a\u0648\u0647\u0627\u0646\u062c\u064a \u0627\u064a\u0645\u064a\u0644',
    subject: '\u0645\u0648\u0636\u0648\u0639',
    message: '\u067e\u064a\u063a\u0627\u0645',
    send: '\u067e\u064a\u063a\u0627\u0645 \u0645\u0648\u06aa\u0644\u064a\u0648',
    sending: '\u0645\u0648\u06aa\u0644\u064a\u0648 \u067e\u064a\u0648 \u0622\u0647\u064a...',
    contactInfo: '\u0631\u0627\u0628\u0637\u064a \u062c\u064a \u0645\u0639\u0644\u0648\u0645\u0627\u062a',
    address: '\u062f\u0631\u06af\u0627\u0647\u0647 \u062c\u0648 \u067e\u062a\u0648',
    addressDetail: '\u062d\u0636\u0631\u062a \u0634\u0627\u0647\u0647 \u062f\u064a\u0648\u0627\u0646\u0648 \u0633\u0644\u0637\u0627\u0646 \u062c\u064a \u062f\u0631\u06af\u0627\u0647\u0647\u060c \u0634\u0647\u0631\u060c \u067e\u0627\u06aa\u0633\u062a\u0627\u0646',
    phone: '\u0641\u0648\u0646',
    phoneNumber: '+92 XXX XXXXXXX',
    emailAddress: 'info@dargah.com',
    visitingHours: '\u0632\u064a\u0627\u0631\u062a \u062c\u0627 \u0648\u0642\u062a',
    hours: '\u0637\u0644\u0648\u0639 \u0622\u0641\u062a\u0627\u0628 \u06aa\u0627\u0646 \u063a\u0631\u0648\u0628 \u0622\u0641\u062a\u0627\u0628 \u062a\u0627\u0626\u064a\u0646 \u0631\u0648\u0632\u0627\u0646\u0647 \u06a9\u0644\u0647\u064a\u0644',
    successMessage: '\u062a\u0648\u0647\u0627\u0646\u062c\u064a \u067e\u064a\u063a\u0627\u0645 \u062c\u064a \u0644\u0627\u0621\u0650 \u0634\u06aa\u0631\u064a\u0648\u06d4 \u0627\u0633\u0627\u0646 \u062c\u0644\u062f \u0647\u064a \u062a\u0648\u0647\u0627\u0646 \u0633\u0627\u0646 \u0631\u0627\u0628\u0637\u0648 \u06aa\u0646\u062f\u0627\u0633\u064a\u0646\u06d4',
  },
};

export default function ContactPage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const t = translations[language];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ur' || lang === 'sd');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToHome}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-center flex-1">{t.title}</h1>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLanguageChange('en')}
                className={`${language === 'en' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                English
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLanguageChange('ur')}
                className={`${language === 'ur' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                \u0627\u0631\u062f\u0648
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLanguageChange('sd')}
                className={`${language === 'sd' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                \u0633\u0646\u068c\u064a
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxpc2xhbWljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2MDAwOTQ5Mnww&ixlib=rb-4.1.0&q=85"
          alt="Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <Mail className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.send}</h2>
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{t.successMessage}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>{t.name}</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <Label>{t.email}</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>{t.subject}</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <Label>{t.message}</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? t.sending : t.send}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.contactInfo}</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.address}</h3>
                      <p className="text-gray-600">{t.addressDetail}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.phone}</h3>
                      <p className="text-gray-600">{t.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.email}</h3>
                      <p className="text-gray-600">{t.emailAddress}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t.visitingHours}</h3>
                <p className="text-gray-600">{t.hours}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}