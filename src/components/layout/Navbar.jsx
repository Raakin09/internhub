'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineGlobeAlt,
  HiOutlineUserCircle, HiOutlineBell, HiOutlineMenu, HiOutlineX,
  HiOutlineChevronDown, HiOutlineLogout, HiOutlineCog,
  HiOutlineViewGrid, HiOutlineChat, HiOutlineCollection,
} from 'react-icons/hi';
import OTPModal from '@/components/ui/OTPModal';
const navLinks = [
  { href: '/internships', labelKey: 'nav.internships', icon: HiOutlineBriefcase },
  { href: '/jobs', labelKey: 'nav.jobs', icon: HiOutlineAcademicCap },
  { href: '/courses', labelKey: 'nav.courses', icon: HiOutlineCollection },
  { href: '/public-space', labelKey: 'nav.publicSpace', icon: HiOutlineChat },
];
export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { t, language, setLanguage, supportedLanguages, otpRequired, cancelLanguageChange, confirmLanguageChange } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [showLangOTP, setShowLangOTP] = useState(false);
  const profileRef = useRef(null);
  const langRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdown(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLanguageChange = async (code) => {
    const result = setLanguage(code);
    if (result?.requiresOTP) {
      if (!user?.email) {
        alert('You must be logged in to change to this language.');
        cancelLanguageChange();
        return;
      }
      try {
        const res = await fetch('/api/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, purpose: 'language' }),
        });
        if (res.ok) {
          setShowLangOTP(true);
        } else {
          const data = await res.json();
          console.error(data.error);
          alert('Failed to send OTP: ' + (data.error || 'Server error'));
          cancelLanguageChange();
        }
      } catch (err) {
        console.error('Failed to send OTP:', err);
      }
    }
    setLangDropdown(false);
  };
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-bold text-dark-50">
                Intern<span className="gradient-text">Hub</span>
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'text-primary-light'
                        : 'text-dark-400 hover:text-dark-100 hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {t(link.labelKey)}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-2 right-2 h-0.5 gradient-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangDropdown(!langDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-dark-400 hover:text-dark-100 hover:bg-white/5 transition-all duration-200"
                >
                  <HiOutlineGlobeAlt className="w-4 h-4" />
                  <span>{supportedLanguages.find((l) => l.code === language)?.flag}</span>
                  <HiOutlineChevronDown className={`w-3 h-3 transition-transform duration-200 ${langDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {langDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-900 border border-white/10 rounded-2xl p-2 shadow-xl shadow-black/30"
                    >
                      {supportedLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                            language === lang.code
                              ? 'bg-primary/10 text-primary-light'
                              : 'text-dark-300 hover:bg-white/5 hover:text-dark-100'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                          {lang.requiresOTP && (
                            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">OTP</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {isAuthenticated ? (
                <>
                  <button className="relative p-2 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-white/5 transition-all duration-200">
                    <HiOutlineBell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse" />
                  </button>
                  <div ref={profileRef} className="relative">
                    <button
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm text-dark-200 font-medium max-w-[100px] truncate">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <HiOutlineChevronDown className={`w-3 h-3 text-dark-400 transition-transform duration-200 ${profileDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {profileDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-dark-900 border border-white/10 rounded-2xl p-2 shadow-xl shadow-black/30"
                        >
                          <div className="px-3 py-2 border-b border-white/5 mb-1">
                            <p className="text-sm font-semibold text-dark-100">{user?.name}</p>
                            <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary-light font-medium uppercase">
                              {user?.plan || 'free'} plan
                            </span>
                          </div>
                          <Link href="/dashboard" onClick={() => setProfileDropdown(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-300 hover:bg-white/5 hover:text-dark-100 transition-all">
                            <HiOutlineViewGrid className="w-4 h-4" /> {t('nav.dashboard')}
                          </Link>
                          <Link href="/dashboard/profile" onClick={() => setProfileDropdown(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-300 hover:bg-white/5 hover:text-dark-100 transition-all">
                            <HiOutlineUserCircle className="w-4 h-4" /> {t('nav.profile')}
                          </Link>
                          <Link href="/dashboard/settings" onClick={() => setProfileDropdown(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-300 hover:bg-white/5 hover:text-dark-100 transition-all">
                            <HiOutlineCog className="w-4 h-4" /> {t('nav.settings')}
                          </Link>
                          <div className="border-t border-white/5 mt-1 pt-1">
                            <button
                              onClick={() => { logout(); setProfileDropdown(false); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-danger-light hover:bg-danger/10 transition-all"
                            >
                              <HiOutlineLogout className="w-4 h-4" /> {t('nav.logout')}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-dark-300 hover:text-dark-100 hover:bg-white/5 transition-all duration-200"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-dark-300 hover:text-dark-100 hover:bg-white/5 transition-all"
            >
              {mobileMenuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-dark-900/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'bg-primary/10 text-primary-light' : 'text-dark-300 hover:bg-white/5'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {t(link.labelKey)}
                    </Link>
                  );
                })}
                <div className="pt-3 border-t border-white/5 mt-3 space-y-1">
                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-dark-300 hover:bg-white/5">
                        <HiOutlineViewGrid className="w-5 h-5" /> {t('nav.dashboard')}
                      </Link>
                      <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-danger-light hover:bg-danger/10">
                        <HiOutlineLogout className="w-5 h-5" /> {t('nav.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-dark-200 border border-white/10 hover:bg-white/5">
                        {t('nav.login')}
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white gradient-primary">
                        {t('nav.register')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <div className="h-16 lg:h-18" />
      <OTPModal
        isOpen={showLangOTP}
        onClose={() => {
          setShowLangOTP(false);
          cancelLanguageChange();
        }}
        onVerify={() => {
          setShowLangOTP(false);
          confirmLanguageChange();
        }}
        email={user?.email}
        purpose="language"
        title="Language Verification"
      />
    </>
  );
}
