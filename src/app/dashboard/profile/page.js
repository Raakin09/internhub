'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineOfficeBuilding } from 'react-icons/hi';
export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess('Profile updated successfully!');
        updateUser(form);
      }
    } catch {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Profile</h1>
        <p className="text-sm text-dark-400">Manage your personal and professional information.</p>
      </div>
      <div className="glass rounded-2xl p-6">
        {error && <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-6 pb-6 border-b border-white/5">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/20">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <button type="button" className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-800 text-dark-200 border border-white/5 hover:bg-white/5 transition-colors">
                Change Avatar
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input value={user?.email || ''} disabled className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-white/5 text-sm text-dark-400 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Role</label>
              <input value={user?.role || 'student'} disabled className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-white/5 text-sm text-dark-400 capitalize cursor-not-allowed" />
            </div>
          </div>
          {user?.role === 'employer' && (
            <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-white/5">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Company Name</label>
                <div className="relative">
                  <HiOutlineOfficeBuilding className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input value={form.companyName} onChange={e=>setForm({...form, companyName: e.target.value})} className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Company Description</label>
                <textarea value={form.companyDescription} onChange={e=>setForm({...form, companyDescription: e.target.value})} rows="3" className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 resize-none"></textarea>
              </div>
            </div>
          )}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
