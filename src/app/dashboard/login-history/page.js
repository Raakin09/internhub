'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineDesktopComputer, HiOutlineDeviceMobile, HiOutlineGlobe, HiOutlineClock } from 'react-icons/hi';
export default function LoginHistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user?._id) {
      fetch(`/api/users/login-history?userId=${user._id}`)
        .then(res => res.json())
        .then(data => {
          setHistory(data.history || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);
  if (loading) return <div className="text-center p-8 text-dark-400">Loading history...</div>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Login History</h1>
        <p className="text-sm text-dark-400">Track your account access across devices and browsers.</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {history.length > 0 ? (
          <div className="divide-y divide-white/5">
            {history.map((log, i) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0 text-dark-300">
                    {log.deviceType === 'mobile' ? <HiOutlineDeviceMobile className="w-5 h-5" /> : <HiOutlineDesktopComputer className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-dark-100">{log.browser} on {log.os}</h3>
                      {!log.isSuccessful && <span className="px-2 py-0.5 rounded text-[10px] bg-danger/10 text-danger border border-danger/20 font-medium">Failed</span>}
                      {log.otpVerified && <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary-light border border-primary/20 font-medium">OTP Verified</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-dark-500">
                      <span className="flex items-center gap-1"><HiOutlineGlobe className="w-3.5 h-3.5" /> {log.ipAddress}</span>
                      <span className="flex items-center gap-1"><HiOutlineClock className="w-3.5 h-3.5" /> {new Date(log.loginAt).toLocaleString()}</span>
                    </div>
                    {!log.isSuccessful && log.failureReason && (
                      <p className="text-xs text-danger mt-1">Reason: {log.failureReason}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-dark-400">No login history found.</div>
        )}
      </div>
    </div>
  );
}
