'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Tent, Camera, Wrench, PartyPopper, Backpack, MapPin, Filter } from 'lucide-react';

interface Item {
  id: string
  title: string
  pricePerDay: number
  location: string
  imageUrls: string[]
  categoryId: number
  isAvailable?: boolean
}

// Sri Lankawe District 25
const sriLankaDistricts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all')
  const [subLocationSearch, setSubLocationSearch] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = [
    { id: '1', name: 'Electronics & Cameras', icon: <Camera className="w-5 h-5 text-blue-900" /> },
    { id: '2', name: 'Travel & Camping', icon: <Tent className="w-5 h-5 text-blue-900" /> },
    { id: '3', name: 'Tools & Equipment', icon: <Wrench className="w-5 h-5 text-blue-900" /> },
    { id: '4', name: 'Vehicles & Bikes', icon: <Backpack className="w-5 h-5 text-blue-900" /> },
    { id: '5', name: 'Party & Events', icon: <PartyPopper className="w-5 h-5 text-blue-900" /> },
  ];

  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching items:', err)
        setLoading(false)
      })
  }, [])

  // Filter items based on Category, District, Sub-location and Search query
  const filteredItems = items.filter((item) => {
    // Category filter
    if (selectedCategory !== 'all' && item.categoryId.toString() !== selectedCategory) {
      return false
    }

    // Search query filter (Title eken search kirima)
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Location filter (item.location format eka: "District - SubLocation")
    if (selectedDistrict !== 'all') {
      if (!item.location.toLowerCase().includes(selectedDistrict.toLowerCase())) {
        return false
      }
    }

    if (subLocationSearch) {
      if (!item.location.toLowerCase().includes(subLocationSearch.toLowerCase())) {
        return false
      }
    }

    return true
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section & Search Bar */}
      <section className="bg-blue-900 px-6 py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Rent Anything, Anywhere
        </h1>
        {/* <p className="text-blue-100 mb-8 max-w-lg mx-auto">
          Turn your unused items into a steady stream of income by renting them out to others safely.
        </p> */}
        <p className="text-blue-100 mb-8 max-w-lg mx-auto">
          ඔබ ළඟ තිබෙන, ඔබ භාවිත නොකරන භාණ්ඩ වෙනත් අයට කුලියට දී අමතර ආදායමක් උපයා ගන්න.
        </p>


        <div className="max-w-2xl mx-auto bg-white rounded-full p-2 flex items-center shadow-lg">
          <div className="pl-4">
            <Search className="text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Camping tents, cameras, tools hoyanna..."
            className="flex-1 px-4 py-2 outline-none text-gray-700 bg-transparent w-full"
          />
          <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-full font-medium transition-colors">
            Search
          </button>
        </div>
      </section>

      {/* Filter Section (Categories & Location Selectors) */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-lg mb-2">
            <Filter className="w-5 h-5" />
            <h2>Filter Items</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-900 bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-900 bg-white"
              >
                <option value="all">All Districts</option>
                {sriLankaDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-location Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Sub-location / Area</label>
              <input
                type="text"
                value={subLocationSearch}
                onChange={(e) => setSubLocationSearch(e.target.value)}
                placeholder="e.g. Balangoda, Kollupitiya"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filtered Items Section */}
      <section className="max-w-5xl mx-auto px-6 py-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Available Items ({filteredItems.length})
          </h2>
        </div>
        
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading items...</p>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-600 mb-4">No items found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDistrict('all');
                setSubLocationSearch('');
                setSearchQuery('');
              }}
              className="text-blue-600 font-semibold hover:underline text-sm"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              // item eka available නැත්නම් (isAvailable === false)
              const isNotAvailable = item.isAvailable === false;

              return (
                <Link 
                  href={`/items/${item.id}`} 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col relative"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {item.imageUrls && item.imageUrls.length > 0 ? (
                      <img 
                        src={item.imageUrls[0]} 
                        alt={item.title} 
                        className={`w-full h-full object-cover ${isNotAvailable ? 'opacity-50' : ''}`} 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                    )}

                    {/* Not Available / Rented Out Badge එක */}
                    {isNotAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                          Rented Out
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">{item.title}</h3>
                    <p className="text-blue-900 font-bold mb-3">
                      Rs. {item.pricePerDay.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ day</span>
                    </p>
                    <div className="flex items-center text-gray-500 text-xs mt-auto">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location}
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