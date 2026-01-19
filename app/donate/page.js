'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Heart, CreditCard, Building2, Smartphone, Wallet } from 'lucide-react';
import Link from 'next/link';

const translations = {
  en: {
    title: 'Donate',
    backToHome: 'Back to Home',
    subtitle: 'Support Our Noble Cause',
    intro: 'Your generous donations help us maintain the shrine, serve free meals to visitors, support education programs, and assist the needy in our community.',
    selectAmount: 'Select Amount (PKR)',
    customAmount: 'Custom Amount',
    enterAmount: 'Enter amount in PKR',
    paymentMethod: 'Payment Method',
    donorInfo: 'Donor Information (Optional)',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message/Prayer Request',
    donateNow: 'Donate Now',
    bankTransfer: 'Bank Transfer',
    bankDetails: 'Bank Account Details',
    accountTitle: 'Account Title',
    accountNumber: 'Account Number',
    bankName: 'Bank Name',
    branchCode: 'Branch Code',
    iban: 'IBAN',
    purposes: 'Donation Purposes',
    purpose1: 'Langar (Free Food)',
    purpose2: 'Education Programs',
    purpose3: 'Medical Camps',
    purpose4: 'Orphan Support',
    purpose5: 'Shrine Maintenance',
    purpose6: 'General Fund',
    taxNote: 'Donations are tax deductible. You will receive a receipt for your records.',
  },
  ur: {
    title: 'عطیہ',
    backToHome: 'واپس ہوم پیج',
    subtitle: 'ہمارے نیک مقصد کی مدد کریں',
    intro: 'آپ کے فراخدلانہ عطیات سے ہمیں مزار کی دیکھ بھال، زائرین کو مفت کھانا، تعلیمی پروگرام اور ضرورت مندوں کی مدد کرنے میں مدد ملتی ہے۔',
    selectAmount: 'رقم منتخب کریں (روپے)',
    customAmount: 'اپنی رقم',
    enterAmount: 'روپوں میں رقم درج کریں',
    paymentMethod: 'ادائیگی کا طریقہ',
    donorInfo: 'عطیہ دہندہ کی معلومات (اختیاری)',
    name: 'نام',
    email: 'ای میل',
    phone: 'فون',
    message: 'پیغام/دعا کی درخواست',
    donateNow: 'ابھی عطیہ کریں',
    bankTransfer: 'بینک ٹرانسفر',
    bankDetails: 'بینک اکاؤنٹ کی تفصیلات',
    accountTitle: 'اکاؤنٹ ٹائٹل',
    accountNumber: 'اکاؤنٹ نمبر',
    bankName: 'بینک کا نام',
    branchCode: 'برانچ کوڈ',
    iban: 'آئی بی اے این',
    purposes: 'عطیہ کے مقاصد',
    purpose1: 'لنگر (مفت کھانا)',
    purpose2: 'تعلیمی پروگرام',
    purpose3: 'طبی کیمپ',
    purpose4: 'یتیموں کی مدد',
    purpose5: 'مزار کی دیکھ بھال',
    purpose6: 'عام فنڈ',
    taxNote: 'عطیات ٹیکس کٹوتی کے قابل ہیں۔ آپ کو ریکارڈ کے لیے رسید ملے گی۔',
  },
  sd: {
    title: 'عطيو',
    backToHome: 'واپس گهر',
    subtitle: 'اسان جي نيڪ مقصد جي مدد ڪريو',
    intro: 'اوهان جي فراخدلي عطين سان اسان کي مزار جي سنڀال، زائرن کي مفت کاڌو، تعليمي پروگرام ۽ ضرورتمندن جي مدد ڪرڻ ۾ مدد ملندي آهي.',
    selectAmount: 'رقم چونڊيو (روپيا)',
    customAmount: 'پنهنجي رقم',
    enterAmount: 'روپين ۾ رقم داخل ڪريو',
    paymentMethod: 'ادائيگي جو طريقو',
    donorInfo: 'عطيو ڏيندڙ جي معلومات (اختياري)',
    name: 'نالو',
    email: 'اي ميل',
    phone: 'فون',
    message: 'پيغام/دعا جي درخواست',
    donateNow: 'هاڻي عطيو ڏيو',
    bankTransfer: 'بئنڪ ٽرانسفر',
    bankDetails: 'بئنڪ اڪائونٽ جا تفصيل',
    accountTitle: 'اڪائونٽ ٽائيٽل',
    accountNumber: 'اڪائونٽ نمبر',
    bankName: 'بئنڪ جو نالو',
    branchCode: 'برانچ ڪوڊ',
    iban: 'آئي بي اي اين',
    purposes: 'عطيي جا مقصد',
    purpose1: 'لنگر (مفت کاڌو)',
    purpose2: 'تعليمي پروگرام',
    purpose3: 'طبي ڪيمپ',
    purpose4: 'يتيمن جي مدد',
    purpose5: 'مزار جي سنڀال',
    purpose6: 'عام فنڊ',
    taxNote: 'عطيا ٽيڪس ڪٽوتي جي قابل آهن. اوهان کي رڪارڊ لاءِ رسيد ملندي.',
  },
};

