import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../constants';
import { ProductCard } from './ProductCard';
import { Flame, ChevronRight, ChevronLeft, Sparkles, Zap, Tag } from 'lucide-react';

interface ShopeeSectionsProps {
  allProducts: Product[];
  categories: Array<{
    id?: string;
    name: string;
    image: string;
    count: number;
  }>;
  onCategorySelect: (name: string) => void;
  activeCategory: string;
  onQuickViewProduct?: (product: Product) => void;
}

export const ShopeeSections: React.FC<ShopeeSectionsProps> = ({
  allProducts,
  categories,
  onCategorySelect,
  activeCategory,
  onQuickViewProduct
}) => {
  const flashSaleRef = useRef<HTMLDivElement>(null);

  const getProductPct = (p: any) => {
    const pct = p.discountPercent || p.pct || '';
    if (!pct) return 0;
    return parseInt(pct.replace(/\D/g, '')) || 0;
  };

  const getProductSoldCount = (p: any) => {
    const sold = p.soldCount || p.s || '';
    if (!sold) return 0;
    const soldStr = String(sold).toLowerCase().replace(/[^0-9k]/g, '');
    if (soldStr.includes('k')) {
      return Math.round(parseFloat(soldStr.replace('k', '')) * 1000);
    }
    return parseInt(soldStr) || 0;
  };

  const flashSaleProducts = allProducts
    .filter(p => getProductPct(p) >= 30)
    .slice(0, 16);

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 500;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 3;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 py-6 overflow-hidden">
      
      {/* 1. Category Quick Browser Grid */}
      {categories.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-shopee fill-shopee/20" />
              <span>Danh Mục Phổ Biến Nhất</span>
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-shopee border border-orange-100">
              {categories.length + 1} danh mục chọn lọc
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
            {/* Standard "Tất cả Deal" Card */}
            <motion.button
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategorySelect('Tất cả')}
              className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-300 group select-none cursor-pointer border ${
                activeCategory === 'Tất cả' 
                  ? 'border-shopee bg-orange-50/60 text-shopee ring-2 ring-shopee/20 font-bold shadow-sm' 
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700 font-medium'
              }`}
            >
              <div className="w-13 h-13 rounded-2xl overflow-hidden bg-gradient-to-tr from-shopee via-orange-500 to-red-600 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-105 shadow-md shadow-orange-500/20">
                <Flame className="w-6 h-6 text-white fill-white/20 animate-pulse" />
              </div>
              <span className="text-[11px] leading-snug line-clamp-2 min-h-[32px] font-bold text-shopee">
                Tất cả Deal
              </span>
            </motion.button>

            {/* Other categories */}
            {categories.slice(0, isExpanded ? categories.length : 9).map((cat, idx) => {
              const isActive = activeCategory === cat.name;
              return (
                <motion.button
                  key={cat.id || cat.name || idx}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategorySelect(cat.name)}
                  className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-300 group select-none cursor-pointer border ${
                    isActive 
                      ? 'border-shopee bg-orange-50/60 text-shopee ring-2 ring-shopee/20 font-bold shadow-sm' 
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700 font-medium'
                  }`}
                >
                  <div className="w-13 h-13 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-105 border border-gray-100 shadow-sm">
                    <img 
                      src={cat.image || 'https://picsum.photos/seed/cat/100/100'} 
                      alt={cat.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] leading-snug line-clamp-2 min-h-[32px] text-gray-800 group-hover:text-shopee transition-colors">
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Expand toggle */}
          {categories.length > 9 && (
            <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-orange-50 hover:text-shopee transition-all border border-gray-200 active:scale-95 cursor-pointer shadow-sm"
              >
                {isExpanded ? (
                  <>
                    Thu gọn danh mục <ChevronLeft className="w-4 h-4 rotate-90" />
                  </>
                ) : (
                  <>
                    Xem thêm {categories.length - 9} danh mục <ChevronRight className="w-4 h-4 rotate-90" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.section>
      )}

      {/* 2. FLASH SALE Section */}
      {flashSaleProducts.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden"
        >
          {/* Background Decorative graphics */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none">
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-[30px] border-white/20"></div>
          </div>

          {/* Flash Sale Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 z-10 relative">
            <div className="flex items-center gap-3.5 flex-wrap">
              <span className="flex items-center justify-center bg-white rounded-2xl p-2 text-red-600 shadow-md">
                <Zap className="w-6 h-6 fill-red-600 animate-bounce" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase italic leading-none flex items-center gap-2 drop-shadow">
                FLASH SALE DEAL SỐC
              </h2>
              
              {/* Countdown Ticker */}
              <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm ml-1">
                <span className="bg-black/80 backdrop-blur-sm text-white font-black px-2.5 py-1 rounded-lg min-w-[28px] text-center shadow-inner">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="font-extrabold text-white">:</span>
                <span className="bg-black/80 backdrop-blur-sm text-white font-black px-2.5 py-1 rounded-lg min-w-[28px] text-center shadow-inner">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="font-extrabold text-white">:</span>
                <span className="bg-black/90 backdrop-blur-sm text-white font-black px-2.5 py-1 rounded-lg min-w-[28px] text-center shadow-inner border border-red-400/50">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll(flashSaleRef, 'left')}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 hover:bg-white/40 active:scale-90 transition-all outline-none backdrop-blur-sm shadow-sm cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => handleScroll(flashSaleRef, 'right')}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 hover:bg-white/40 active:scale-90 transition-all outline-none backdrop-blur-sm shadow-sm cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Flash Sale Carousel */}
          <div 
            ref={flashSaleRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
          >
            {flashSaleProducts.map((product, idx) => {
              const pId = product.id || product.externalId || (product as any).i || `flash-${idx}`;
              return (
                <div key={pId} className="w-[160px] sm:w-[180px] flex-shrink-0 snap-start">
                  <ProductCard product={product} onQuickView={onQuickViewProduct} />
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

    </div>
  );
};

export default ShopeeSections;

