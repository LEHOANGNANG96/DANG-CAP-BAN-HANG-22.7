import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CategoryItem } from '../types';
import { ArrowRight, Tag } from 'lucide-react';

interface KineticCategoryCarouselProps {
  categories: CategoryItem[];
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const KineticCategoryCarousel: React.FC<KineticCategoryCarouselProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraint, setDragConstraint] = useState(0);

  useEffect(() => {
    const updateConstraint = () => {
      if (carouselRef.current) {
        const scrollW = carouselRef.current.scrollWidth;
        const clientW = carouselRef.current.offsetWidth;
        setDragConstraint(Math.min(0, clientW - scrollW));
      }
    };
    updateConstraint();
    window.addEventListener('resize', updateConstraint);
    return () => window.removeEventListener('resize', updateConstraint);
  }, [categories]);

  return (
    <div className="w-full py-6 bg-white dark:bg-slate-900 overflow-hidden border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-shopee rounded-full" aria-hidden="true" />
          <h2 className="text-sm md:text-base font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
            Khám Phá Theo Chuyên Mục Hot Deal
          </h2>
        </div>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          Kéo ngang để xem 30+ danh mục Shopee
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          ref={carouselRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: dragConstraint }}
            dragElastic={0.12}
            className="flex gap-3 w-max py-1"
          >
            {categories.map((cat, idx) => {
              const isSelected = activeCategory === cat.name;
              return (
                <motion.button
                  key={cat.id || cat.name || idx}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                    isSelected
                      ? 'bg-shopee text-white border-shopee shadow-lg shadow-shopee/20'
                      : 'bg-gray-50/90 dark:bg-slate-800/80 hover:bg-orange-50/80 dark:hover:bg-slate-800 border-gray-200/80 dark:border-slate-700/80 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-10 h-10 rounded-xl object-cover bg-white shadow-inner flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left pr-2">
                    <div className="text-xs font-bold whitespace-nowrap leading-tight">
                      {cat.name}
                    </div>
                    <div className="text-[10px] opacity-80 font-mono tabular-nums">
                      {cat.count.toLocaleString('vi-VN')} deal
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
