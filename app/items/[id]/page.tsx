'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Phone, MessageCircle, ShieldCheck, User, ArrowLeft, Sparkles, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Owner {
  name: string;
  phoneNumber?: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  depositAmount: number | null;
  location: string;
  imageUrls: string[];
  isAvailable?: boolean;
  user: Owner;
}

export default function ItemDetails() {
  const params = useParams();
  const { id } = params;

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    fetch(`/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItem(data.data);
          if (data.data.imageUrls && data.data.imageUrls.length > 0) {
            setActiveImage(data.data.imageUrls[0]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching item details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
          <p className="text-slate-600 text-sm font-semibold tracking-wide">
            Loading item details…
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Item not found</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">We couldn&apos;t find that item or it may have been removed.</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-3 rounded-full transition-all shadow-md hover:shadow-indigo-500/25"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>
    );
  }

  const isNotAvailable = item.isAvailable === false;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-sm transition-all hover:shadow"
          >
            <ArrowLeft className="w-4 h-4" /> Back to listings
          </Link>
        </div>

        {/* Main card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-6 sm:p-8 lg:p-10">
          
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-100 h-[320px] sm:h-[420px] relative shadow-inner">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-all duration-300 ${isNotAvailable ? 'opacity-40 grayscale' : 'hover:scale-105'}`}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
                  No image available
                </div>
              )}

              {/* Status Badge */}
              {isNotAvailable ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
                  <span className="bg-rose-600 text-white text-xs font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-lg animate-bounce">
                    Rented Out — Not Available
                  </span>
                </div>
              ) : (
                <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Available Now
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {item.imageUrls && item.imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {item.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(url)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 shadow-sm ${
                      activeImage === url ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-95' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Title & Category Badge */}
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  <Tag className="w-3 h-3" /> Verified Listing
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {item.title}
                </h1>
              </div>

              {/* Price Tag */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border border-indigo-100/60 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Rental Price</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-indigo-900">
                      Rs. {Number(item.pricePerDay || 0).toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-sm font-medium">/ day</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-slate-600 text-sm font-semibold">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mr-2.5 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{item.location}</span>
              </div>

              {/* Security Deposit Box */}
              {item.depositAmount && (
                <div className="bg-amber-50/70 border border-amber-200/60 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Security Deposit Required</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Rs. {Number(item.depositAmount).toLocaleString()} or a valid NIC, to be handed to the owner upon collection.
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider text-slate-400">
                  Description
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Owner Section & Action Buttons */}
            <div className="pt-6 border-t border-slate-100 space-y-5">
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md flex-shrink-0 font-bold">
                  {item.user?.name ? item.user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-900 text-sm truncate">{item.user?.name || 'Owner'}</p>
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Owner
                  </p>
                </div>
              </div>

              {!isNotAvailable ? (
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${item.user?.phoneNumber || ''}`}
                    className="bg-indigo-900 hover:bg-indigo-800 text-white py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-indigo-900/25 active:scale-95"
                  >
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                  {(() => {
                    const rawPhone = item.user?.phoneNumber || '';
                    let cleaned = rawPhone.replace(/\D/g, '');
                    if (cleaned.startsWith('0')) {
                      cleaned = '94' + cleaned.slice(1);
                    } else if (!cleaned.startsWith('94') && cleaned.length === 9) {
                      cleaned = '94' + cleaned;
                    }
                    const msg = encodeURIComponent(`Hi ${item.user?.name || 'Owner'}, I am interested in renting your item "${item.title}" on Illamu.lk.`);
                    
                    return (
                      <a
                        href={cleaned ? `https://wa.me/${cleaned}?text=${msg}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-emerald-600/25 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    );
                  })()}
                </div>
              ) : (
                <div className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-2xl font-bold text-sm text-center border border-slate-200">
                  Currently Rented Out
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}