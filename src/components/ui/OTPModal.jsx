'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineShieldCheck } from 'react-icons/hi';
export default function OTPModal({ isOpen, onClose, onVerify, email, purpose, title }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); 
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  useEffect(() => {
    if (!isOpen) return;
    setOtp(['', '', '', '', '', '']);
    setError('');
    setCountdown(300);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, countdown]);
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };
  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString, purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid OTP');
        setLoading(false);
        return;
      }
      onVerify?.(otpString);
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    setResending(true);
    try {
      await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }),
      });
      setCountdown(300);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-white/5 transition-all"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <HiOutlineShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-dark-50 text-center mb-1">
              {title || 'OTP Verification'}
            </h2>
            <p className="text-sm text-dark-400 text-center mb-8">
              Enter the 6-digit code sent to{' '}
              <span className="text-primary-light font-medium">
                {email?.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
              </span>
            </p>
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 rounded-xl bg-dark-800 border text-center text-xl font-bold text-dark-50 focus:outline-none transition-all duration-200 ${
                    error
                      ? 'border-danger/50 focus:border-danger'
                      : digit
                      ? 'border-primary/50 focus:border-primary'
                      : 'border-white/10 focus:border-primary/50'
                  }`}
                />
              ))}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger text-center mb-4"
              >
                {error}
              </motion.p>
            )}
            <p className="text-sm text-dark-400 text-center mb-6">
              {countdown > 0 ? (
                <>Code expires in <span className="text-accent font-medium">{formatTime(countdown)}</span></>
              ) : (
                <span className="text-danger">OTP expired</span>
              )}
            </p>
            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
            <div className="text-center mt-4">
              <button
                onClick={handleResend}
                disabled={resending || countdown > 240}
                className="text-sm text-dark-400 hover:text-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? 'Resending...' : "Didn't receive the code? Resend"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
