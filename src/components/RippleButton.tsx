import React, { useState, MouseEvent } from 'react';
import { motion } from 'motion/react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const addRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left - rippleSize / 2;
    const y = e.clientY - rect.top - rippleSize / 2;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y, size: rippleSize }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    if (onClick) {
      onClick(e);
    }
  };

  const variantStyles = {
    primary: 'bg-shopee hover:bg-shopee-hover text-white shadow-md shadow-shopee/20 border-transparent',
    secondary: 'bg-orange-50 hover:bg-orange-100 text-shopee border-orange-200/80',
    outline: 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200 shadow-xs',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs font-bold rounded-xl min-h-[36px]',
    md: 'px-5 py-2.5 text-sm font-extrabold rounded-2xl min-h-[44px]',
    lg: 'px-7 py-3.5 text-base font-black rounded-2xl min-h-[52px]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={addRipple}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 border transition-colors cursor-pointer select-none focus-accessible ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            top: r.y,
            left: r.x,
            width: r.size,
            height: r.size,
          }}
          className="absolute rounded-full bg-white/35 animate-ping pointer-events-none"
          aria-hidden="true"
        />
      ))}
    </motion.button>
  );
};
