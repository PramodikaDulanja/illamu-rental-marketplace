'use client'

import { useEffect, useState } from 'react'
import { Phone, ShieldCheck, Package, LogOut, Trash2, Edit, MapPin, Mail, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    email: '',
  })
  const router = useRouter()

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'fc1d6aca-d503-43f4-a177-80d7779a3f50' : ''

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    // දැන් අපි කෙළින්ම user ගේ ID එක හරහා database එකෙන් ඩේටා ගෙන්වා ගනිමු
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const userData = data.data
          setUser(userData)
          setEditForm({
            name: userData.name || '',
            phoneNumber: userData.phoneNumber || '',
            address: userData.address || '',
            email: userData.email || '',
          })
        } else {
          // Fallback if user not found in DB yet
          setUser({
            name: localStorage.getItem('userName') || 'User',
            phoneNumber: 'Not Available',
            address: 'Not Available',
            email: 'Not Available',
            items: [],
          })
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching profile data:', err)
        setLoading(false)
      })
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    window.location.href = '/'
  }

  const handleDeleteItem = async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Are you sure you want to delete this ad?')) return

    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        setUser((prevUser: any) => ({
          ...prevUser,
          items: prevUser.items.filter((item: any) => item.id !== itemId)
        }))
        alert('Ad deleted successfully!')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting ad:', error)
      alert('Something went wrong')
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()

      if (res.ok) {
        setUser((prev: any) => ({ ...prev, ...editForm }))
        localStorage.setItem('userName', editForm.name)
        setIsEditing(false)
        alert('Profile updated successfully!')
        router.refresh()
      } else {
        alert('Error: ' + (data.error || 'Failed to update profile'))
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Something went wrong')
    }
  }

  if (loading) return <div className="p-20 text-center text-gray-500">Loading profile...</div>

  if (!user) {
    return (
      <div className="p-20 text-center">
        <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
        <Link href="/" className="text-blue-900 font-semibold hover:underline">Back to Home</Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* User Info Card & Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name || 'User Profile'}</h1>
              <p className="text-gray-500 text-sm flex items-center">
                <Phone className="w-4 h-4 mr-1.5 text-gray-400" /> {user.phoneNumber || 'Not Available'}
              </p>
              <p className="text-gray-500 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-400" /> {user.address || 'Not Available'}
              </p>
              <p className="text-gray-500 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-1.5 text-gray-400" /> {user.email || 'Not Available'}
              </p>
              <span className="inline-flex items-center text-green-600 text-xs font-semibold mt-1 bg-green-50 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Account
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            
            {typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true' && (
            <Link 
              href="/admin" 
              className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1 shadow-sm"
            >
              🛡️ Admin Dashboard
            </Link>
          )}

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center bg-blue-50 text-blue-900 hover:bg-blue-100 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors border border-blue-100"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors border border-red-100"
            >
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-900 text-white text-sm font-medium hover:bg-blue-800"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User's Posted Ads Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-900" /> My Posted Ads ({user.items?.length || 0})
          </h2>

          {user.items?.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center border border-gray-100 text-gray-500">
              You haven't posted any ads yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.items.map((item: any) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow relative flex flex-col justify-between">
                  
                  {/* Item එකේ Availability එක වෙනස් කරන Button එක */}
                  {/* <button
                    onClick={async () => {
                      const res = await fetch(`/api/items/${item.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isAvailable: !item.isAvailable })
                      })
                      if (res.ok) {
                        alert('Status updated successfully!')
                        window.location.reload()
                      }
                    }}
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors border ${
                      item.isAvailable 
                        ? 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' 
                        : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
                    }`}
                  >
                    {item.isAvailable ? 'Mark as Rented (Not Available)' : 'Mark as Available'}
                  </button> */}

                  <Link href={`/items/${item.id}`} className="block">
                    <div className="h-36 bg-gray-100 rounded-lg overflow-hidden mb-3">
                      {item.imageUrls?.[0] && (
                        <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{item.title}</h3>
                    <p className="text-blue-900 font-bold text-sm mt-1">Rs. {item.pricePerDay?.toLocaleString()} / day</p>
                  </Link>

                  <div className="space-y-2 mt-3">


                    <button
                    onClick={async () => {
                      const res = await fetch(`/api/items/${item.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isAvailable: !item.isAvailable })
                      })
                      if (res.ok) {
                        alert('Status updated successfully!')
                        window.location.reload()
                      }
                    }}
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors border ${
                      item.isAvailable 
                        ? 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' 
                        : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
                    }`}
                  >
                    {item.isAvailable ? 'Mark as Rented (Not Available)' : 'Mark as Available'}
                  </button>
                    <Link
                      href={`/items/${item.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center justify-center gap-1.5 bg-blue-50 text-blue-900 hover:bg-blue-100 py-2 rounded-lg text-xs font-semibold transition-colors border border-blue-100"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Ad
                    </Link>

                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="w-full flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-xs font-semibold transition-colors border border-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Ad
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}