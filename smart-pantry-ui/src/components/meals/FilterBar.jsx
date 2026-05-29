import React from 'react';
import { Filter, Flame, Leaf, Drumstick } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';

export default function FilterBar() {
  const { filters, setFilters } = usePantry();

  const dietaryOptions = [
    { value: 'ALL', label: 'All Types', icon: Filter },
    { value: 'VEG', label: 'Vegetarian', icon: Leaf },
    { value: 'NON_VEG', label: 'Non-Veg', icon: Drumstick },
    { value: 'VEGAN', label: 'Vegan', icon: Leaf },
  ];

  const urgencyOptions = [
    { value: 'ALL', label: 'All Items' },
    { value: 'USE_SOON', label: '🔥 Use Soon' },
    { value: 'STABLE', label: '✅ Stable' },
  ];

  const mealCategories = [
    { value: 'ALL', label: 'All Meals' },
    { value: 'BREAKFAST', label: '🌅 Breakfast' },
    { value: 'LUNCH', label: '☀️ Lunch' },
    { value: 'DINNER', label: '🌙 Dinner' },
    { value: 'SNACK', label: '🍿 Snack' },
  ];

  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-wrap gap-6">
        {/* Dietary Type */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Dietary Type
          </label>
          <div className="flex gap-2">
            {dietaryOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setFilters({ dietaryType: value })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.dietaryType === value
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Urgency
          </label>
          <div className="flex gap-2">
            {urgencyOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters({ urgency: value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.urgency === value
                    ? 'bg-accent-100 text-accent-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Category */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Meal Category
          </label>
          <div className="flex gap-2">
            {mealCategories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters({ mealCategory: value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.mealCategory === value
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}