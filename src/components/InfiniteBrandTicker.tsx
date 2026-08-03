import React from 'react';
import { ShieldCheck, Award, Star, CheckCircle2 } from 'lucide-react';

export interface BrandItem {
  name: string;
  category: string;
  discount: string;
  rating: string;
  logoUrl?: string;
}

const SHOPEE_MALL_BRANDS: BrandItem[] = [
  { name: 'Apple Official Store', category: 'Công Nghệ', discount: 'Giảm đến 4.5 Triệu', rating: '4.9★' },
  { name: 'Samsung Official Store', category: 'Điện Tử', discount: 'Voucher 2 Triệu', rating: '4.9★' },
  { name: 'Sony Flagship Store', category: 'Âm Thanh', discount: 'Giảm 45% + Quà', rating: '5.0★' },
  { name: 'Nike Flagship Store', category: 'Thời Trang', discount: 'Mã Giảm 500K', rating: '4.9★' },
  { name: 'Adidas Official Store', category: 'Thể Thao', discount: 'Mua 2 Giảm 50%', rating: '4.9★' },
  { name: "L'Oréal Paris Official", category: 'Sắc Đẹp', discount: 'Quà tặng 450K', rating: '5.0★' },
  { name: 'Xiaomi Official Store', category: 'Gia Dụng', discount: 'Flash Sale 50%', rating: '4.9★' },
  { name: 'Unilever Flagship Store', category: 'Đời Sống', discount: 'Voucher 150K', rating: '4.9★' },
  { name: 'Dyson Vietnam Official', category: 'Cao Cấp', discount: 'Ưu Đãi 3.5 Triệu', rating: '5.0★' },
  { name: 'Anker Official Vietnam', category: 'Phụ Kiện', discount: 'Giảm 40% Freeship', rating: '4.9★' }
];

export const InfiniteBrandTicker: React.FC = () => {
  return (
    <div 
      className="relative overflow-hidden w-full py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-y border-gray-100 dark:border-slate-800 shadow-sm"
      role="region"
      aria-label="Thương hiệu Shopee Mall nổi bật"
    >
      <div className="max-w-7xl mx-auto px-4 mb-2 flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-shopee">
          <ShieldCheck className="w-4 h-4 text-shopee flex-shrink-0" aria-hidden="true" />
          <span>Cam Kết 100% Chính Hãng Từ Shopee Mall & Thương Hiệu Quốc Tế</span>
        </span>
        <span className="hidden sm:flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Đã hoàn tiền 111% nếu phát hiện hàng giả</span>
        </span>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]">
        <div className="flex gap-4 w-max animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] py-1">
          {[...SHOPEE_MALL_BRANDS, ...SHOPEE_MALL_BRANDS].map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-slate-800/90 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-xs transition-all hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-slate-800 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-shopee to-orange-500 flex items-center justify-center text-white font-black text-xs shadow-xs group-hover:scale-105 transition-transform">
                {brand.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {brand.name}
                  </span>
                  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                    Mall
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  <span className="text-shopee font-bold">{brand.discount}</span>
                  <span>•</span>
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" aria-hidden="true" />
                    {brand.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
