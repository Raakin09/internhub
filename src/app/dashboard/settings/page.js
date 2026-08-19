'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { HiOutlineGlobe, HiOutlineMoon, HiOutlineBell } from 'react-icons/hi';
import OTPModal from '@/components/ui/OTPModal';
export default function SettingsPage() {
  const { language, supportedLanguages, setLanguage, confirmLanguageChange, cancelLanguageChange, otpRequired } = useLanguage();
  const [notifications, setNotifications] = useState({ email: true, browser: false, marketing: true });
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Settings</h1>
        <p className="text-sm text-dark-400">Manage your preferences and language settings.</p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-8">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-dark-100 mb-4 border-b border-white/5 pb-2">
            <HiOutlineGlobe className="w-5 h-5 text-primary-light" /> Language Preferences
          </h2>
          <p className="text-xs text-dark-400 mb-4">Select your preferred language for the interface. French requires OTP verification.</p>
          <div className="max-w-xs">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 focus:outline-none focus:border-primary/50"
            >
              {supportedLanguages.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-dark-100 mb-4 border-b border-white/5 pb-2">
            <HiOutlineBell className="w-5 h-5 text-primary-light" /> Notifications
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-dark-100">Email Notifications</p>
                <p className="text-xs text-dark-400">Receive application updates via email</p>
              </div>
              <input type="checkbox" checked={notifications.email} onChange={e=>setNotifications({...notifications, email: e.target.checked})} className="w-4 h-4 rounded border-white/10 bg-dark-800 text-primary focus:ring-primary/50" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-dark-100">Browser Notifications</p>
                <p className="text-xs text-dark-400">Get push notifications in browser</p>
              </div>
              <input type="checkbox" checked={notifications.browser} onChange={e=>setNotifications({...notifications, browser: e.target.checked})} className="w-4 h-4 rounded border-white/10 bg-dark-800 text-primary focus:ring-primary/50" />
            </label>
          </div>
        </div>
      </div>
      <OTPModal
        isOpen={otpRequired}
        onClose={cancelLanguageChange}
        onVerify={confirmLanguageChange}
        email="User"
        purpose="language"
        title="French Language Verification"
      />
    </div>
  );
}
