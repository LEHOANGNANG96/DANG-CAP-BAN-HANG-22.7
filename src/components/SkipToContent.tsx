import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[150] focus:px-5 focus:py-2.5 focus:bg-shopee focus:text-white focus:font-bold focus:rounded-2xl focus:shadow-2xl focus:ring-4 focus:ring-orange-300 focus:outline-none transition-all"
    >
      Chuyển nhanh tới nội dung chính (Skip to main content)
    </a>
  );
};
