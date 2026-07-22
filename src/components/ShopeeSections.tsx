import React, { useRef, useState, useEffect } from 'react';
import { Product } from '../constants';
import { ProductCard } from './ProductCard';
import { ShieldAlert, Flame, ChevronRight, ChevronLeft, ShieldCheck, Heart, Sparkles, RefreshCw } from 'lucide-react';

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
}

export const ShopeeSections: React.FC<ShopeeSectionsProps> = ({
  allProducts,
  categories,
  onCategorySelect,
  activeCategory
}) => {
  const flashSaleRef = useRef<HTMLDivElement>(null);

  // Normalize product helper to safely read properties regardless of format
  const getProductPct = (p: any) => {
    const pct = p.discountPercent || p.pct || '';
    if (!pct) return 0;
    return parseInt(pct.replace(/\D/g, '')) || 0;
  };

  const getProductBadge = (p: any) => {
    return (p.badge || p.b || '').toLowerCase();
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

  // Filter high-quality / flash sale products (discount >= 30%)
  const flashSaleProducts = allProducts
    .filter(p => getProductPct(p) >= 30)
    .slice(0, 15);



  // Filter best sellers (sold count >= 500)
  const bestSellers = allProducts
    .filter(p => getProductSoldCount(p) >= 500)
    .slice(0, 15);

  // Scroll helpers
  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 600;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // State for Countdown
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
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-8 overflow-hidden">
      
      {/* 1. Category Quick Browser Grid */}
      {categories.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-sans text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-shopee fill-shopee/10" />
              Danh Mục Ưa Chuộng Nhất
            </h2>
            <span className="text-xs text-gray-400 font-mono">{categories.length + 1} Danh mục</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
            {/* Standard "Tất cả Deal" Card */}
            <button
              onClick={() => onCategorySelect('Tất cả')}
              className={`flex flex-col items-center text-center p-3 rounded-xl transition-all duration-300 group select-none cursor-pointer border ${
                activeCategory === 'Tất cả' 
                  ? 'border-shopee bg-orange-50/40 text-shopee ring-1 ring-shopee font-bold' 
                  : 'border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-700 font-medium'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-tr from-shopee to-red-600 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-105 border border-red-100 shadow-sm shadow-orange-100">
                <Flame className="w-6 h-6 text-white fill-white/10" />
              </div>
              <span className="text-[11px] leading-tight line-clamp-2 min-h-[32px] text-shopee">
                Tất cả Deal
              </span>
            </button>

            {/* Other categories */}
            {categories.slice(0, isExpanded ? categories.length : 9).map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.id || cat.name}
                  onClick={() => onCategorySelect(cat.name)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl transition-all duration-300 group select-none cursor-pointer border ${
                    isActive 
                      ? 'border-shopee bg-orange-50/40 text-shopee ring-1 ring-shopee font-bold' 
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-700 font-medium'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-105 border border-gray-100/50">
                    <img 
                      src={cat.image || 'https://picsum.photos/seed/cat/100/100'} 
                      alt={cat.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[11px] leading-tight line-clamp-2 min-h-[32px]">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Toggle buttons */}
          {categories.length > 9 && (
            <div className="flex justify-center mt-6 pt-4 border-t border-gray-50">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-shopee transition-all border border-gray-200 active:scale-95 cursor-pointer shadow-sm"
              >
                {isExpanded ? (
                  <>
                    Thu gọn danh mục <ChevronLeft className="w-4 h-4 rotate-90" />
                  </>
                ) : (
                  <>
                    Xem thêm {categories.length - 9} danh mục sản phẩm <ChevronRight className="w-4 h-4 rotate-90" />
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      )}

      {/* 2. FLASH SALE Section */}
      {flashSaleProducts.length > 0 && (
        <section className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
          {/* Background Decorative patterns */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none">
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-[24px] border-white"></div>
          </div>

          {/* Flash Sale Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 z-10 relative">
            <div className="flex items-center gap-3.5 flex-wrap">
              <span className="flex items-center justify-center bg-white rounded-full p-1 text-red-600 animate-pulse">
                <Flame className="w-6 h-6 fill-red-600" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase italic leading-none flex items-center gap-2">
                FLASH SALE DEAL SỐC
              </h2>
              
              {/* Countdown Ticker */}
              <div className="flex items-center gap-1 font-mono text-sm ml-2">
                <span className="bg-black/90 text-white font-bold px-2 py-1 rounded min-w-[24px] text-center">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="font-bold text-white">:</span>
                <span className="bg-black/90 text-white font-bold px-2 py-1 rounded min-w-[24px] text-center">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="font-bold text-white">:</span>
                <span className="bg-black/95 text-white font-bold px-2 py-1 rounded min-w-[24px] text-center animate-pulse">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll(flashSaleRef, 'left')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 active:scale-95 transition-all outline-none"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => handleScroll(flashSaleRef, 'right')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 active:scale-95 transition-all outline-none"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Flash Sale Carousel */}
          <div 
            ref={flashSaleRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
          >
            {flashSaleProducts.map((product, idx) => {
              const pId = product.id || product.externalId || (product as any).i || `flash-${idx}`;
              return (
                <div key={pId} className="w-[150px] sm:w-[170px] flex-shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </section>
      )}



    </div>
  );
};
export default ShopeeSections;
