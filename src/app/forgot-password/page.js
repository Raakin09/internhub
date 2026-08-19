'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { HiOutlineMail, HiOutlinePhone, HiOutlineShieldCheck, HiOutlineExclamation } from 'react-icons/hi';
export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setWarning('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setWarning(data.error);
      } else if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess(data.message);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[128px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/30">
              <HiOutlineShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-dark-50 mb-1">{t('auth.forgotPassword')}</h1>
            <p className="text-sm text-dark-400">
              Enter your registered email or phone number. We&apos;ll generate a new password for you.
            </p>
          </div>
          {warning && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <HiOutlineExclamation className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-400">Daily Limit Reached</p>
                  <p className="text-xs text-amber-400/70 mt-1">{warning}</p>
                </div>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <HiOutlineShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-400">New Password Sent!</p>
                  <p className="text-xs text-emerald-400/70 mt-1">{success}</p>
                  <p className="text-xs text-dark-400 mt-2">
                    Note: The generated password contains only letters (uppercase & lowercase). No numbers or special characters.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">
                Email or Phone Number
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                  placeholder="your@email.com or +91 9876543210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? 'Generating New Password...' : 'Reset Password'}
            </button>
          </form>
          <div className="mt-6 p-4 rounded-xl bg-dark-800/50 border border-white/5">
            <h4 className="text-xs font-semibold text-dark-200 mb-2">How it works:</h4>
            <ul className="space-y-1.5 text-xs text-dark-400">
              <li className="flex items-start gap-2">
                <span className="text-primary-light">1.</span> Enter your email or phone number
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light">2.</span> We generate a new random password (letters only)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light">3.</span> Check your email for the new password
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">⚠</span> You can only reset once per day
              </li>
            </ul>
          </div>
          <p className="text-center text-sm text-dark-400 mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-primary-light hover:text-primary font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
