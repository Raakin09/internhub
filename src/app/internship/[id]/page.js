'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyRupee,
  HiOutlineOfficeBuilding, HiOutlineCalendar, HiOutlineUserGroup,
  HiOutlineArrowLeft, HiOutlineExternalLink, HiOutlineCheckCircle,
} from 'react-icons/hi';
export default function InternshipDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(`/api/internships/${id}`)
      .then(res => res.json())
      .then(data => {
        setInternship(data.internship || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);
  const handleApply = async () => {
    if (!user) { window.location.href = '/login'; return; }
    setApplying(true);
    setError('');
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, internshipId: id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); }
      else { setApplied(true); }
    } catch { setError('Failed to apply'); }
    finally { setApplying(false); }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!internship) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🔍</p>
        <p className="text-lg font-medium text-dark-200">Internship not found</p>
        <Link href="/internships" className="text-sm text-primary-light hover:text-primary">{t('common.back')}</Link>
      </div>
    );
  }
  const workTypeColors = {
    remote: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    hybrid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    office: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <div className="min-h-screen pb-12">
      <div className="bg-dark-950/50 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/internships" className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-dark-200 transition-colors mb-6">
            <HiOutlineArrowLeft className="w-4 h-4" /> {t('common.back')} to Internships
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {internship.isFeatured && (
                  <span className="px-2.5 py-1 rounded-lg gradient-primary text-[10px] font-bold text-white uppercase">Featured</span>
                )}
                {internship.isPPO && (
                  <span className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-bold uppercase border border-accent/20">PPO</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-dark-50 mb-2">{internship.title}</h1>
              <p className="text-dark-400 flex items-center gap-2">
                <HiOutlineOfficeBuilding className="w-4 h-4" /> {internship.company}
              </p>
            </div>
            <div>
              {applied ? (
                <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-semibold border border-emerald-500/20">
                  <HiOutlineCheckCircle className="w-5 h-5" /> Applied!
                </div>
              ) : (
                <button onClick={handleApply} disabled={applying} className="px-8 py-3 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                  {applying ? 'Applying...' : t('common.apply')}
                </button>
              )}
            </div>
          </div>
          {error && <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">{error}</div>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-dark-500 mb-1"><HiOutlineLocationMarker className="w-4 h-4" /> Location</div>
              <p className="text-sm font-semibold text-dark-100">{internship.location}</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-dark-500 mb-1"><HiOutlineCurrencyRupee className="w-4 h-4" /> Stipend</div>
              <p className="text-sm font-semibold text-dark-100">
                {internship.stipendMin && internship.stipendMax ? `₹${internship.stipendMin?.toLocaleString()} - ₹${internship.stipendMax?.toLocaleString()}/mo` : 'Unpaid'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-dark-500 mb-1"><HiOutlineClock className="w-4 h-4" /> Duration</div>
              <p className="text-sm font-semibold text-dark-100">{internship.duration || 'Not specified'}</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-dark-500 mb-1"><HiOutlineUserGroup className="w-4 h-4" /> Applicants</div>
              <p className="text-sm font-semibold text-dark-100">{internship.applicantCount || 0}</p>
            </div>
          </div>
          {internship.workType && (
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${workTypeColors[internship.workType] || ''}`}>
                {internship.workType?.charAt(0).toUpperCase() + internship.workType?.slice(1)}
              </span>
            </div>
          )}
          {internship.skills?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-dark-200 mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg bg-dark-700/50 text-dark-300 text-xs font-medium border border-white/5">{skill}</span>
                ))}
              </div>
            </div>
          )}
          {internship.description && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-dark-200 mb-3">About the Internship</h3>
              <p className="text-sm text-dark-400 leading-relaxed whitespace-pre-wrap">{internship.description}</p>
            </div>
          )}
          {internship.requirements && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-dark-200 mb-3">Requirements</h3>
              <p className="text-sm text-dark-400 leading-relaxed whitespace-pre-wrap">{internship.requirements}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
