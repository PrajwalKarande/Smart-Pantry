import React, { useState, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'DAIRY', 'VEGETABLES', 'FRUITS', 'PROTEIN', 'GRAINS',
  'SPICES', 'BEVERAGES', 'CONDIMENTS', 'SNACKS', 'FROZEN', 'OTHER'
];

const DIETARY_TYPES = ['VEG', 'NON_VEG', 'VEGAN'];
const UNITS = ['pcs', 'kg', 'g', 'liter', 'ml', 'cups', 'tbsp', 'tsp', 'dozen', 'pack'];

const initialForm = {
  name: '',
  quantity: 1,
  unit: 'pcs',
  estimatedExpiry: '',
  category: '',
  dietaryType: 'VEG',
  lowThreshold: 2,
};

export default function AddItemForm({ onSubmit, editItem, onCancel, onAutoCategorizeFn }) {
  const [form, setForm] = useState(initialForm);
  const [autoLoading, setAutoLoading] = useState(false);
  const [quantityError, setQuantityError] = useState('');

  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name || '',
        quantity: editItem.quantity || 1,
        unit: editItem.unit || 'pcs',
        estimatedExpiry: editItem.estimatedExpiry || '',
        category: editItem.category || '',
        dietaryType: editItem.dietaryType || 'VEG',
        lowThreshold: editItem.lowThreshold || 2,
      });
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      const num = Number(value);
      setQuantityError(num > 1000 ? 'Quantity cannot exceed 1000' : '');
    }
    setForm((prev) => ({ ...prev, [name]: name === 'quantity' || name === 'lowThreshold' ? Number(value) : value }));
  };

  const handleAutoCategorize = async () => {
    if (!form.name.trim() || !onAutoCategorizeFn) return;
    setAutoLoading(true);
    try {
      const result = await onAutoCategorizeFn(form.name);
      if (result) {
        setForm((prev) => ({
          ...prev,
          category: result.category || prev.category,
          dietaryType: result.dietaryType || prev.dietaryType,
          storageTip: result.storageTip || prev.storageTip,
        }));
      }
    } catch (err) {
      console.error('Auto-categorize failed:', err);
    }
    setAutoLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (form.quantity > 1000) {
      setQuantityError('Quantity cannot exceed 1000');
      return;
    }
    onSubmit(form);
    if (!editItem) setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + Auto-categorize */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ingredient Name*</label>
        <div className="flex gap-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Tomatoes, Chicken breast..."
            className="input-field flex-1"
            required
          />
          <button
            type="button"
            onClick={handleAutoCategorize}
            disabled={autoLoading || !form.name.trim()}
            className="btn-secondary flex items-center gap-1.5 text-xs whitespace-nowrap disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${autoLoading ? 'animate-spin' : ''}`} />
            {autoLoading ? 'AI...' : 'Auto-fill'}
          </button>
        </div>
      </div>

      {/* Quantity + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity*</label>
          <input
            name="quantity"
            type="number"
            min="0"
            max="1000"
            step="0.5"
            value={form.quantity}
            onChange={handleChange}
            className={`input-field ${quantityError ? 'border-red-500 focus:ring-red-500' : ''}`}
            required
          />
          {quantityError && (
            <p className="text-[11px] text-red-500 mt-1">{quantityError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select name="unit" value={form.unit} onChange={handleChange} className="input-field">
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expiry Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Expiry</label>
        <input
          name="estimatedExpiry"
          type="date"
          value={form.estimatedExpiry}
          min={new Date().toISOString().split('T')[0]}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      {/* Category + Dietary Type */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            <option value="">Select...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Type</label>
          <select name="dietaryType" value={form.dietaryType} onChange={handleChange} className="input-field">
            {DIETARY_TYPES.map((d) => (
              <option key={d} value={d}>{d.replace('_', '-')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Low Stock Threshold */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Low Stock Alert Threshold
        </label>
        <input
          name="lowThreshold"
          type="number"
          min="1"
          value={form.lowThreshold}
          onChange={handleChange}
          className="input-field"
        />
        <p className="text-[11px] text-gray-500 mt-1">Alert when quantity drops below this number</p>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {editItem ? 'Update Item' : 'Add to Pantry'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}