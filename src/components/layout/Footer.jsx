'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineMail,
  HiOutlineLocationMarker, HiOutlinePhone,
} from 'react-icons/hi';
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaYoutube } from 'react-icons/fa';
const footerLinks = {
  platform: [
    { label: 'Internships', href: '/internships' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'Courses', href: '/courses' },
    { label: 'Public Space', href: '/public-space' },
    { label: 'Pricing', href: '/dashboard/subscription' },
  ],
  students: [
    { label: 'Browse Internships', href: '/internships' },
    { label: 'Resume Builder', href: '/dashboard/resume-builder' },
    { label: 'Application Tracker', href: '/dashboard' },
    { label: 'Career Guidance', href: '/courses' },
    { label: 'Success Stories', href: '/success-stories' },
  ],
  employers: [
    { label: 'Post Internship', href: '/dashboard/post' },
    { label: 'Post Job', href: '/dashboard/post' },
    { label: 'Manage Applicants', href: '/dashboard' },
    { label: 'Employer Dashboard', href: '/dashboard' },
    { label: 'Hiring Plans', href: '/hiring-plans' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Contact Us', href: '/contact' },
  ],
};
const socialLinks = [
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaGithub, href: '#', label: 'GitHub' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
];
export default function Footer() {
  const { t } = useLanguage();
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    e.target.reset();
  };
  
  return (
    <footer className="relative mt-auto">
      <div className="h-px gradient-primary opacity-30" />
      <div className="bg-dark-950/80 backdrop-blur-sm">
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-dark-50">Stay Updated</h3>
                <p className="text-dark-400 text-sm mt-1">Get the latest internships and career tips in your inbox</p>
              </div>
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="flex-1 md:w-72 px-4 py-2.5 rounded-xl bg-dark-800 border border-white/5 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <span className="text-xl font-bold text-dark-50">
                  Intern<span className="gradient-text">Hub</span>
                </span>
              </Link>
              <p className="text-dark-400 text-sm leading-relaxed mb-4">
                India&apos;s leading platform for internships, jobs, and online trainings. Connecting talent with opportunity.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl bg-dark-800 border border-white/5 flex items-center justify-center text-dark-400 hover:text-primary-light hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-dark-100 uppercase tracking-wider mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-dark-400 hover:text-primary-light transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-dark-500">
                © {new Date().getFullYear()} InternHub. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-dark-500 text-sm">
                  <HiOutlineMail className="w-4 h-4" />
                  <span>support@internhub.com</span>
                </div>
                <div className="flex items-center gap-2 text-dark-500 text-sm">
                  <HiOutlinePhone className="w-4 h-4" />
                  <span>+91 9876543210</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
