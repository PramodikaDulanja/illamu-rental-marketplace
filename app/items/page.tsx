'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Phone, MessageCircle, ShieldCheck, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Owner {
  name: string
  phoneNumber?: string
}

interface Item {
  id: string
  title: string
  description: string
  pricePerDay: number
  depositAmount: number | null
  location: string
  imageUrls: string[]
  isAvailable?: boolean // මෙය එකතු කරන්න
  user: Owner
}

export default function ItemDetails() {
  const params = useParams();
  const router = useRouter();
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
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading item details...</div>;
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">Item not found.</p>
        <Link href="/" className="text-blue-700 font-medium hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  // item එක available නැත්නම් (isAvailable === false)
  const isNotAvailable = item.isAvailable === false;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/" className="text-blue-700 hover:underline text-sm font-medium flex items-center w-fit">
            &larr; Back to Home
          </Link>
        </div>

        {/* Main Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Left: Product Image & Thumbnails */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-gray-100 h-[300px] md:h-[400px] relative">
              {activeImage ? (
                <img 
                  src={activeImage} 
                  alt={item.title} 
                  className={`w-full h-full object-cover ${isNotAvailable ? 'opacity-50' : ''}`} 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No Image Available</div>
              )}

              {/* Rented Out Badge & Blur Overlay */}
              {isNotAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                    Rented Out / Not Available
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail list (Multiple images thiyenawanam) */}
            {item.imageUrls && item.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {item.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(url)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      activeImage === url ? 'border-blue-900' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <p className="text-3xl font-extrabold text-blue-900 mb-4">
                Rs. {Number(item.pricePerDay || 0).toLocaleString()} <span className="text-lg text-gray-500 font-normal">/ day</span>
              </p>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                {item.location}
              </div>
              
              {/* Security Deposit Info */}
              {item.depositAmount && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start mb-6">
                  <ShieldCheck className="w-6 h-6 text-blue-700 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Security Deposit Required</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Rs. {Number(item.depositAmount).toLocaleString()} or a valid NIC must be provided to the seller upon item handover.
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <h3 className="font-bold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Seller Info & Actions */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 border border-gray-200">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{item.user?.name || 'Owner'}</p>
                  <p className="text-xs text-green-600 font-semibold flex items-center mt-1">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified Seller
                  </p>
                  <p className="text-sm text-gray-600 flex items-center mt-0.5">
                    <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" /> {item.user?.phoneNumber || 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Call / WhatsApp or Not Available Message */}
              {!isNotAvailable ? (
                <div className="flex gap-3">
                  <a
                    href={`tel:${item.user?.phoneNumber || ''}`}
                    className="flex-1 bg-blue-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-blue-800 transition-colors shadow-sm"
                  >
                    <Phone className="w-5 h-5 mr-2" /> Call Now
                  </a>
                  <a
                    href={`https://wa.me/${item.user?.phoneNumber || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                  </a>
                </div>
              ) : (
                <div className="w-full bg-gray-100 border border-gray-200 text-gray-600 py-3.5 rounded-xl font-bold text-center">
                  Currently Rented / Not Available
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}