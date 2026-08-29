'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const sriLankaDistricts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
]

export default function PostAdPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
    
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    depositAmount: '',
    district: 'Colombo', // Default district
    subLocation: '',
    categoryId: '1',
    uuserId: '', 
  })

useEffect(() => {
  const storedUserId = localStorage.getItem('userId')
  if (!storedUserId) {
    alert('Please sign up or log in first!')
    router.push('/signup') // Signup page ekata yawanawa user login wela nattam
  } else {
    setFormData((prev) => ({ ...prev, userId: storedUserId }))
  }
}, [router])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      if (imageFiles.length + selectedFiles.length > 5) {
        alert('You can only upload a maximum of 5 images.')
        return
      }
      setImageFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Image upload to Supabase Storage (optional - urls array ekak hadaganna)
      const uploadedImageUrls: string[] = []
      
      for (const file of imageFiles) {
        const fileName = `${Date.now()}-${file.name}`
        const { data, error: uploadError } = await supabase.storage
          .from('item-images') // Supabase bucket name eka
          .upload(fileName, file)

        if (uploadError) {
          throw new Error('Image upload failed: ' + uploadError.message)
        }

        const { data: publicUrlData } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName)

        uploadedImageUrls.push(publicUrlData.publicUrl)
      }

      // 2. Item data object eka tayar kirima
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
      }

      // 3. API request eka yawima
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })

      const result = await response.json()

      if (result.success) {
        alert('Ad posted successfully!')
        router.push('/')
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err: any) {
      console.error('Failed to post ad:', err)
      setError(err.message || 'Failed to post ad.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Post Your Item for Rent</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Item Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Sony DSLR Camera"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-900"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your item..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Price Per Day (Rs.)</label>
            <input
              type="number"
              name="pricePerDay"
              required
              value={formData.pricePerDay}
              onChange={handleChange}
              placeholder="2500"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Refundable Deposit (Rs.)</label>
            <input
              type="number"
              name="depositAmount"
              value={formData.depositAmount}
              onChange={handleChange}
              placeholder="10000"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">District</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-900"
            >
              {sriLankaDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Area / Sub-location</label>
            <input
              type="text"
              name="subLocation"
              required
              value={formData.subLocation}
              onChange={handleChange}
              placeholder="e.g. Balangoda"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload Images (Maximum 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          />
          <span className="text-sm text-gray-500">Selected: {imageFiles.length} / 5</span>

          {imageFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-500 hover:text-red-700 font-bold px-2 py-1 text-sm bg-red-50 rounded"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-900"
          >
            <option value="1">Electronics & Cameras</option>
            <option value="2">Travel & Camping</option>
            <option value="3">Tools & Equipment</option>
            <option value="4">Vehicles & Bikes</option>
            <option value="5">Party & Events</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white font-medium py-3 rounded-lg hover:bg-blue-800 transition-colors shadow-sm disabled:bg-gray-400"
        >
          {loading ? 'Uploading & Posting...' : 'Post Ad'}
        </button>
      </form>
    </div>
  )
}