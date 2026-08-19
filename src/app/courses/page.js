'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  HiOutlineAcademicCap, HiOutlineCode, HiOutlineChartBar,
  HiOutlineDesktopComputer, HiOutlinePencilAlt, HiOutlineTrendingUp,
  HiOutlineClock, HiOutlineStar, HiOutlinePlay,
} from 'react-icons/hi';
const courseCategories = [
  { name: 'Web Development', icon: HiOutlineCode, color: 'from-blue-500 to-cyan-400', description: 'HTML, CSS, JavaScript, React, Node.js' },
  { name: 'Data Science', icon: HiOutlineChartBar, color: 'from-purple-500 to-pink-400', description: 'Python, ML, Statistics, Pandas' },
  { name: 'App Development', icon: HiOutlineDesktopComputer, color: 'from-amber-500 to-orange-400', description: 'React Native, Flutter, Swift' },
  { name: 'Digital Marketing', icon: HiOutlineTrendingUp, color: 'from-green-500 to-emerald-400', description: 'SEO, SEM, Social Media, Analytics' },
  { name: 'UI/UX Design', icon: HiOutlinePencilAlt, color: 'from-rose-500 to-red-400', description: 'Figma, User Research, Prototyping' },
  { name: 'Machine Learning', icon: HiOutlineAcademicCap, color: 'from-indigo-500 to-violet-400', description: 'Neural Networks, NLP, Computer Vision' },
];
export default function CoursesPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen pb-12">
      <div className="bg-dark-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <HiOutlineAcademicCap className="w-4 h-4 text-primary-light" />
              <span className="text-xs font-medium text-primary-light">Learn & Grow</span>
            </div>
            <h1 className="text-heading mb-3">{t('nav.courses')}</h1>
            <p className="text-dark-400 max-w-2xl">
              Upskill yourself with industry-relevant courses. Build projects, earn certificates, and boost your internship applications.
            </p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-6 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} mb-5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                <cat.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-base font-bold text-dark-100 mb-2 group-hover:text-primary-light transition-colors">{cat.name}</h3>
              <p className="text-sm text-dark-400 mb-4 leading-relaxed">{cat.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs text-dark-500 flex items-center gap-1">
                  <HiOutlineStar className="w-3.5 h-3.5 text-accent" /> Coming Soon
                </span>
                <span className="text-xs text-primary-light font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Notify Me <HiOutlinePlay className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center glass rounded-3xl p-12"
        >
          <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/30">
            <HiOutlineAcademicCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-dark-50 mb-3">Courses are launching soon!</h2>
          <p className="text-dark-400 max-w-lg mx-auto mb-8">
            We're building industry-grade courses with real projects and mentorship. Stay tuned for the launch.
          </p>
          <Link
            href="/internships"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Browse Internships Instead
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
