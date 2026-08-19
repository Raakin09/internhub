'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineExternalLink } from 'react-icons/hi';
import Link from 'next/link';
const statusColors = {
  applied: 'text-dark-300 bg-dark-700 border-dark-600',
  reviewed: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  shortlisted: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  hired: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
};
const statusIcons = {
  applied: HiOutlineDocumentText,
  reviewed: HiOutlineClock,
  shortlisted: HiOutlineCheckCircle,
  hired: HiOutlineCheckCircle,
  rejected: HiOutlineXCircle,
};
export default function ApplicationsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user?._id) {
      fetch(`/api/applications?userId=${user._id}`)
        .then(res => res.json())
        .then(data => {
          setApplications(data.applications || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);
  const filteredApps = filter === 'all' ? applications : applications.filter(app => app.status === filter);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">{t('dashboard.applications')}</h1>
        <p className="text-sm text-dark-400">Track and manage your internship and job applications.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {['all', 'applied', 'reviewed', 'shortlisted', 'hired', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
              filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-dark-800 text-dark-400 hover:bg-white/5'
            }`}
          >
            {f === 'all' ? t('common.all') : f}
          </button>
        ))}
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredApps.map((app, i) => {
              const StatusIcon = statusIcons[app.status] || HiOutlineDocumentText;
              const listing = app.internshipId || app.jobId || {};
              const type = app.internshipId ? 'internship' : 'job';
              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🏢</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-dark-100">{listing.title || 'Application'}</h3>
                      <p className="text-sm text-dark-400">{listing.company || ''}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-dark-500">
                        {listing.location && <span>📍 {listing.location}</span>}
                        <span className="capitalize">💼 {type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase border ${statusColors[app.status] || statusColors.applied}`}>
                      <StatusIcon className="w-4 h-4" />
                      {app.status}
                    </div>
                    <p className="text-[10px] text-dark-500">Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-lg font-medium text-dark-200 mb-2">{t('common.noResults')}</p>
            <p className="text-sm text-dark-400">You haven't applied to any roles matching this status.</p>
            <Link href="/internships" className="text-sm text-primary-light mt-3 inline-block">{t('home.browse')}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
