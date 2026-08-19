'use client';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </LanguageProvider>
    </AuthProvider>
  );
}
