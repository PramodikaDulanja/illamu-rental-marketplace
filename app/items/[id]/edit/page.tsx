'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Upload, ArrowLeft } from 'lucide-react'

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    depositAmount: '',
    district: '',
    subLocation: '',
    location: '',
    categoryId: '', 
    imageUrls: [] as string[],
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((res) => res.json()).catch(() => ({ success: false })),
      fetch('/api/items').then((res) => res.json())
    ])
      .then(([catData, itemData]) => {
        if (catData.success && catData.data) {
          setCategories(catData.data)
        }

        if (itemData.success && itemData.data) {
          const currentItem = itemData.data.find((item: any) => item.id === id)
          if (currentItem) {
            setFormData({
              title: currentItem.title || '',
              description: currentItem.description || '',
              pricePerDay: currentItem.pricePerDay || '',
              depositAmount: currentItem.depositAmount || '',
              district: currentItem.district || '',
              subLocation: currentItem.subLocation || '',
              location: currentItem.location || '',
              categoryId: currentItem.categoryId || '',
              imageUrls: currentItem.imageUrls || [],
            })
          }
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, reader.result as string]
          }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, index) => index !== indexToRemove)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        alert('Ad updated successfully!')
        router.push('/profile')
        router.refresh()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-20 text-center">Loading ad details...</div>

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Edit Your Ad</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-4">
        
        {/* Category Selection Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Local Files Upload Section */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Ad Images</label>
          
          <div className="flex items-center gap-2 mb-3">
            <label className="cursor-pointer bg-blue-50 text-blue-900 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Select Images from Computer
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative group h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          {formData.imageUrls.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Please add at least one image.</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Price Per Day (Rs.)</label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Deposit Amount (Rs.)</label>
            <input
              type="number"
              name="depositAmount"
              value={formData.depositAmount}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Sub Location</label>
            <input
              type="text"
              name="subLocation"
              value={formData.subLocation}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Location / Address</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Action Buttons: Update and Cancel */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || formData.imageUrls.length === 0}
            className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Ad'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="flex-1 bg-gray-100 text-gray-700 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
        </div>
      </form>
    </div>
  )
}