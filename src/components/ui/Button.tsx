/**
 * 🔘 Componente Button Reutilizable
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  style,
  children,
  ...props 
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    borderRadius: '8px',
    transition: 'all 150ms',
    outline: 'none',
    border: 'none',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.5 : 1,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#2563eb',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#e5e7eb',
      color: '#111827',
    },
    danger: {
      backgroundColor: '#dc2626',
      color: 'white',
    },
    success: {
      backgroundColor: '#16a34a',
      color: 'white',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#374151',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '6px 12px',
      fontSize: '14px',
    },
    md: {
      padding: '8px 16px',
      fontSize: '16px',
    },
    lg: {
      padding: '12px 24px',
      fontSize: '18px',
    },
  };

  const hoverStyles: Record<string, string> = {
    primary: '#1d4ed8',
    secondary: '#d1d5db',
    danger: '#b91c1c',
    success: '#15803d',
    ghost: '#f3f4f6',
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);

  // Animación del spinner
  React.useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 30) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(isHovered && !disabled && !isLoading ? { backgroundColor: hoverStyles[variant] } : {}),
    ...style,
  };

  return (
    <button
      style={combinedStyle}
      disabled={disabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {isLoading && (
        <svg 
          style={{ 
            transform: `rotate(${rotation}deg)`, 
            marginLeft: '-4px', 
            marginRight: '8px', 
            width: '16px', 
            height: '16px',
            transition: 'transform 50ms linear'
          }}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            style={{ opacity: 0.25 }}
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            style={{ opacity: 0.75 }}
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
