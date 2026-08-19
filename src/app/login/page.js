'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import OTPModal from '@/components/ui/OTPModal';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithOTP } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [mobileWarning, setMobileWarning] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMobileWarning('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else if (result.requiresOTP) {
      await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'login' }),
      });
      setShowOTPModal(true);
    } else if (result.restriction === 'mobile_time') {
      setMobileWarning(result.error);
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };
  const handleOTPVerified = async () => {
    setShowOTPModal(false);
    setLoading(true);
    const result = await loginWithOTP(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed after OTP verification');
    }
    setLoading(false);
  };
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-secondary/8 rounded-full blur-[128px]" />
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
              <h1 className="text-2xl font-bold text-dark-50 mb-1">{t('auth.loginTitle')}</h1>
              <p className="text-sm text-dark-400">{t('auth.loginSubtitle')}</p>
            </div>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">
                {error}
              </motion.div>
            )}
            {mobileWarning && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
                📱 {mobileWarning}
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors">
                    {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-dark-800 text-primary focus:ring-primary/50" />
                  <span className="text-xs text-dark-400">{t('auth.rememberMe')}</span>
                </label>
                <Link href="/forgot-password" className="text-xs text-primary-light hover:text-primary transition-colors font-medium">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {loading ? 'Signing in...' : t('auth.signIn')}
              </button>
            </form>
            <p className="text-center text-sm text-dark-400 mt-6">
              {t('auth.noAccount')}{' '}
              <Link href="/register" className="text-primary-light hover:text-primary font-medium transition-colors">
                {t('auth.signUp')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerified}
        email={email}
        purpose="login"
        title="Chrome Browser Verification"
      />
    </>
  );
}
