import React, { useState } from 'react';
import { Trash2, Edit3, AlertTriangle, Clock, Package } from 'lucide-react';
import Badge from '../common/Badge';

export default function PantryItemCard({ item, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Calculate days until expiry
  const daysUntilExpiry = item.estimatedExpiry
    ? Math.ceil((new Date(item.estimatedExpiry) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const getExpiryBadge = () => {
    if (daysUntilExpiry === null) return <Badge variant="blue">No Expiry</Badge>;
    if (daysUntilExpiry < 0) return <Badge variant="red">Expired</Badge>;
    if (daysUntilExpiry <= 2) return <Badge variant="red">Expires Today!</Badge>;
    if (daysUntilExpiry <= 5) return <Badge variant="yellow">Use Soon</Badge>;
    return <Badge variant="green">Fresh</Badge>;
  };

  const getStockBadge = () => {
    if (item.quantity <= 1) return <Badge variant="red">Very Low</Badge>;
    if (item.quantity <= (item.lowThreshold || 2)) return <Badge variant="yellow">Low</Badge>;
    return <Badge variant="green">In Stock</Badge>;
  };

  const getCategoryIcon = () => {
    const icons = {
      DAIRY: '🥛', VEGETABLES: '🥬', FRUITS: '🍎', PROTEIN: '🥩',
      GRAINS: '🌾', SPICES: '🧂', BEVERAGES: '🥤', CONDIMENTS: '🫙',
      SNACKS: '🍪', FROZEN: '🧊', OTHER: '📦'
    };
    return icons[item.category] || '📦';
  };

  return (
    <div className={`card p-4 relative group ${daysUntilExpiry !== null && daysUntilExpiry < 0 ? 'border-red-200 bg-red-50/30' : ''}`}>
      {/* Top Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getCategoryIcon()}</div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.category || 'Uncategorized'}</p>
          </div>
        </div>

        {/* Actions (show on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          <span>{item.quantity} {item.unit || 'pcs'}</span>
        </div>
        {item.estimatedExpiry && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(item.estimatedExpiry).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Badges Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {getExpiryBadge()}
        {getStockBadge()}
        {item.dietaryType && (
          <Badge variant="purple">{item.dietaryType}</Badge>
        )}
      </div>

      {/* Storage tip */}
      {item.storageTip && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-[11px] text-blue-700">💡 {item.storageTip}</p>
        </div>
      )}

      {/* Warning */}
      {daysUntilExpiry !== null && daysUntilExpiry <= 2 && daysUntilExpiry >= 0 && (
        <div className="mt-3 flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <p className="text-[11px] text-amber-700 font-medium">
            {daysUntilExpiry === 0 ? 'Expires today!' : `Only ${daysUntilExpiry} day(s) left`}
          </p>
        </div>
      )}

      {/* Delete confirmation */}
      {showConfirm && (
        <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 z-10">
          <p className="text-sm font-medium text-gray-700 mb-3">Remove "{item.name}"?</p>
          <div className="flex gap-2">
            <button onClick={() => setShowConfirm(false)} className="btn-secondary text-xs py-1.5 px-3">
              Cancel
            </button>
            <button
              onClick={() => { onDelete(item.id); setShowConfirm(false); }}
              className="btn-danger text-xs py-1.5 px-3"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}