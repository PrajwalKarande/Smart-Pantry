import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Refrigerator,
  UtensilsCrossed,
  CalendarDays,
  ChefHat,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pantry', icon: Refrigerator, label: 'My Pantry' },
  { to: '/meals', icon: UtensilsCrossed, label: 'Meal Ideas' },
  { to: '/recipe', icon: ChefHat, label: 'Action Plan' },
  { to: '/summary', icon: CalendarDays, label: 'Weekly Summary' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-40 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">SmartPantry</h1>
            <p className="text-[11px] text-primary-600 font-medium">AI-Powered Kitchen</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-primary-700 mb-1">🧠 AI Powered</p>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Smart suggestions based on what's in your kitchen right now.
          </p>
        </div>
      </div>
    </aside>
  );
}