'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { useRouter } from 'next/navigation'
import TopBar from '../../components/TopBar'

export default function EditProfile() {
  const [username, setUsername] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [phone, setPhone] = useState('')
  const [career, setCareer] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) {
          setUsername(data.username || '')
          setProfileImageUrl(data.profile_image_url || '')
          setPhone(data.phone || '')
          setCareer(data.career || '')
        }
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username,
          profile_image_url: profileImageUrl,
          phone,
          career
        })
      if (error) {
        alert('Error updating profile')
      } else {
        alert('Profile updated successfully')
        router.push('/')
      }
    }
  }

  return (
    <>
      <TopBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="profileImageUrl" className="block text-gray-700 dark:text-gray-300 mb-2">Profile Image URL</label>
            <input
              type="url"
              id="profileImageUrl"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="career" className="block text-gray-700 dark:text-gray-300 mb-2">Career</label>
            <input
              type="text"
              id="career"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Update Profile
          </button>
        </form>
      </div>
    </>
  )
}