export default function DonatePage() {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('jazzcash');
  const t = translations[language];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ur' || lang === 'sd');
  };

  const amounts = [500, 1000, 2500, 5000, 10000, 25000];

  const paymentMethods = [
    { id: 'jazzcash', name: 'JazzCash', icon: Smartphone, color: 'bg-red-500' },
    { id: 'easypaisa', name: 'EasyPaisa', icon: Wallet, color: 'bg-green-500' },
    { id: 'bank', name: t.bankTransfer, icon: Building2, color: 'bg-blue-500' },
  ];

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
              <Button variant="ghost" size="sm" onClick={() => handleLanguageChange('en')} className={`${language === 'en' ? 'bg-white/20' : 'hover:bg-white/10'}`}>English</Button>
              <Button variant="ghost" size="sm" onClick={() => handleLanguageChange('ur')} className={`${language === 'ur' ? 'bg-white/20' : 'hover:bg-white/10'}`}>اردو</Button>
              <Button variant="ghost" size="sm" onClick={() => handleLanguageChange('sd')} className={`${language === 'sd' ? 'bg-white/20' : 'hover:bg-white/10'}`}>سنڌي</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200" alt="Donate" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <Heart className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
            <p className="text-xl mt-2 opacity-90">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Donation Form */}
          <div className="lg:col-span-2">
            {/* Introduction */}
            <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardContent className="p-6">
                <p className="text-lg text-gray-700 leading-relaxed">{t.intro}</p>
              </CardContent>
            </Card>

            {/* Amount Selection */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{t.selectAmount}</h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {amounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? 'default' : 'outline'}
                      onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                      className={selectedAmount === amount ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    >
                      Rs. {amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
                <div>
                  <Label>{t.customAmount}</Label>
                  <Input
                    type="number"
                    placeholder={t.enterAmount}
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{t.paymentMethod}</h2>
                <div className="grid grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${selectedMethod === method.id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}
                    >
                      <div className={`${method.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <method.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-semibold text-sm">{method.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bank Details (if bank transfer selected) */}
            {selectedMethod === 'bank' && (
              <Card className="mb-6 bg-blue-50">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">{t.bankDetails}</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.accountTitle}:</span>
                      <span className="font-semibold">Dargah Shah Deewano Trust</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.bankName}:</span>
                      <span className="font-semibold">Habib Bank Limited</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.accountNumber}:</span>
                      <span className="font-semibold font-mono">1234567890123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.branchCode}:</span>
                      <span className="font-semibold">0001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.iban}:</span>
                      <span className="font-semibold font-mono text-sm">PK00HABB0001234567890123</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Donor Info */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{t.donorInfo}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.name}</Label>
                    <Input className="mt-2" />
                  </div>
                  <div>
                    <Label>{t.phone}</Label>
                    <Input className="mt-2" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>{t.email}</Label>
                    <Input type="email" className="mt-2" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>{t.message}</Label>
                    <textarea className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
              <Heart className="mr-2" />
              {t.donateNow}
            </Button>

            <p className="text-sm text-gray-500 text-center mt-4">{t.taxNote}</p>
          </div>

          {/* Sidebar - Donation Purposes */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{t.purposes}</h2>
                <div className="space-y-3">
                  {[
                    { name: t.purpose1, icon: '🍽️', color: 'bg-orange-100' },
                    { name: t.purpose2, icon: '📚', color: 'bg-blue-100' },
                    { name: t.purpose3, icon: '🏥', color: 'bg-red-100' },
                    { name: t.purpose4, icon: '👶', color: 'bg-pink-100' },
                    { name: t.purpose5, icon: '🕌', color: 'bg-emerald-100' },
                    { name: t.purpose6, icon: '💰', color: 'bg-yellow-100' },
                  ].map((purpose, idx) => (
                    <div key={idx} className={`${purpose.color} p-3 rounded-lg flex items-center space-x-3`}>
                      <span className="text-2xl">{purpose.icon}</span>
                      <span className="font-medium">{purpose.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
