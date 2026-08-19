'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  HiOutlineViewGrid, HiOutlineDocumentText, HiOutlineUserCircle,
  HiOutlineDocumentDuplicate, HiOutlineCreditCard, HiOutlineFingerPrint,
  HiOutlineCog, HiOutlineArrowLeft,
} from 'react-icons/hi';
const sidebarLinks = [
  { href: '/dashboard', label: 'dashboard.overview', icon: HiOutlineViewGrid },
  { href: '/dashboard/applications', label: 'dashboard.applications', icon: HiOutlineDocumentText },
  { href: '/dashboard/profile', label: 'dashboard.profile', icon: HiOutlineUserCircle },
  { href: '/dashboard/resume-builder', label: 'dashboard.resumeBuilder', icon: HiOutlineDocumentDuplicate },
  { href: '/dashboard/subscription', label: 'dashboard.subscription', icon: HiOutlineCreditCard },
  { href: '/dashboard/login-history', label: 'dashboard.loginHistory', icon: HiOutlineFingerPrint },
  { href: '/dashboard/settings', label: 'dashboard.settings', icon: HiOutlineCog },
];
export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="glass-card rounded-2xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-primary/20">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark-100 truncate">{user?.name || 'User'}</p>
                    <p className="text-[10px] text-dark-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary-light text-[10px] font-bold uppercase">
                    {user?.plan || 'free'} plan
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-dark-700 text-dark-300 text-[10px] font-medium capitalize">
                    {user?.role || 'student'}
                  </span>
                </div>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                        isActive
                          ? 'bg-primary/10 text-primary-light'
                          : 'text-dark-400 hover:bg-white/5 hover:text-dark-200'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 gradient-primary rounded-r-full"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                      <link.icon className="w-4 h-4" />
                      {t(link.label)}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 mt-4 text-sm text-dark-500 hover:text-dark-300 transition-colors"
              >
                <HiOutlineArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            <div className="lg:hidden mb-6 overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        isActive ? 'bg-primary/10 text-primary-light border border-primary/20' : 'bg-dark-800 text-dark-400 border border-white/5'
                      }`}
                    >
                      <link.icon className="w-3.5 h-3.5" />
                      {t(link.label)}
                    </Link>
                  );
                })}
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
