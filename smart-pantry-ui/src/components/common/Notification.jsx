import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function Notification() {
  const { notification, showNotification } = usePantry();

  if (!notification) return null;

  const Icon = icons[notification.type] || icons.info;

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${styles[notification.type]}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{notification.message}</p>
        <button
          onClick={() => showNotification(null)}
          className="ml-2 p-0.5 hover:opacity-70"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}