'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Tent, Camera, Wrench, PartyPopper, Backpack, MapPin, Filter, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  pricePerDay: number;
  location: string;
  imageUrls: string[];
  categoryId: number;
  isAvailable?: boolean;
}

const sriLankaDistricts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [subLocationSearch, setSubLocationSearch] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: '1', name: 'Electronics & Cameras', icon: <Camera className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300' },
    { id: '2', name: 'Travel & Camping', icon: <Tent className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300' },
    { id: '3', name: 'Tools & Equipment', icon: <Wrench className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 border-amber-100 hover:border-amber-300' },
    { id: '4', name: 'Vehicles & Bikes', icon: <Backpack className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50 border-rose-100 hover:border-rose-300' },
    { id: '5', name: 'Party & Events', icon: <PartyPopper className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50 border-purple-100 hover:border-purple-300' },
  ];

  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching items:', err);
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.categoryId.toString() !== selectedCategory) {
      return false;
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedDistrict !== 'all') {
      if (!item.location.toLowerCase().includes(selectedDistrict.toLowerCase())) {
        return false;
      }
    }
    if (subLocationSearch) {
      if (!item.location.toLowerCase().includes(subLocationSearch.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white">
      
      {/* Modern Gradient Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 px-6 py-20 lg:py-28 text-center text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-medium tracking-wide shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Sri Lanka&apos;s Premier Rental Marketplace
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Rent Anything, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-300">Anywhere</span>
          </h1>
          
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light">
            ඔබ ළඟ තිබෙන, ඔබ භාවිත නොකරන භාණ්ඩ වෙනත් අයට කුලියට දී අමතර ආදායමක් උපයා ගන්න.
          </p>

          {/* Floating Search Bar */}
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-xl rounded-full p-2.5 flex items-center shadow-2xl border border-white/20 transition-all hover:border-indigo-400">
            <div className="pl-4 text-indigo-600">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Camping tents, cameras, tools hoyanna..."
              className="flex-1 px-4 py-2 outline-none text-slate-800 bg-transparent placeholder-slate-400 text-sm sm:text-base font-medium"
            />
            <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-indigo-500/25 active:scale-95">
              Search
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Transactions
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Instant Listings
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" /> Island-wide Coverage
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Pills */}
      <section className="max-w-6xl mx-auto px-6 -translate-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left shadow-sm backdrop-blur-md ${
                selectedCategory === cat.id 
                  ? 'bg-indigo-900 text-white border-indigo-900 shadow-indigo-900/20 shadow-lg scale-[1.02]' 
                  : 'bg-white text-slate-700 border-slate-100 hover:border-indigo-200 hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-xl ${selectedCategory === cat.id ? 'bg-white/10 text-white' : cat.bg}`}>
                {cat.icon}
              </div>
              <span className="text-xs sm:text-sm font-semibold truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Advanced Filter Section */}
      <section className="max-w-6xl mx-auto px-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
              <Filter className="w-5 h-5 text-indigo-600" />
              <h2>Filter & Location</h2>
            </div>
            {(selectedCategory !== 'all' || selectedDistrict !== 'all' || subLocationSearch || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDistrict('all');
                  setSubLocationSearch('');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-700"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-700"
              >
                <option value="all">All Districts (25)</option>
                {sriLankaDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Sub-location / Area</label>
              <input
                type="text"
                value={subLocationSearch}
                onChange={(e) => setSubLocationSearch(e.target.value)}
                placeholder="e.g. Balangoda, Kollupitiya"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Available Items Section */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Available Items
            </h2>
            <p className="text-xs text-slate-500 font-medium">Showing items matching your active search</p>
          </div>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
            {filteredItems.length} items found
          </span>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 animate-pulse space-y-4">
                <div className="h-48 bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              📦
            </div>
            <h3 className="text-lg font-bold text-slate-800">No items found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">We couldn&apos;t find anything matching your filters. Try resetting them to explore all listings.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDistrict('all');
                setSubLocationSearch('');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-indigo-500/25"
            >
              Reset all filters <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const isNotAvailable = item.isAvailable === false;

              return (
                <Link 
                  href={`/items/${item.id}`} 
                  key={item.id} 
                  className="group bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative"
                >
                  <div className="h-52 bg-slate-100 relative overflow-hidden">
                    {item.imageUrls && item.imageUrls.length > 0 ? (
                      <img 
                        src={item.imageUrls[0]} 
                        alt={item.title} 
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isNotAvailable ? 'opacity-40 grayscale' : ''}`} 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 text-xs font-semibold bg-slate-50">No Image Available</div>
                    )}

                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-700 shadow-sm">
                      ID: #{item.id.slice(0, 4)}
                    </div>

                    {isNotAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
                        <span className="bg-rose-600 text-white text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg animate-bounce">
                          Rented Out
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                      <div className="flex items-center text-slate-500 text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Rental Rate</span>
                        <span className="text-indigo-900 font-extrabold text-base">
                          Rs. {item.pricePerDay.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ day</span>
                        </span>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}