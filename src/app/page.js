'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  HiOutlineSearch, HiOutlineArrowRight, HiOutlineBriefcase,
  HiOutlineAcademicCap, HiOutlineCode, HiOutlinePencilAlt,
  HiOutlineChartBar, HiOutlineDesktopComputer, HiOutlineGlobe,
  HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineStar,
  HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineTrendingUp,
  HiOutlineClock, HiOutlineLocationMarker, HiOutlineCurrencyRupee,
} from 'react-icons/hi';
const categories = [
  { name: 'Web Development', icon: HiOutlineCode, color: 'from-blue-500 to-cyan-400' },
  { name: 'Data Science', icon: HiOutlineChartBar, color: 'from-purple-500 to-pink-400' },
  { name: 'Design', icon: HiOutlinePencilAlt, color: 'from-amber-500 to-orange-400' },
  { name: 'Marketing', icon: HiOutlineTrendingUp, color: 'from-green-500 to-emerald-400' },
  { name: 'Content Writing', icon: HiOutlineAcademicCap, color: 'from-indigo-500 to-violet-400' },
  { name: 'App Development', icon: HiOutlineDesktopComputer, color: 'from-rose-500 to-red-400' },
];
const stats = [
  { value: 10000, suffix: '+', labelKey: 'home.stats.internships', icon: HiOutlineBriefcase },
  { value: 5000, suffix: '+', labelKey: 'home.stats.companies', icon: HiOutlineOfficeBuilding },
  { value: 200000, suffix: '+', labelKey: 'home.stats.students', icon: HiOutlineUserGroup },
  { value: 50000, suffix: '+', labelKey: 'home.stats.placements', icon: HiOutlineStar },
];
function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <span>
      {count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count}
      {suffix}
    </span>
  );
}
const workTypeColors = {
  remote: 'bg-emerald-500/10 text-emerald-400',
  hybrid: 'bg-amber-500/10 text-amber-400',
  office: 'bg-blue-500/10 text-blue-400',
};
export default function HomePage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredInternships, setFeaturedInternships] = useState([]);
  useEffect(() => {
    fetch('/api/internships?featured=true&limit=6')
      .then(res => res.json())
      .then(data => setFeaturedInternships(data.internships || []))
      .catch(() => {});
  }, []);
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pb-20 pt-12 lg:pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[128px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary-light">
                🚀 {t('home.stats.internships')}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-display mb-6"
            >
              {t('home.title').split(' ').map((word, i) => (
                <span
                  key={i}
                  className={
                    ['Dream', 'Internship', 'Soñada', 'Práctica', 'सपनों', 'इंटर्नशिप', 'Sonhos', 'Estágio', '梦想', '实习', 'Rêve', 'Stage'].includes(word)
                      ? 'gradient-text'
                      : 'text-dark-50'
                  }
                >
                  {word}{' '}
                </span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-dark-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t('home.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 gradient-primary rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity duration-300" />
                <div className="relative flex items-center bg-dark-800 rounded-2xl border border-white/5">
                  <HiOutlineSearch className="w-5 h-5 text-dark-400 ml-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('home.searchPlaceholder')}
                    className="flex-1 px-4 py-4 bg-transparent text-dark-100 placeholder:text-dark-500 text-sm focus:outline-none"
                  />
                  <Link
                    href={`/internships${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
                    className="mr-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    {t('common.search')}
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Remote', 'Web Dev', 'Data Science', 'Design', 'Marketing'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/internships?search=${tag}`}
                    className="px-3 py-1 rounded-lg text-xs text-dark-400 bg-dark-800/50 border border-white/5 hover:border-primary/20 hover:text-primary-light transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/internships"
                className="group px-8 py-3.5 rounded-2xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center gap-2"
              >
                <HiOutlineBriefcase className="w-4 h-4" />
                {t('home.browse')}
                <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/jobs"
                className="px-8 py-3.5 rounded-2xl text-sm font-semibold text-dark-200 border border-white/10 hover:border-primary/30 hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <HiOutlineAcademicCap className="w-4 h-4" />
                {t('home.browseJobs')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl gradient-primary mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/20">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-dark-50 mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-dark-400">{t(stat.labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-heading mb-3">{t('home.categories')}</h2>
            <p className="text-dark-400 max-w-lg mx-auto">
              {t('home.subtitle')}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/internships?category=${encodeURIComponent(cat.name)}`}
                  className="block glass-card rounded-2xl p-5 text-center group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} mx-auto mb-3 flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xs font-semibold text-dark-200 mb-1 group-hover:text-primary-light transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {featuredInternships.length > 0 && (
        <section className="py-20 bg-dark-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <h2 className="text-heading mb-2">{t('home.featured')}</h2>
                <p className="text-dark-400">{t('home.subtitle')}</p>
              </div>
              <Link
                href="/internships"
                className="hidden sm:flex items-center gap-2 text-sm text-primary-light hover:text-primary font-medium transition-colors"
              >
                {t('common.viewDetails')} <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredInternships.map((internship, i) => (
                <motion.div
                  key={internship._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/internship/${internship._id}`} className="block">
                    <div className="glass-card rounded-2xl p-5 h-full group">
                      {internship.isPPO && (
                        <span className="inline-block mb-3 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-bold uppercase border border-accent/20">
                          {t('common.ppo')}
                        </span>
                      )}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center text-lg">
                          <HiOutlineOfficeBuilding className="w-5 h-5 text-dark-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-dark-100 group-hover:text-primary-light transition-colors">
                            {internship.title}
                          </h3>
                          <p className="text-xs text-dark-400">{internship.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-dark-400 mb-3">
                        <span className="flex items-center gap-1">
                          <HiOutlineLocationMarker className="w-3.5 h-3.5" /> {internship.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiOutlineClock className="w-3.5 h-3.5" /> {internship.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-dark-100">
                          {internship.stipendMin && internship.stipendMax
                            ? `₹${internship.stipendMin.toLocaleString()} - ₹${internship.stipendMax.toLocaleString()}${t('common.perMonth')}`
                            : 'Unpaid'}
                        </span>
                        {internship.workType && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${workTypeColors[internship.workType]}`}>
                            {t(`common.${internship.workType}`)}
                          </span>
                        )}
                      </div>
                      {internship.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {internship.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-2 py-0.5 rounded-md bg-dark-700/50 text-dark-300 text-[10px] font-medium border border-white/5">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/internships" className="text-sm text-primary-light font-medium">
                {t('home.browse')} →
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-heading mb-3">Why Choose InternHub?</h2>
            <p className="text-dark-400 max-w-lg mx-auto">
              Built for students, by students. Everything you need to launch your career.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: HiOutlineLightningBolt, title: 'Instant Applications', desc: 'Apply to internships with one click. No lengthy forms.', color: 'from-amber-500 to-orange-400' },
              { icon: HiOutlineShieldCheck, title: 'Verified Companies', desc: 'All companies are verified. No scams, no fake listings.', color: 'from-emerald-500 to-green-400' },
              { icon: HiOutlineStar, title: 'Premium Resume Builder', desc: 'Build professional resumes that stand out. AI-powered.', color: 'from-purple-500 to-pink-400' },
              { icon: HiOutlineGlobe, title: 'Multi-Language Support', desc: 'Browse in English, Hindi, Spanish, French, and more.', color: 'from-blue-500 to-cyan-400' },
              { icon: HiOutlineUserGroup, title: 'Community Space', desc: 'Connect with peers, share experiences, build your network.', color: 'from-rose-500 to-red-400' },
              { icon: HiOutlineTrendingUp, title: 'Career Tracking', desc: 'Track your applications from applied to hired. Real-time.', color: 'from-indigo-500 to-violet-400' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-dark-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 gradient-bg-animated opacity-10" />
            <div className="absolute inset-0 bg-dark-800/60 backdrop-blur-sm" />
            <div className="relative p-12 lg:p-16 text-center">
              <h2 className="text-heading mb-4">
                Ready to Start Your <span className="gradient-text">Career Journey</span>?
              </h2>
              <p className="text-dark-400 text-lg max-w-lg mx-auto mb-8">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="group px-8 py-3.5 rounded-2xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 flex items-center gap-2"
                >
                  {t('auth.signUp')}
                  <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/internships"
                  className="px-8 py-3.5 rounded-2xl text-sm font-semibold text-dark-200 border border-white/10 hover:border-primary/30 hover:bg-white/5 transition-all"
                >
                  {t('home.browse')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
