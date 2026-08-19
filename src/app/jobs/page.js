'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiOutlineClock, HiOutlineOfficeBuilding, HiOutlineAdjustments, HiOutlineX, HiOutlineUserGroup } from 'react-icons/hi';
const workTypeColors = { remote: 'bg-emerald-500/10 text-emerald-400', hybrid: 'bg-amber-500/10 text-amber-400', office: 'bg-blue-500/10 text-blue-400' };
export default function JobsPage() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [workType, setWorkType] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (workType) params.set('workType', workType);
    if (experience) params.set('experienceLevel', experience);
    fetch(`/api/jobs?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || []);
        setLoading(false);
      })
      .catch(() => {
        setJobs([]);
        setLoading(false);
      });
  }, [search, workType, experience]);
  const formatSalary = (min, max) => {
    const f = (v) => v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${(v / 1000).toFixed(0)}K`;
    if (!min && !max) return 'Not disclosed';
    return `₹${f(min)} - ₹${f(max)}/yr`;
  };
  return (
    <div className="min-h-screen pb-12">
      <div className="bg-dark-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-heading mb-2">{t('nav.jobs')}</h1>
            <p className="text-dark-400">
              {loading ? t('common.loading') : `${jobs.length} ${t('nav.jobs').toLowerCase()}`}
            </p>
          </motion.div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <select value={workType} onChange={(e) => setWorkType(e.target.value)} className="px-4 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 focus:outline-none focus:border-primary/50">
              <option value="">{t('common.all')} Types</option>
              <option value="remote">{t('common.remote')}</option>
              <option value="hybrid">{t('common.hybrid')}</option>
              <option value="office">{t('common.office')}</option>
            </select>
            <select value={experience} onChange={(e) => setExperience(e.target.value)} className="px-4 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 focus:outline-none focus:border-primary/50">
              <option value="">{t('common.all')} Experience</option>
              <option value="fresher">Fresher</option>
              <option value="junior">Junior (1-3 yrs)</option>
              <option value="mid">Mid (3-5 yrs)</option>
              <option value="senior">Senior (5+ yrs)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/job/${job._id}`} className="block">
                  <div className="glass-card rounded-2xl p-5 h-full group">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-dark-700 border border-white/5 flex items-center justify-center flex-shrink-0">
                        <HiOutlineOfficeBuilding className="w-5 h-5 text-dark-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-dark-100 truncate group-hover:text-primary-light transition-colors">{job.title}</h3>
                        <p className="text-xs text-dark-400 truncate">{job.company}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-4 text-xs text-dark-400">
                        <span className="flex items-center gap-1"><HiOutlineLocationMarker className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1"><HiOutlineCurrencyRupee className="w-3.5 h-3.5" /> {formatSalary(job.salaryMin, job.salaryMax)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {job.workType && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${workTypeColors[job.workType]}`}>
                            {job.workType.charAt(0).toUpperCase() + job.workType.slice(1)}
                          </span>
                        )}
                        {job.experienceLevel && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-dark-700 text-dark-300 capitalize">{job.experienceLevel}</span>
                        )}
                      </div>
                    </div>
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 rounded-md bg-dark-700/50 text-dark-300 text-[10px] font-medium border border-white/5">{skill}</span>
                        ))}
                        {job.skills.length > 3 && <span className="px-2 py-0.5 rounded-md bg-dark-700/50 text-dark-400 text-[10px]">+{job.skills.length - 3}</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[10px] text-dark-500 flex items-center gap-1"><HiOutlineUserGroup className="w-3 h-3" /> {job.applicantCount || 0} applicants</span>
                      <span className="text-[10px] text-primary-light font-medium opacity-0 group-hover:opacity-100 transition-opacity">{t('common.viewDetails')} →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-medium text-dark-200 mb-2">{t('common.noResults')}</p>
            <p className="text-sm text-dark-400">No jobs found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
