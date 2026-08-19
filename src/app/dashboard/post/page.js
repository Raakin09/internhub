'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineBriefcase, HiOutlineOfficeBuilding, HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineCalendar, HiOutlineCollection } from 'react-icons/hi';
import { INTERNSHIP_CATEGORIES } from '@/lib/utils';

export default function PostOpportunity() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('internship');
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.name || '',
    category: INTERNSHIP_CATEGORIES[0],
    description: '',
    location: '',
    workType: 'remote', 
    deadline: '',
    stipendMin: 0,
    stipendMax: 0,
    stipendType: 'monthly',
    duration: '3 months',
    salaryMin: 0,
    salaryMax: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = type === 'internship' ? '/api/internships' : '/api/jobs';
      const payload = { ...formData, userId: user._id };
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(`${type === 'internship' ? 'Internship' : 'Job'} posted successfully!`);
        router.push('/dashboard');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to post opportunity');
      }
    } catch (err) {
      alert('An error occurred while posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Post New Opportunity</h1>
        <p className="text-sm text-dark-400">Fill in the details below to reach thousands of top students.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setType('internship')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${type === 'internship' ? 'gradient-primary text-white shadow-lg shadow-primary/20' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'}`}
        >
          Post Internship
        </button>
        <button
          type="button"
          onClick={() => setType('job')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${type === 'job' ? 'gradient-primary text-white shadow-lg shadow-primary/20' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'}`}
        >
          Post Job
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-dark-300">Title</label>
            <div className="relative">
              <HiOutlineBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
              <input name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Frontend Developer" className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 placeholder:text-dark-500 focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-dark-300">Company Name</label>
            <div className="relative">
              <HiOutlineOfficeBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
              <input name="company" required value={formData.company} onChange={handleChange} placeholder="Company Name" className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 placeholder:text-dark-500 focus:outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-dark-300">Category</label>
            <div className="relative">
              <HiOutlineCollection className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
              <select name="category" value={formData.category} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 focus:outline-none focus:border-primary/50 appearance-none">
                {INTERNSHIP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-dark-300">Work Type</label>
            <select name="workType" value={formData.workType} onChange={handleChange} className="w-full px-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 focus:outline-none focus:border-primary/50">
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="office">In-Office</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-dark-300">Location (City, Country)</label>
            <div className="relative">
              <HiOutlineLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
              <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. New Delhi, India" className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 placeholder:text-dark-500 focus:outline-none focus:border-primary/50" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-dark-300">Application Deadline</label>
            <div className="relative">
              <HiOutlineCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
              <input type="date" name="deadline" required value={formData.deadline} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 focus:outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>

        {type === 'internship' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Min Stipend (₹)</label>
              <div className="relative">
                <HiOutlineCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                <input type="number" name="stipendMin" value={formData.stipendMin} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 focus:outline-none focus:border-primary/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Max Stipend (₹)</label>
              <div className="relative">
                <HiOutlineCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                <input type="number" name="stipendMax" value={formData.stipendMax} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 focus:outline-none focus:border-primary/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Duration</label>
              <input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 3 months" className="w-full px-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 focus:outline-none focus:border-primary/50" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Min Salary (LPA)</label>
              <div className="relative">
                <HiOutlineCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 focus:outline-none focus:border-primary/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Max Salary (LPA)</label>
              <div className="relative">
                <HiOutlineCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 focus:outline-none focus:border-primary/50" />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-dark-300">Description / Requirements</label>
          <textarea name="description" required rows="5" value={formData.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and requirements..." className="w-full px-4 py-3 bg-dark-800 border border-white/5 rounded-xl text-dark-50 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 resize-none"></textarea>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-white gradient-primary hover:opacity-90 shadow-lg shadow-primary/30 transition-all disabled:opacity-50">
            {loading ? 'Posting...' : `Post ${type === 'internship' ? 'Internship' : 'Job'}`}
          </button>
        </div>
      </form>
    </div>
  );
}
