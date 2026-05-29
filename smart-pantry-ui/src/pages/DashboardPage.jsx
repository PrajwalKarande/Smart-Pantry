import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Refrigerator, UtensilsCrossed, AlertTriangle, Clock,
  TrendingUp, Plus, Sparkles, ArrowRight
} from 'lucide-react';
import { usePantry } from '../context/PantryContext';
import { pantryApi, mealApi } from '../services/api';
import LowStockBanner from '../components/pantry/LowStockBanner';
import Loader from '../components/common/Loader';

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    pantryItems, setPantryItems, setLoading, loading,
    expiringItems, lowStockItems, expiredItems, showNotification
  } = usePantry();

  const [quickStats, setQuickStats] = useState({
    totalItems: 0,
    categories: 0,
    mealsAvailable: 0,
  });

  // ─── Load pantry items on mount ───
  useEffect(() => {
    loadPantryItems();
  }, []);

  const loadPantryItems = async () => {
    setLoading({ pantry: true });
    try {
      const response = await pantryApi.getAll();
      setPantryItems(response.data);
      setQuickStats({
        totalItems: response.data.length,
        categories: new Set(response.data.map(i => i.category)).size,
        mealsAvailable: '...',
      });
    } catch (err) {
      showNotification('Failed to load pantry items', 'error');
    }
    setLoading({ pantry: false });
  };

  if (loading.pantry) return <Loader text="Loading your pantry..." />;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">Welcome to SmartPantry! 👋</h2>
        <p className="text-primary-100 text-sm">
          Your AI-powered kitchen assistant. Manage ingredients, get meal ideas, and minimize waste.
        </p>
        <div className="flex gap-3 mt-4">
          <button onClick={() => navigate('/pantry')} className="bg-white text-primary-700 font-medium py-2 px-4 rounded-xl text-sm hover:bg-primary-50 transition-colors">
            <Plus className="w-4 h-4 inline mr-1.5" />
            Add Ingredients
          </button>
          <button onClick={() => navigate('/meals')} className="bg-primary-500 text-white font-medium py-2 px-4 rounded-xl text-sm hover:bg-primary-400 transition-colors">
            <Sparkles className="w-4 h-4 inline mr-1.5" />
            Get AI Suggestions
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      <LowStockBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{pantryItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <Refrigerator className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{expiringItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{lowStockItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {new Set(pantryItems.map(i => i.category).filter(Boolean)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/pantry')}
          className="card p-5 text-left hover:border-primary-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">📦 Manage Pantry</h3>
              <p className="text-xs text-gray-500">Add, edit or remove ingredients</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => navigate('/meals')}
          className="card p-5 text-left hover:border-primary-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">🍽️ AI Meal Ideas</h3>
              <p className="text-xs text-gray-500">Get recipes based on your stock</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => navigate('/summary')}
          className="card p-5 text-left hover:border-primary-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">📅 Weekly Plan</h3>
              <p className="text-xs text-gray-500">View summary & shopping list</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </button>
      </div>

      {/* Recent / Expiring Items */}
      {expiringItems.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">⏰ Use These Soon</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {expiringItems.slice(0, 8).map((item) => (
              <div key={item.id} className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                <p className="text-[11px] text-amber-600 mt-1">
                  Expires: {new Date(item.estimatedExpiry).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}