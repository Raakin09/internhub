'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineOfficeBuilding } from 'react-icons/hi';
export default function InternshipCard({ internship, index = 0 }) {
  const {
    _id, title, company, companyLogo, location, workType,
    stipendMin, stipendMax, duration, skills, isPPO, category,
    applicantCount, deadline, isFeatured,
  } = internship;
  const workTypeLabels = { remote: 'Remote', hybrid: 'Hybrid', office: 'Office' };
  const workTypeColors = {
    remote: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    hybrid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    office: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  const formatStipend = () => {
    if (!stipendMin && !stipendMax) return 'Unpaid';
    if (stipendMin === stipendMax) return `₹${stipendMin?.toLocaleString()}/mo`;
    return `₹${stipendMin?.toLocaleString()} - ₹${stipendMax?.toLocaleString()}/mo`;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/internship/${_id}`} className="block">
        <div className="glass-card rounded-2xl p-5 h-full relative group">
          {isFeatured && (
            <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full gradient-primary text-[10px] font-bold text-white uppercase tracking-wider shadow-lg shadow-primary/30">
              Featured
            </div>
          )}
          {isPPO && (
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-bold uppercase border border-accent/20">
              PPO
            </div>
          )}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-dark-700 border border-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {companyLogo ? (
                <img src={companyLogo} alt={company} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <HiOutlineOfficeBuilding className="w-5 h-5 text-dark-400" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-dark-100 truncate group-hover:text-primary-light transition-colors">
                {title}
              </h3>
              <p className="text-xs text-dark-400 truncate">{company}</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-4 text-xs text-dark-400">
              <span className="flex items-center gap-1">
                <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                {location || 'Remote'}
              </span>
              <span className="flex items-center gap-1">
                <HiOutlineClock className="w-3.5 h-3.5" />
                {duration}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm font-semibold text-dark-100">
                <HiOutlineCurrencyRupee className="w-4 h-4 text-primary-light" />
                {formatStipend()}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${workTypeColors[workType] || workTypeColors.remote}`}>
                {workTypeLabels[workType] || 'Remote'}
              </span>
            </div>
          </div>
          {skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md bg-dark-700/50 text-dark-300 text-[10px] font-medium border border-white/5"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="px-2 py-0.5 rounded-md text-dark-500 text-[10px]">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-[10px] text-dark-500">
              {applicantCount || 0} applicants
            </span>
            <span className="text-xs font-medium text-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
