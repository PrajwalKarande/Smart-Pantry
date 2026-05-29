import React from 'react';

const variants = {
  green: 'badge-green',
  yellow: 'badge-yellow',
  red: 'badge-red',
  blue: 'badge-blue',
  purple: 'badge-purple',
};

export default function Badge({ children, variant = 'green', className = '' }) {
  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}