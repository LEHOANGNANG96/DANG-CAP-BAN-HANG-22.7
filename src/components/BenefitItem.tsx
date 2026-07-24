import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface BenefitItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const BenefitItem: React.FC<BenefitItemProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="flex flex-col items-center text-center p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl shadow-sm hover:shadow-xl border border-gray-100/80 dark:border-slate-800 transition-all group"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
        <div className="text-shopee group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-1.5 tracking-tight">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-[30ch]">{description}</p>
    </motion.div>
  );
};

