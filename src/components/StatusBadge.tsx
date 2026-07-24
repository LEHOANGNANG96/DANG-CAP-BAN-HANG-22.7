import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'verified';
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  const configs = {
    success: { 
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80', 
      icon: CheckCircle2, 
      text: label || 'Thành công' 
    },
    warning: { 
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80', 
      icon: AlertTriangle, 
      text: label || 'Cảnh báo' 
    },
    error: { 
      bg: 'bg-rose-50 text-rose-800 border-rose-200/80', 
      icon: XCircle, 
      text: label || 'Lỗi' 
    },
    info: { 
      bg: 'bg-sky-50 text-sky-800 border-sky-200/80', 
      icon: Info, 
      text: label || 'Thông tin' 
    },
    verified: { 
      bg: 'bg-orange-50 text-shopee border-orange-200/80', 
      icon: ShieldCheck, 
      text: label || 'Chính hãng Shopee Mall' 
    },
  };

  const Config = configs[status];
  const Icon = Config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${Config.bg} ${className}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
      <span>{Config.text}</span>
    </span>
  );
};
