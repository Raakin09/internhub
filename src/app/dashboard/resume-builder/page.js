'use client';
import { useState } from 'react';
import Script from 'next/script';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi';
import OTPModal from '@/components/ui/OTPModal';
export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    skills: '',
    experience: '',
    education: '',
  });
  const handlePayAndGenerate = async () => {
    if (!user) { window.location.href = '/login'; return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, purpose: 'resume' }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send OTP');
        setLoading(false);
        return;
      }
      setShowOTP(true);
    } catch {
      setError('Failed to send OTP for verification');
    } finally {
      setLoading(false);
    }
  };
  const onOTPVerified = async () => {
    setShowOTP(false);
    setLoading(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, plan: 'resume', paymentType: 'resume' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create payment order');
        setLoading(false);
        return;
      }
      if (typeof window.Razorpay === 'undefined') {
        setError('Payment system is loading. Please try again in a moment.');
        setLoading(false);
        return;
      }
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'InternHub Premium Resume',
        description: data.description,
        order_id: data.orderId,
        handler: async function () {
          setSuccess('Payment successful! Your premium resume has been generated and attached to your profile.');
          setLoading(false);
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#6366f1' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment failed');
        setLoading(false);
      });
      rzp.open();
    } catch {
      setError('Failed to process payment');
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div>
        <h1 className="text-2xl font-bold text-dark-50">{t('dashboard.resumeBuilder')}</h1>
        <p className="text-sm text-dark-400">Create an ATS-friendly premium resume for just ₹50.</p>
      </div>
      {error && <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">{error}</div>}
      {success && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">{success}</div>}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Full Name</label>
                <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Phone Number</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Skills (comma separated)</label>
              <textarea value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} rows="2" className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Experience</label>
              <textarea value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} rows="3" className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Education</label>
              <textarea value={form.education} onChange={e => setForm({...form, education: e.target.value})} rows="3" className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 resize-none"></textarea>
            </div>
          </form>
        </div>
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg mb-4">
              <HiOutlineSparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-dark-50 mb-2">Premium Resume</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-dark-300"><HiOutlineShieldCheck className="w-5 h-5 text-primary flex-shrink-0" /> ATS-Friendly Design</li>
              <li className="flex items-start gap-2 text-sm text-dark-300"><HiOutlineShieldCheck className="w-5 h-5 text-primary flex-shrink-0" /> Auto-attached to applications</li>
              <li className="flex items-start gap-2 text-sm text-dark-300"><HiOutlineShieldCheck className="w-5 h-5 text-primary flex-shrink-0" /> One-time fee of ₹50</li>
            </ul>
            <button
              onClick={handlePayAndGenerate}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? t('common.loading') : 'Pay ₹50 & Generate'}
            </button>
            <p className="text-xs text-dark-500 text-center mt-3">OTP Verification Required</p>
          </div>
        </div>
      </div>
      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerify={onOTPVerified}
        email={user?.email}
        purpose="resume"
        title="Resume Verification"
      />
    </div>
  );
}
