'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import InternshipCard from '@/components/internships/InternshipCard';
import { INTERNSHIP_CATEGORIES } from '@/lib/utils';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineX, HiOutlineAdjustments } from 'react-icons/hi';
import { useSearchParams } from 'next/navigation';
const workTypes = [
  { value: '', label: 'All Types' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'office', label: 'Office' },
];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'stipend_high', label: 'Highest Stipend' },
  { value: 'stipend_low', label: 'Lowest Stipend' },
  { value: 'deadline', label: 'Deadline' },
];
export default function InternshipsPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState(searchParams?.get('search') || '');
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const [workType, setWorkType] = useState('');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (workType) params.set('workType', workType);
    if (sort) params.set('sort', sort);
    fetch(`/api/internships?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setInternships(data.internships || []);
        setLoading(false);
      })
      .catch(() => {
        setInternships([]);
        setLoading(false);
      });
  }, [search, category, workType, sort]);
  return (
    <div className="min-h-screen pb-12">
      <div className="bg-dark-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-heading mb-2">{t('nav.internships')}</h1>
            <p className="text-dark-400">
              {loading ? t('common.loading') : `${internships.length} ${t('nav.internships').toLowerCase()} ${internships.length === 1 ? '' : ''}`}
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all ${
                showFilters ? 'bg-primary/10 border-primary/30 text-primary-light' : 'bg-dark-800 border-white/5 text-dark-300 hover:border-white/10'
              }`}
            >
              <HiOutlineAdjustments className="w-4 h-4" />
              {t('common.filter')}
            </button>
          </div>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-5 glass rounded-2xl"
            >
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 focus:outline-none focus:border-primary/50"
                  >
                    <option value="">{t('common.all')} Categories</option>
                    {INTERNSHIP_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-2">Work Type</label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 focus:outline-none focus:border-primary/50"
                  >
                    {workTypes.map((w) => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-2">{t('common.sort')}</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 focus:outline-none focus:border-primary/50"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {(category || workType) && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs text-dark-400">Active Filters:</span>
                  {category && (
                    <button onClick={() => setCategory('')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary-light text-xs font-medium">
                      {category} <HiOutlineX className="w-3 h-3" />
                    </button>
                  )}
                  {workType && (
                    <button onClick={() => setWorkType('')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary-light text-xs font-medium">
                      {workType} <HiOutlineX className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : internships.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {internships.map((internship, i) => (
              <InternshipCard key={internship._id} internship={internship} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-medium text-dark-200 mb-2">{t('common.noResults')}</p>
            <p className="text-sm text-dark-400">Try adjusting your search or filters, or post a new internship!</p>
          </div>
        )}
      </div>
    </div>
  );
}
