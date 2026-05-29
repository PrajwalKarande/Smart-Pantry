import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';

const pageTitles = {
  '/': 'Dashboard',
  '/pantry': 'My Pantry',
  '/meals': 'Meal Suggestions',
  '/recipe': '15-Min Action Plan',
  '/summary': 'Weekly Summary',
};

export default function Header() {
  const location = useLocation();
  const { expiringItems, lowStockItems } = usePantry();
  const alertCount = expiringItems.length + lowStockItems.length;

  const title = pageTitles[location.pathname] || 'SmartPantry';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </header>
  );
}