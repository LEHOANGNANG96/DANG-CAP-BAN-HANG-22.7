import React from 'react';
import { Product, formatPrice } from '../constants';
import { Star, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Normalize fields between index model (e.g. i, n, p, img) and direct database/sheets model (e.g. externalId, name, image)
  const id = product.id || product.externalId || (product as any).i || '';
  const name = product.name || (product as any).n || '';
  const image = product.image || (product as any).img || 'https://picsum.photos/seed/product/400/400';
  const originalPrice = product.originalPrice || (product as any).op || '';
  const discountPrice = product.discountPrice || (product as any).p || '';
  const discountPercent = product.discountPercent || (product as any).pct || '';
  const soldCount = product.soldCount || (product as any).s || '';
  let badge = product.badge || (product as any).b || '';
  const affiliateUrl = product.affiliateUrl || (product as any).u || 'https://shopee.vn';

  // Parse rating score and likes if we packed them inside badge (or read them directly if available)
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
    // Clear badge since it was a packed rating/likes indicator
    badge = '';
  }

  // Format rating score nicely
  const ratingNum = ratingScore ? parseFloat(String(ratingScore).replace(',', '.')) : 4.8;

  // Nice formatter for metric counts (e.g. 4245 -> 4,2k)
  const formatMetric = (val: string | number): string => {
    if (val === undefined || val === null || val === '') return '';
    const cleanStr = String(val).replace(/\D/g, '');
    const num = parseInt(cleanStr, 10) || 0;
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.', ',') + 'k';
    }
    return String(num);
  };

  // Auto-detect Mall or special badge labels
  let displayBadge = '';
  if (badge && badge.toUpperCase() !== 'NULL') {
    displayBadge = badge;
  } else if (name.toLowerCase().includes('mall') || name.toLowerCase().includes('chính hãng')) {
    displayBadge = 'Mall';
  } else if (name.toLowerCase().includes('yêu thích') || (product as any).category?.toLowerCase().includes('yêu thích')) {
    displayBadge = 'Yêu thích';
  }

  // Generate a realistic, stable location in Vietnam based on the ID hash
  const locations = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Bình Dương'];
  const hashIdx = id ? String(id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % locations.length : 0;
  const displayLocation = locations[hashIdx];

  // Format sold count nicely (e.g. 29921 -> 29,9k)
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

  return (
    <div 
      id={`product-card-${id}`}
      onClick={handleClick}
      className="group relative bg-white border border-[#f3f3f3] hover:border-shopee hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex flex-col h-full rounded-sm overflow-hidden select-none"
    >
      {/* Product Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex-shrink-0 border-b border-gray-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover select-none pointer-events-none" 
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Authentic Shopee Ribbon Flag Discount Tag (top-right) */}
        {discountPercent && (
          <div 
            className="absolute top-0 right-0 bg-[#ffd124] text-[#ee4d2d] flex flex-col items-center justify-center pt-1.5 pb-2 px-1 w-[38px] h-[40px] shadow-sm z-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)' }}
          >
            <span className="text-[11px] sm:text-[12px] font-extrabold leading-none">
              {discountPercent.replace(/[^0-9]/g, '')}%
            </span>
            <span className="text-[8px] font-extrabold text-white leading-none uppercase mt-[3px]">
              GIẢM
            </span>
          </div>
        )}

        {/* Brand/Product Badges (Mall, Chính hãng, Yêu thích) */}
        {displayBadge && (
          <div className={`absolute top-1.5 left-1.5 text-white font-extrabold text-[9px] px-1 py-0.5 rounded-sm shadow-sm uppercase tracking-wide z-10 leading-none ${
            displayBadge.toUpperCase() === 'MALL' || displayBadge.toLowerCase() === 'chính hãng'
              ? 'bg-[#d0011b]'
              : 'bg-[#f05d40]'
          }`}>
            {displayBadge}
          </div>
        )}
      </div>

      {/* Product Card Details */}
      <div className="p-2 flex flex-col flex-grow">
        {/* Name / Title */}
        <h3 className="text-[12px] text-gray-800 tracking-tight font-normal line-clamp-2 min-h-[34px] leading-[17px] group-hover:text-shopee transition-colors duration-200">
          {name}
        </h3>

        {/* Shopee-style sub-heading labels (Free shipping, Best pricing tags) */}
        <div className="flex items-center gap-1 mt-1 min-h-[16px] overflow-hidden flex-wrap">
          <span className="text-[9px] text-[#00bfa5] border border-[#00bfa5]/40 px-0.5 rounded-sm font-semibold leading-none py-[1px] bg-[#00bfa5]/5">
            Mã giảm giá
          </span>
          <span className="text-[9px] text-shopee border border-shopee/40 px-0.5 rounded-sm font-semibold leading-none py-[1px] bg-orange-50/50">
            Rẻ vô địch
          </span>
        </div>

        {/* Pricing Layout */}
        <div className="flex items-baseline gap-1 mt-2.5">
          <span className="text-[14px] sm:text-[16px] font-bold text-[#ee4d2d] flex items-baseline">
            <span className="text-[11px] font-semibold mr-[1px]">đ</span>
            {formatPrice(discountPrice)}
          </span>
          {originalPrice && originalPrice !== discountPrice && (
            <span className="text-[10px] sm:text-[11px] text-gray-400 line-through leading-none">
              {formatPrice(originalPrice)}đ
            </span>
          )}
        </div>

        {/* Rating and Sales Count section */}
        <div className="flex items-center gap-1 mt-2 text-[10px] sm:text-[11px] text-gray-500 flex-wrap">
          {/* Rating stars */}
          <div className="flex items-center text-[#ffc107]">
            <Star className="w-2.5 h-2.5 fill-[#ffc107] text-[#ffc107]" />
            <span className="text-gray-800 font-bold ml-0.5 mt-[1px]">
              {ratingNum.toFixed(1)}
            </span>
          </div>

          {ratingCount && (
            <>
              <span className="text-gray-400 font-normal ml-0.5">
                ({formatMetric(ratingCount)})
              </span>
            </>
          )}

          <div className="w-[1px] h-2.5 bg-gray-200 mx-1" />

          {/* Sold metrics */}
          <span className="text-gray-500 leading-none">
            Đã bán {formatSoldCountShort(soldCount)}
          </span>
        </div>

        {/* Location Section */}
        <div className="text-[11px] text-gray-400 text-right mt-3 border-t border-[#fcfcfc] pt-2 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            {likesCount && (
              <span className="text-[10px] text-[#ee4d2d] font-bold bg-[#ee4d2d]/5 px-1 py-[2px] rounded-sm leading-none border border-[#ee4d2d]/10 flex items-center gap-0.5" title={`${likesCount} lượt thích`}>
                <span className="scale-90 select-none">❤️</span>
                {formatMetric(likesCount)}
              </span>
            )}
            <span className="text-[10px] text-[#ff007f] font-bold underline bg-[#ff007f]/5 px-1 rounded-sm leading-none py-[2px] border border-[#ff007f]/10">
              Mùa Deal
            </span>
          </div>
          <span className="truncate">{displayLocation}</span>
        </div>
      </div>
    </div>
  );
};

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-white border border-[#f3f3f3] rounded-sm overflow-hidden flex flex-col h-full w-full">
      <div className="aspect-square bg-gray-100 w-full" />
      <div className="p-2 flex flex-col flex-grow space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-2.5 bg-gray-100 rounded w-16 mt-1" />
        <div className="flex justify-between items-end pt-3 mt-auto">
          <div className="space-y-1">
            <div className="h-2.5 bg-gray-100 rounded w-8" />
            <div className="h-4 bg-gray-100 rounded w-14" />
          </div>
          <div className="h-6 w-14 bg-gray-100 rounded-sm" />
        </div>
      </div>
    </div>
  );
};
