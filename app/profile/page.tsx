'use client';

import { useEffect, useState } from 'react';
import { Phone, ShieldCheck, Package, LogOut, Trash2, Edit, MapPin, Mail, X, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
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

  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    email: '',
  });
  const router = useRouter();

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'fc1d6aca-d503-43f4-a177-80d7779a3f50' : '';

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const userData = data.data;
          setUser(userData);
          setEditForm({
            name: userData.name || '',
            phoneNumber: userData.phoneNumber || '',
            address: userData.address || '',
            email: userData.email || '',
          });
        } else {
          setUser({
            name: localStorage.getItem('userName') || 'User',
            phoneNumber: 'Not Available',
            address: 'Not Available',
            email: 'Not Available',
            items: [],
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching profile data:', err);
        setLoading(false);
      });
  }, [userId]);

  // Log Out Confirmation Trigger
  const handleLogout = () => {
    setConfirmModal({
      show: true,
      title: 'Log Out Confirmation',
      message: 'Are you sure you want to log out of your account?',
      onConfirm: () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('isAdmin');
        toast.success('Logged out successfully!', { duration: 2000 });
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      },
    });
  };

  // Delete Item Confirmation Trigger
  const handleDeleteItem = async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    setConfirmModal({
      show: true,
      title: 'Delete Ad Confirmation',
      message: 'Are you sure you want to delete this ad permanently? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/items/${itemId}`, {
            method: 'DELETE',
          });
          const data = await res.json();

          if (data.success) {
            setUser((prevUser: any) => ({
              ...prevUser,
              items: prevUser.items.filter((item: any) => item.id !== itemId)
            }));
            toast.success('Ad deleted successfully!', { duration: 2000 });
          } else {
            toast.error('Error: ' + data.error, { duration: 2000 });
          }
        } catch (error) {
          console.error('Error deleting ad:', error);
          toast.error('Something went wrong while deleting the ad.', { duration: 2000 });
        }
      },
    });
  };

  // Profile Update Trigger (Edit Profile Confirmation)
  const handleUpdateProfileClick = (e: React.FormEvent) => {
    e.preventDefault();

    setConfirmModal({
      show: true,
      title: 'Update Profile Confirmation',
      message: 'Are you sure you want to save these changes to your profile?',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm),
          });
          const data = await res.json();

          if (res.ok) {
            setUser((prev: any) => ({ ...prev, ...editForm }));
            localStorage.setItem('userName', editForm.name);
            setIsEditing(false);
            toast.success('Profile updated successfully!', { duration: 2000 });
            router.refresh();
          } else {
            toast.error('Error: ' + (data.error || 'Failed to update profile'), { duration: 2000 });
          }
        } catch (error) {
          console.error('Error updating profile:', error);
          toast.error('Something went wrong while updating profile.', { duration: 2000 });
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
          <p className="text-slate-600 text-sm font-semibold tracking-wide">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold shadow-inner">
          🔒
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Authentication required</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">Please log in to view your profile and manage your ads.</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-3 rounded-full transition-all shadow-md hover:shadow-indigo-500/25"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 text-slate-800 relative">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* User Info Card & Actions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-indigo-500/20 shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{user.name || 'User Profile'}</h1>
                <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/60 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Account
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-500 text-xs sm:text-sm font-medium pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-500 shrink-0" /> 
                  <span>{user.phoneNumber || 'Not Available'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500 shrink-0" /> 
                  <span className="truncate">{user.email || 'Not Available'}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" /> 
                  <span>{user.address || 'Not Available'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end relative z-10 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            {typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true' && (
              <Link 
                href="/admin" 
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md hover:shadow-rose-500/25 flex items-center gap-1.5"
              >
                🛡️ Admin Dashboard
              </Link>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center bg-slate-50 hover:bg-indigo-50 text-indigo-900 hover:text-indigo-700 px-4.5 py-2.5 rounded-2xl font-bold text-xs transition-all border border-slate-200 shadow-sm"
            >
              <Edit className="w-4 h-4 mr-1.5 text-indigo-600" /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 px-4.5 py-2.5 rounded-2xl font-bold text-xs transition-all border border-rose-100 shadow-sm"
            >
              <LogOut className="w-4 h-4 mr-1.5 text-rose-500" /> Log Out
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-slate-100">
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h2 className="text-xl font-black text-slate-900 mb-6">Edit Profile</h2>
              
              <form onSubmit={handleUpdateProfileClick} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Address</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md hover:shadow-indigo-500/25 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User's Posted Ads Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" /> My Posted Ads
            </h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
              {user.items?.length || 0} listings
            </span>
          </div>

          {user.items?.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                🏷️
              </div>
              <p className="text-slate-600 text-sm font-medium">You haven&apos;t posted any ads yet.</p>
              <Link 
                href="/post-ad"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-md transition-all"
              >
                + Post your first ad
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.items.map((item: any) => (
                <div key={item.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  
                  <Link href={`/items/${item.id}`} className="block">
                    <div className="h-44 bg-slate-100 relative overflow-hidden">
                      {item.imageUrls?.[0] ? (
                        <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 text-xs font-semibold">No Image</div>
                      )}
                      
                      {/* Availability Indicator */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-sm uppercase tracking-wider ${
                          item.isAvailable !== false ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {item.isAvailable !== false ? 'Active' : 'Rented Out'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 pb-3 space-y-1">
                      <h3 className="font-bold text-slate-800 text-base truncate group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                      <p className="text-indigo-900 font-extrabold text-base">
                        Rs. {item.pricePerDay?.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ day</span>
                      </p>
                    </div>
                  </Link>

                  <div className="p-5 pt-0 space-y-2 mt-auto">
                    <button
                      onClick={() => {
                        const newStatus = item.isAvailable === false ? true : false;
                        setConfirmModal({
                          show: true,
                          title: 'Update Availability Status',
                          message: `Are you sure you want to mark this item as ${newStatus ? 'Available' : 'Rented Out'}?`,
                          onConfirm: async () => {
                            const res = await fetch(`/api/items/${item.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ isAvailable: newStatus })
                            });
                            if (res.ok) {
                              toast.success(newStatus ? 'Item marked as Available!' : 'Item marked as Rented Out!', { duration: 2000 });
                              setTimeout(() => {
                                window.location.reload();
                              }, 1500);
                            } else {
                              toast.error('Failed to update status', { duration: 2000 });
                            }
                          }
                        });
                      }}
                      className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                        item.isAvailable !== false 
                          ? 'bg-amber-50 text-amber-700 border-amber-200/60 hover:bg-amber-100' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100'
                      }`}
                    >
                      {item.isAvailable !== false ? 'Mark as Rented Out' : 'Mark as Available'}
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setConfirmModal({
                            show: true,
                            title: 'Edit Ad Confirmation',
                            message: 'Are you sure you want to edit this ad details?',
                            onConfirm: () => {
                              router.push(`/items/${item.id}/edit`);
                            },
                          });
                        }}
                        className="flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 py-2 rounded-xl text-xs font-bold transition-colors border border-indigo-100"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>

                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 rounded-xl text-xs font-bold transition-colors border border-rose-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

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
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ show: false, title: '', message: '', onConfirm: () => {} });
                }}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-indigo-300 transition-all"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: () => {} })}
                className="w-full py-3 rounded-2xl bg-indigo-100 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-indigo-300 transition-colors"
              >
                No
              </button>
            
            </div>
          </div>
        </div>
      )}
    </main>
  );
}