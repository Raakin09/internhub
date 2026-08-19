'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineUser } from 'react-icons/hi';
export default function DashboardOverview() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ applied: 0, hired: 0, rejected: 0, reviewed: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user && user._id) {
      const queryParam = user.role === 'employer' ? `employerId=${user._id}` : `userId=${user._id}`;
      fetch(`/api/applications?${queryParam}`)
        .then(res => res.json())
        .then(data => {
          const apps = data.applications || [];
          setRecentApplications(apps.slice(0, 5));
          setStats({
            applied: apps.length,
            reviewed: apps.filter(a => a.status === 'reviewed').length,
            hired: apps.filter(a => a.status === 'hired').length,
            rejected: apps.filter(a => a.status === 'rejected').length,
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  const statCards = [
    { label: t('dashboard.applications'), value: stats.applied, icon: HiOutlineDocumentText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Under Review', value: stats.reviewed, icon: HiOutlineClock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Hired', value: stats.hired, icon: HiOutlineCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Rejected', value: stats.rejected, icon: HiOutlineXCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];
  const statusColors = {
    applied: 'text-dark-300 bg-dark-700/50',
    reviewed: 'text-amber-400 bg-amber-400/10',
    shortlisted: 'text-blue-400 bg-blue-400/10',
    hired: 'text-emerald-400 bg-emerald-400/10',
    rejected: 'text-red-400 bg-red-400/10',
  };

  if (user?.role === 'employer') {
    return <EmployerDashboard user={user} stats={stats} recentApplications={recentApplications} statusColors={statusColors} t={t} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-dark-400">{t('dashboard.overview')}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-dark-50 mb-1">{stat.value}</p>
            <p className="text-xs text-dark-400 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-dark-100">{t('dashboard.applications')}</h2>
          <Link href="/dashboard/applications" className="text-sm text-primary-light hover:text-primary transition-colors">{t('common.viewDetails')}</Link>
        </div>
        {recentApplications.length > 0 ? (
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app._id} className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:bg-dark-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                    <HiOutlineBriefcase className="w-5 h-5 text-dark-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-100">{app.listing?.title || app.internshipId?.title || app.jobId?.title || 'Application'}</p>
                    <p className="text-xs text-dark-400">{app.listing?.company || app.internshipId?.company || app.jobId?.company || ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase mb-1 ${statusColors[app.status] || statusColors.applied}`}>
                    {app.status}
                  </span>
                  <p className="text-[10px] text-dark-500">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm text-dark-400">{t('common.noResults')}</p>
            <Link href="/internships" className="text-sm text-primary-light mt-2 inline-block">{t('home.browse')}</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function EmployerDashboard({ user, stats, recentApplications, statusColors, t }) {
  const [updating, setUpdating] = useState(null);

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const statCards = [
    { label: 'Total Received', value: stats.applied, icon: HiOutlineDocumentText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Under Review', value: stats.reviewed, icon: HiOutlineClock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Hired', value: stats.hired, icon: HiOutlineCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Rejected', value: stats.rejected, icon: HiOutlineXCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-dark-400">Manage applications for your postings</p>
        </div>
        <Link href="/dashboard/post" className="px-5 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
          + Post Opportunity
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-dark-50 mb-1">{stat.value}</p>
            <p className="text-xs text-dark-400 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-dark-100">Recent Applications Received</h2>
          <Link href="/dashboard/applications" className="text-sm text-primary-light hover:text-primary transition-colors">View All</Link>
        </div>
        {recentApplications.length > 0 ? (
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:bg-dark-800 transition-colors gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-lg font-bold text-primary-light">
                    {app.user?.name?.charAt(0) || <HiOutlineUser className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-100">{app.user?.name || 'Applicant'}</p>
                    <p className="text-xs text-dark-400">{app.user?.email || 'No email'} • {app.listing?.title || 'Listing'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                    disabled={updating === app._id}
                    className={`text-xs font-bold uppercase rounded-md px-2 py-1 outline-none cursor-pointer ${statusColors[app.status] || statusColors.applied}`}
                  >
                    <option value="applied" className="bg-dark-800 text-white">Applied</option>
                    <option value="reviewed" className="bg-dark-800 text-white">Reviewed</option>
                    <option value="shortlisted" className="bg-dark-800 text-white">Shortlisted</option>
                    <option value="hired" className="bg-dark-800 text-white">Hired</option>
                    <option value="rejected" className="bg-dark-800 text-white">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm text-dark-400">No applications received yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
