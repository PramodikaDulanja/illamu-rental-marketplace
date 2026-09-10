'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Upload, X, Sparkles, MapPin, Tag, DollarSign, FileText, Image as ImageIcon, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const sriLankaDistricts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

export default function PostAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  // Custom Confirmation Modal සඳහා states
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    depositAmount: '',
    district: 'Colombo',
    subLocation: '',
    categoryId: '1',
    userId: '', 
  });

  useEffect(() => {
    // 🗂️ බ්‍රව්සර් ටැබ් එකේ නම Post Ad පිටුවට අදාළව වෙනස් කිරීම
    document.title = 'Post Your Rental Ad | Illamu.lk';

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      toast.error('Please sign up or log in first!', { duration: 2000 });
      setTimeout(() => {
        router.push('/signup');
      }, 1000);
    } else {
      setFormData((prev) => ({ ...prev, userId: storedUserId }));
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (imageFiles.length + selectedFiles.length > 5) {
        toast.error('You can only upload a maximum of 5 images.', { duration: 2000 });
        return;
      }
      setImageFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleFormSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();

    setConfirmModal({
      show: true,
      title: 'Publish Ad Confirmation',
      message: 'Are you sure you want to publish this rental ad?',
      onConfirm: async () => {
        setLoading(true);
        setError('');

        try {
          const uploadedImageUrls: string[] = [];
          
          for (const file of imageFiles) {
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error: uploadError } = await supabase.storage
              .from('item-images')
              .upload(fileName, file);

            if (uploadError) {
              throw new Error('Image upload failed: ' + uploadError.message);
            }

            const { data: publicUrlData } = supabase.storage
              .from('item-images')
              .getPublicUrl(fileName);

            uploadedImageUrls.push(publicUrlData.publicUrl);
          }

          const itemData = {
            title: formData.title,
            description: formData.description,
            pricePerDay: Number(formData.pricePerDay),
            depositAmount: formData.depositAmount ? Number(formData.depositAmount) : null,
            district: formData.district,
            subLocation: formData.subLocation,
            location: `${formData.district} - ${formData.subLocation}`,
            imageUrls: uploadedImageUrls,
            userId: formData.userId,
            categoryId: Number(formData.categoryId),
          };

          const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
          });

          const result = await response.json();

          if (result.success) {
            toast.success('Ad posted successfully!', { duration: 2000 });
            setTimeout(() => {
              router.push('/');
            }, 1000);
          } else {
            setError(result.error || 'Something went wrong');
            toast.error(result.error || 'Something went wrong', { duration: 2000 });
          }
        } catch (err: any) {
          console.error('Failed to post ad:', err);
          setError(err.message || 'Failed to post ad.');
          toast.error(err.message || 'Failed to post ad.', { duration: 2000 });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 text-slate-800 relative">
      
      {/* Header Banner */}
      <div className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Monetize Your Assets
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Post Your Item for Rent</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">Fill in the details below to list your item across Sri Lanka safely and securely.</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl mb-6 text-sm font-semibold shadow-sm flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleFormSubmitClick} className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">1. Item Information</h2>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" /> Item Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Sony DSLR Camera / Camping Tent"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item, its condition, and rules for renting..."
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all"
            >
              <option value="1">Electronics & Cameras</option>
              <option value="2">Travel & Camping</option>
              <option value="3">Tools & Equipment</option>
              <option value="4">Vehicles & Bikes</option>
              <option value="5">Party & Events</option>
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">2. Pricing & Deposit</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-600" /> Price Per Day (Rs.)
              </label>
              <input
                type="number"
                name="pricePerDay"
                required
                value={formData.pricePerDay}
                onChange={handleChange}
                placeholder="2500"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Refundable Deposit (Rs.)
              </label>
              <input
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleChange}
                placeholder="10000 (Optional)"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">3. Item Location</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> District
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all"
              >
                {sriLankaDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Area / Sub-location</label>
              <input
                type="text"
                name="subLocation"
                required
                value={formData.subLocation}
                onChange={handleChange}
                placeholder="e.g. Balangoda, Kollupitiya"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">4. Photos (Maximum 5)</h2>
          
          <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl p-6 text-center bg-slate-50/50 transition-all relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-700">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400 font-medium">PNG, JPG, WEBP up to 5 images</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Selected images</span>
            <span className="text-indigo-600">{imageFiles.length} / 5</span>
          </div>

          {imageFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs">
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm tracking-wide"
          >
            {loading ? 'Uploading & Publishing Ad...' : 'Publish Rental Ad'}
          </button>
        </div>

      </form>

      {/* Professional Yes / No Custom Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">{confirmModal.title}</h3>
              <p className="text-slate-500 text-xs font-medium px-2">{confirmModal.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: () => {} })}
                className="w-full py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ show: false, title: '', message: '', onConfirm: () => {} });
                }}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/25 transition-all"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}