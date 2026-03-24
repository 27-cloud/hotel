// app/_components/UpdateProfileForm.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { updateGuest, createGuest, getGuest } from '../_lib/data-service';

export default function UpdateProfileForm() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // 加载已有用户数据
  useEffect(() => {
    async function loadGuest() {
      if (!user?.email) return;
      
      const guest = await getGuest(user.email);
      if (guest) {
        setFullName(guest.fullName || '');
        setNationalID(guest.nationalID || '');
      } else if (user.user_metadata?.fullName) {
        setFullName(user.user_metadata.fullName);
      }
    }
    loadGuest();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const guestData = {
        email: user.email,
        fullName: fullName,
        nationalID: nationalID,
      };

      const existingGuest = await getGuest(user.email);
      
      if (existingGuest) {
        await updateGuest(existingGuest.id, guestData);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        await createGuest(guestData);
        setMessage({ type: 'success', text: 'Profile created successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-2">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block mb-2">Email address</label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm opacity-70"
        />
      </div>

      <div>
        <label className="block mb-2">National ID number</label>
        <input
          type="text"
          value={nationalID}
          onChange={(e) => setNationalID(e.target.value)}
          placeholder="Enter your national ID (optional)"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          disabled={isLoading}
        />
      </div>

      {message && (
        <div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-accent-500 text-primary-800 px-6 py-3 rounded-md hover:bg-accent-600 disabled:opacity-50"
      >
        {isLoading ? 'Updating...' : 'Update profile'}
      </button>
    </form>
  );
}