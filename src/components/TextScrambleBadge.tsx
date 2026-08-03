import React, { useEffect, useState } from 'react';
import { Tag, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TextScrambleBadgeProps {
  code: string;
  label?: string;
  discountDesc?: string;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

export const TextScrambleBadge: React.FC<TextScrambleBadgeProps> = ({
  code,
  label = 'Mã Độc Quyền',
  discountDesc = 'Giảm thêm 50K',
}) => {
  const [display, setDisplay] = useState(code);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        code
          .split('')
          .map((char, index) => {
            if (index < iteration) return code[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      if (iteration >= code.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`Đã sao chép mã ưu đãi ${code}!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={handleCopy}
      className="inline-flex items-center justify-between gap-3 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 via-shopee/10 to-red-500/10 dark:from-orange-500/20 dark:to-shopee/20 border border-orange-300/80 dark:border-orange-500/40 rounded-2xl cursor-pointer hover:bg-orange-50 transition-all group"
      title="Nhấp để sao chép mã ưu đãi"
    >
      <div className="flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-shopee" aria-hidden="true" />
        <span className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}:
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono tracking-wider font-extrabold text-xs text-shopee bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-orange-200 shadow-xs tabular-nums">
          {display}
        </span>
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
          {discountDesc}
        </span>
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-shopee transition-colors" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};
