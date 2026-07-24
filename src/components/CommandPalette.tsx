import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, X, ExternalLink, Flame, Tag, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Product, formatPrice } from '../constants';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Array<{ id?: string; name: string }>;
  onSelectCategory: (name: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onSelectCategory,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent
          const btn = document.getElementById('cmd-k-trigger');
          if (btn) btn.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter products based on query
  const filteredProducts = query.trim()
    ? products
        .filter((p) => {
          const name = (p.name || (p as any).n || '').toLowerCase();
          return name.includes(query.toLowerCase());
        })
        .slice(0, 8)
    : products.slice(0, 5);

  const filteredCategories = query.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : categories.slice(0, 6);

  const totalItems = filteredCategories.length + filteredProducts.length;

  // Arrow key navigation
  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredCategories.length) {
        const cat = filteredCategories[selectedIndex];
        if (cat) {
          onSelectCategory(cat.name);
          onClose();
        }
      } else {
        const prodIdx = selectedIndex - filteredCategories.length;
        const prod = filteredProducts[prodIdx];
        if (prod) {
          onSelectProduct(prod);
          onClose();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-start justify-center pt-16 sm:pt-24 p-4">
        {/* Backdrop Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col z-10"
          role="dialog"
          aria-modal="true"
          aria-label="Tìm kiếm nhanh sản phẩm"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-gray-100 bg-white sticky top-0 z-10 gap-3">
            <Search className="w-5 h-5 text-shopee flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDownInput}
              placeholder="Tìm nhanh 60,000+ sản phẩm Shopee Hot Deal... (Ví dụ: Áo thun, Tai nghe)"
              className="w-full text-sm font-medium bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold bg-gray-100 text-gray-500 rounded-lg border border-gray-200">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Categories Section */}
            {filteredCategories.length > 0 && (
              <div>
                <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-shopee" />
                  <span>Danh Mục Sẵn Có</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {filteredCategories.map((cat, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <button
                        key={cat.id || cat.name || idx}
                        onClick={() => {
                          onSelectCategory(cat.name);
                          onClose();
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-shopee text-white shadow-md shadow-shopee/20'
                            : 'bg-gray-50 hover:bg-orange-50 hover:text-shopee text-gray-700'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div>
              <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-shopee" />
                  <span>Sản Phẩm Khuyên Dùng</span>
                </span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {filteredProducts.length} kết quả
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Không tìm thấy sản phẩm phù hợp với "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredProducts.map((prod, idx) => {
                    const globalIdx = filteredCategories.length + idx;
                    const isSelected = selectedIndex === globalIdx;
                    const name = prod.name || (prod as any).n || '';
                    const price = prod.discountPrice || (prod as any).p || '';
                    const img = prod.image || (prod as any).img || 'https://picsum.photos/seed/product/100/100';

                    return (
                      <div
                        key={prod.id || idx}
                        onClick={() => {
                          onSelectProduct(prod);
                          onClose();
                        }}
                        className={`flex items-center gap-3 p-2 rounded-2xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-50 border border-orange-200/80 shadow-sm'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <img
                          src={img}
                          alt={name}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-bold text-gray-800 truncate leading-snug">
                            {name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-shopee">
                              {formatPrice(price)}đ
                            </span>
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold">
                              Shopee Mall
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 pr-2">
                          <span className="text-[10px] font-semibold hidden sm:inline">Xem chi tiết</span>
                          <CornerDownLeft className="w-3.5 h-3.5 text-shopee" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer Guide */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold">↑↓</kbd>
                <span>Di chuyển</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold">↵</kbd>
                <span>Chọn</span>
              </span>
            </div>
            <span className="font-semibold text-shopee">Phím tắt Ctrl + K</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
