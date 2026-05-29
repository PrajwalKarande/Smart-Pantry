import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, ChevronDown, ChevronUp, Clock, Edit3, Package, Trash2 } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';

export default function LowStockBanner({ onDelete, onEdit }) {
  const { lowStockItems, expiringItems, expiredItems } = usePantry();
  const [expandedSection, setExpandedSection] = useState(null);

  if (lowStockItems.length === 0 && expiringItems.length === 0 && expiredItems.length === 0) {
    return null;
  }

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Expired Items */}
      {expiredItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('expired')}
            className="w-full p-4 flex items-center gap-4 hover:bg-red-100/50 transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-red-700">
                {expiredItems.length} item(s) have expired!
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                {expiredItems.map(i => i.name).join(', ')}
              </p>
            </div>
            {expandedSection === 'expired'
              ? <ChevronUp className="w-4 h-4 text-red-400" />
              : <ChevronDown className="w-4 h-4 text-red-400" />}
          </button>
          {expandedSection === 'expired' && (
            <div className="px-4 pb-4 space-y-2">
              {expiredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-red-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Expired on {new Date(item.estimatedExpiry).toLocaleDateString()} · {item.quantity} {item.unit || 'pcs'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit item"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                      title="Remove expired item"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expiring Soon */}
      {expiringItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('expiring')}
            className="w-full p-4 flex items-center gap-4 hover:bg-amber-100/50 transition-colors"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-amber-700">
                {expiringItems.length} item(s) expiring within 3 days
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                {expiringItems.map(i => i.name).join(', ')}
              </p>
            </div>
            {expandedSection === 'expiring'
              ? <ChevronUp className="w-4 h-4 text-amber-400" />
              : <ChevronDown className="w-4 h-4 text-amber-400" />}
          </button>
          {expandedSection === 'expiring' && (
            <div className="px-4 pb-4 space-y-2">
              {expiringItems.map((item) => {
                const daysLeft = Math.ceil((new Date(item.estimatedExpiry) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {daysLeft === 0 ? 'Expires today' : `${daysLeft} day(s) left`} · {item.quantity} {item.unit || 'pcs'}
                      </p>
                    </div>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit item"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Low Stock */}
      {lowStockItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('lowstock')}
            className="w-full p-4 flex items-center gap-4 hover:bg-blue-100/50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-blue-700">
                {lowStockItems.length} item(s) running low
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                {lowStockItems.map(i => `${i.name} (${i.quantity} ${i.unit || 'pcs'})`).join(', ')}
              </p>
            </div>
            {expandedSection === 'lowstock'
              ? <ChevronUp className="w-4 h-4 text-blue-400" />
              : <ChevronDown className="w-4 h-4 text-blue-400" />}
          </button>
          {expandedSection === 'lowstock' && (
            <div className="px-4 pb-4 space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} {item.unit || 'pcs'} remaining (threshold: {item.lowThreshold || 2})
                    </p>
                  </div>
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit item"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}