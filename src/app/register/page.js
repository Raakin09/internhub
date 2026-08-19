'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser, HiOutlinePhone, HiOutlineBriefcase, HiOutlineAcademicCap } from 'react-icons/hi';
export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-secondary/8 rounded-full blur-[128px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-2xl font-bold text-dark-50">Intern<span className="gradient-text">Hub</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-dark-50 mb-1">{t('auth.registerTitle')}</h1>
            <p className="text-sm text-dark-400">{t('auth.registerSubtitle')}</p>
          </div>
          <div className="flex gap-3 mb-6">
            {[
              { value: 'student', label: 'Student', icon: HiOutlineAcademicCap },
              { value: 'employer', label: 'Employer', icon: HiOutlineBriefcase },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setFormData({ ...formData, role: r.value })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border ${
                  formData.role === r.value
                    ? 'bg-primary/10 border-primary/30 text-primary-light'
                    : 'bg-dark-800 border-white/5 text-dark-400 hover:border-white/10'
                }`}
              >
                <r.icon className="w-4 h-4" />
                {r.label}
              </button>
            ))}
          </div>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">
              {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="Name" className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full pl-11 pr-11 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                  {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20">
              {loading ? 'Creating Account...' : t('auth.signUp')}
            </button>
          </form>
          <p className="text-center text-sm text-dark-400 mt-6">
            {t('auth.hasAccount')}{' '}
            <Link href="/login" className="text-primary-light hover:text-primary font-medium transition-colors">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
