import React from 'react';
import PantryItemCard from './PantryItemCard';
import EmptyState from '../common/EmptyState';
import { Refrigerator } from 'lucide-react';

export default function PantryDashboard({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={Refrigerator}
        title="Your pantry is empty"
        description="Start by adding ingredients manually or uploading a list/photo."
      />
    );
  }

  // Group items by category
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'OTHER';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {category.replace('_', ' ')} ({categoryItems.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryItems.map((item) => (
              <PantryItemCard
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}