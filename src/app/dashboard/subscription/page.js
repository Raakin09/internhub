'use client';
import { useState } from 'react';
import Script from 'next/script';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { HiOutlineCreditCard, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';
import { SUBSCRIPTION_PLANS } from '@/lib/utils';
import OTPModal from '@/components/ui/OTPModal';
export default function SubscriptionPage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingPlan, setProcessingPlan] = useState(null);
  const handleSubscribe = async (planKey) => {
    setError('');
    setSuccess('');
    setLoading(true);
    setProcessingPlan(planKey);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, plan: planKey, paymentType: 'subscription' }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.restriction === 'payment_time') {
          setError(`Payment Time Restriction: ${data.error}`);
        } else {
          setError(data.error || 'Failed to create order');
        }
        setLoading(false);
        setProcessingPlan(null);
        return;
      }
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'InternHub',
        description: data.description,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/payments', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user._id,
                plan: planKey,
                paymentType: 'subscription',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setSuccess(verifyData.message);
              updateUser({ plan: planKey });
            } else {
              setError(verifyData.error || 'Payment verification failed');
            }
          } catch {
            setError('Payment verification failed');
          } finally {
            setLoading(false);
            setProcessingPlan(null);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: { color: '#6366f1' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description);
        setLoading(false);
        setProcessingPlan(null);
      });
      rzp.open();
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
      setProcessingPlan(null);
    }
  };
  const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({ key, ...plan }));
  return (
    <div className="space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Subscription Plans</h1>
        <p className="text-sm text-dark-400">Upgrade your plan to unlock more applications and features.</p>
      </div>
      <div className="p-4 rounded-2xl glass-strong border border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white">
            <HiOutlineCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-dark-400">Current Plan</p>
            <p className="text-sm font-bold text-dark-50 capitalize">{user?.plan || 'Free'} Plan</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-dark-400">Applications left this month</p>
          <p className="text-lg font-bold text-primary-light">
            {user?.plan === 'gold' ? 'Unlimited' : Math.max(0, (SUBSCRIPTION_PLANS[user?.plan || 'free']?.maxApplications || 0) - (user?.applicationsThisMonth || 0))}
          </p>
        </div>
      </div>
      {error && <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">{error}</div>}
      {success && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">{success}</div>}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
        <HiOutlineClock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-400">Payment Time Restriction</p>
          <p className="text-xs text-amber-400/80 mt-1">As per system constraints, subscription payments are only processed between 10:00 AM and 11:00 AM IST.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 pt-4">
        {plans.map((plan) => (
          <div key={plan.key} className={`relative p-6 rounded-3xl glass transition-all ${user?.plan === plan.key ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-white/5 hover:border-white/20'}`}>
            {user?.plan === plan.key && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-[10px] font-bold text-white uppercase shadow-lg">
                Current Plan
              </div>
            )}
            <h3 className="text-lg font-bold text-dark-50 mb-1">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">₹{plan.price}</span>
              <span className="text-xs text-dark-400">/{plan.duration}</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm text-dark-300">
                <HiOutlineCheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                {plan.maxApplications === Infinity ? 'Unlimited applications/month' : `${plan.maxApplications} applications/month`}
              </li>
              <li className="flex items-start gap-2 text-sm text-dark-300">
                <HiOutlineCheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                Priority support
              </li>
              {plan.key !== 'free' && (
                <li className="flex items-start gap-2 text-sm text-dark-300">
                  <HiOutlineCheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                  Highlighted profile
                </li>
              )}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.key)}
              disabled={loading || user?.plan === plan.key}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-lg ${
                user?.plan === plan.key
                  ? 'bg-dark-800 text-dark-400 cursor-not-allowed border border-white/5'
                  : 'gradient-primary text-white hover:opacity-90 shadow-primary/20'
              }`}
            >
              {loading && processingPlan === plan.key ? 'Processing...' : user?.plan === plan.key ? 'Current Plan' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
