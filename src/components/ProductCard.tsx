import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product, formatPrice } from '../constants';
import { Star, Eye, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [imageError, setImageError] = useState(false);

  // Normalize fields between index model (e.g. i, n, p, img) and direct database/sheets model (e.g. externalId, name, image)
  const id = product.id || product.externalId || (product as any).i || '';
  const name = product.name || (product as any).n || '';
  const image = imageError 
    ? 'https://picsum.photos/seed/product/400/400' 
    : (product.image || (product as any).img || 'https://picsum.photos/seed/product/400/400');
  const originalPrice = product.originalPrice || (product as any).op || '';
  const discountPrice = product.discountPrice || (product as any).p || '';
  const discountPercent = product.discountPercent || (product as any).pct || '';
  const soldCount = product.soldCount || (product as any).s || '';
  let badge = product.badge || (product as any).b || '';
  const affiliateUrl = product.affiliateUrl || (product as any).u || 'https://shopee.vn';

  // Parse rating score and likes if we packed them inside badge
  let ratingScore = product.ratingScore || (product as any).rs || '';
  let likesCount = product.likesCount || (product as any).lc || '';
  let ratingCount = product.ratingCount || (product as any).rc || '';

  if (badge && (badge.includes('⭐') || badge.includes('❤️'))) {
    const parts = badge.split('|');
    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed.includes('⭐')) {
        ratingScore = trimmed.replace('⭐', '').trim();
      } else if (trimmed.includes('❤️')) {
        likesCount = trimmed.replace('❤️', '').trim();
      }
    });
    badge = '';
  }

  const ratingNum = ratingScore ? parseFloat(String(ratingScore).replace(',', '.')) : 4.8;

  const formatMetric = (val: string | number): string => {
    if (val === undefined || val === null || val === '') return '';
    const cleanStr = String(val).replace(/\D/g, '');
    const num = parseInt(cleanStr, 10) || 0;
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.', ',') + 'k';
    }
    return String(num);
  };

  let displayBadge = '';
  if (badge && badge.toUpperCase() !== 'NULL') {
    displayBadge = badge;
  } else if (name.toLowerCase().includes('mall') || name.toLowerCase().includes('chính hãng')) {
    displayBadge = 'Mall';
  } else if (name.toLowerCase().includes('yêu thích') || (product as any).category?.toLowerCase().includes('yêu thích')) {
    displayBadge = 'Yêu thích';
  }

  const locations = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Bình Dương'];
  const hashIdx = id ? String(id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % locations.length : 0;
  const displayLocation = locations[hashIdx];

  const formatSoldCountShort = (sold: string | number): string => {
    if (!sold) return '100+';
    const num = parseInt(String(sold).replace(/\D/g, '')) || 0;
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.', ',') + 'k';
    }
    return String(num);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product);
    } else {
      handleClick(e);
    }
  };

  return (
    <motion.div 
      id={`product-card-${id}`}
      onClick={handleClick}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative bg-white border border-gray-100 hover:border-shopee hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden select-none"
    >
      {/* Product Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex-shrink-0 border-b border-gray-100/60">
        <img 
          src={image} 
          alt={name} 
          onError={() => setImageError(true)}
          className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-out" 
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Authentic Shopee Ribbon Flag Discount Tag */}
        {discountPercent && (
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 bg-gradient-to-b from-[#ffd124] to-[#fbc02d] text-[#ee4d2d] flex flex-col items-center justify-center pt-1.5 pb-2 px-1 w-[38px] h-[40px] shadow-sm z-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)' }}
          >
            <span className="text-[11px] sm:text-[12px] font-black leading-none">
              {discountPercent.replace(/[^0-9]/g, '')}%
            </span>
            <span className="text-[8px] font-extrabold text-white leading-none uppercase mt-[3px]">
              GIẢM
            </span>
          </motion.div>
        )}

        {/* Brand/Product Badges */}
        {displayBadge && (
          <div className={`absolute top-2 left-2 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-md shadow-md uppercase tracking-wider z-10 leading-none ${
            displayBadge.toUpperCase() === 'MALL' || displayBadge.toLowerCase() === 'chính hãng'
              ? 'bg-gradient-to-r from-[#d0011b] to-red-600'
              : 'bg-gradient-to-r from-[#f05d40] to-orange-500'
          }`}>
            {displayBadge}
          </div>
        )}

        {/* Quick View Button Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2 z-20">
          <button
            onClick={handleQuickViewClick}
            className="bg-white/95 text-gray-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-shopee hover:text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem Chi Tiết</span>
          </button>
        </div>
      </div>

      {/* Product Card Details */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-[12px] sm:text-[13px] text-gray-800 font-medium line-clamp-2 min-h-[36px] leading-[18px] group-hover:text-shopee transition-colors duration-200">
          {name}
        </h3>

        {/* Voucher tags */}
        <div className="flex items-center gap-1 mt-1.5 min-h-[18px] overflow-hidden flex-wrap">
          <span className="text-[9px] text-[#00bfa5] border border-[#00bfa5]/40 px-1 rounded-md font-semibold leading-none py-[2px] bg-[#00bfa5]/5">
            FreeShip Xtra
          </span>
          <span className="text-[9px] text-shopee border border-shopee/40 px-1 rounded-md font-semibold leading-none py-[2px] bg-orange-50">
            Rẻ vô địch
          </span>
        </div>

        {/* Pricing Layout */}
        <div className="flex items-baseline gap-1.5 mt-2.5">
          <span className="text-[15px] sm:text-[17px] font-extrabold text-[#ee4d2d] flex items-baseline">
            <span className="text-[11px] font-bold mr-[1px]">đ</span>
            {formatPrice(discountPrice)}
          </span>
          {originalPrice && originalPrice !== discountPrice && (
            <span className="text-[10px] sm:text-[11px] text-gray-400 line-through leading-none">
              {formatPrice(originalPrice)}đ
            </span>
          )}
        </div>

        {/* Rating and Sales Count */}
        <div className="flex items-center justify-between gap-1 mt-2 text-[10px] sm:text-[11px] text-gray-500">
          <div className="flex items-center gap-1 text-[#ffc107]">
            <Star className="w-3 h-3 fill-[#ffc107] text-[#ffc107]" />
            <span className="text-gray-800 font-bold">
              {ratingNum.toFixed(1)}
            </span>
            {ratingCount && (
              <span className="text-gray-400 font-normal">
                ({formatMetric(ratingCount)})
              </span>
            )}
          </div>

          <span className="text-gray-500 font-medium">
            Đã bán {formatSoldCountShort(soldCount)}
          </span>
        </div>

        {/* Location Section */}
        <div className="text-[11px] text-gray-400 mt-3 border-t border-gray-100 pt-2 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            {likesCount && (
              <span className="text-[10px] text-[#ee4d2d] font-bold bg-[#ee4d2d]/5 px-1 py-[2px] rounded-md leading-none border border-[#ee4d2d]/10 flex items-center gap-0.5" title={`${likesCount} lượt thích`}>
                <Heart className="w-2.5 h-2.5 fill-[#ee4d2d]" />
                {formatMetric(likesCount)}
              </span>
            )}
          </div>
          <span className="truncate text-gray-400 font-normal">{displayLocation}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col h-full w-full">
      <div className="aspect-square bg-gray-100 w-full" />
      <div className="p-3 flex flex-col flex-grow space-y-2">
        <div className="h-3.5 bg-gray-100 rounded-md w-full" />
        <div className="h-3.5 bg-gray-100 rounded-md w-4/5" />
        <div className="h-3 bg-gray-100 rounded-md w-16 mt-1" />
        <div className="flex justify-between items-end pt-3 mt-auto">
          <div className="space-y-1">
            <div className="h-3 bg-gray-100 rounded-md w-10" />
            <div className="h-5 bg-gray-100 rounded-md w-20" />
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

