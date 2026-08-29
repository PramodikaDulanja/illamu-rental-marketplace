'use client'

import { useEffect, useState } from 'react'
import { Trash2, Package, Users, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loadingCheck, setLoadingCheck] = useState(true)
  const router = useRouter()

  const [items, setItems] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'items' | 'users'>('items')

  useEffect(() => {
    // LocalStorage එකෙන් admin status එක පරීක්ෂා කිරීම
    const adminStatus = localStorage.getItem('isAdmin') === 'true'

    if (!adminStatus) {
      alert('Access Denied! You are not authorized to view this page.')
      router.push('/')
    } else {
      setIsAdmin(true)
      fetchData()
    }
    setLoadingCheck(false)
  }, [router])

  const fetchData = async () => {
    try {
      const itemsRes = await fetch('/api/items')
      const itemsData = await itemsRes.json()
      if (itemsData.success) {
        setItems(itemsData.data)
        const uniqueUsers = Array.from(
          new Map(itemsData.data.map((item: any) => [item.user?.id, item.user])).values()
        ).filter(Boolean)
        setUsers(uniqueUsers)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return
    const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      setItems(items.filter((item) => item.id !== itemId))
      alert('Ad deleted successfully!')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? All their ads will be removed.')) return
    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      setUsers(users.filter((user) => user.id !== userId))
      setItems(items.filter((item) => item.userId !== userId))
      alert('User deleted successfully!')
    }
  }

  if (loadingCheck) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Checking Admin Permissions...</div>
  }

  if (!isAdmin) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="text-blue-900" /> Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Manage all items and users of Illamu.lk securely</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-blue-900 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
            &larr; Back to Home
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'items' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            <Package className="w-4 h-4" /> All Ads ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'users' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            <Users className="w-4 h-4" /> Users ({users.length})
          </button>
        </div>

        {/* Tab Content: Items Management */}
        {activeTab === 'items' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">All Posted Ads</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <p className="p-6 text-center text-gray-500">No ads available.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        {item.imageUrls?.[0] ? (
                          <img src={item.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-gray-400">No img</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-blue-900 font-bold text-xs mt-0.5">Rs. {item.pricePerDay?.toLocaleString()} / day</p>
                        <p className="text-xs text-gray-500 mt-1">Owner: <span className="font-medium text-gray-700">{item.user?.name || 'Unknown'}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border border-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Users Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Registered Users</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <p className="p-6 text-center text-gray-500">No users found.</p>
              ) : (
                users.map((usr: any, index) => (
                  <div key={usr.id || index} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-900 font-bold rounded-full flex items-center justify-center text-sm">
                        {usr.name ? usr.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{usr.name || 'User'}</h3>
                        <p className="text-xs text-gray-500">{usr.email || usr.phoneNumber || 'No contact info'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDeleteUser(usr.id)}
                        className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border border-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete User
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}