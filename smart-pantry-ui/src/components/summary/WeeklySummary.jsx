import React from 'react';
import {
  CalendarDays, ShoppingCart, TrendingUp, AlertTriangle,
  ChefHat, Loader2
} from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function WeeklySummary({ summary, loading, onGenerate }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
          <p className="mt-3 text-gray-600">Generating your weekly summary...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-16">
        <EmptyState
          icon={CalendarDays}
          title="No weekly summary yet"
          description="Generate a summary based on your current pantry to plan meals and shopping."
          action={onGenerate}
          actionLabel="🧠 Generate Weekly Summary"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{summary.totalMeals || 0}</p>
              <p className="text-xs text-gray-500">Meals Possible</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{summary.totalIngredients || 0}</p>
              <p className="text-xs text-gray-500">Items in Pantry</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{summary.expiringCount || 0}</p>
              <p className="text-xs text-gray-500">Expiring Soon</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{summary.shoppingListCount || 0}</p>
              <p className="text-xs text-gray-500">Items to Buy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Meal Plan */}
      {summary.dailyPlan && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Suggested Weekly Plan</h3>
          <div className="space-y-3">
            {Object.entries(summary.dailyPlan).map(([day, meals]) => (
              <div key={day} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-20 flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-700">{day}</p>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {meals.breakfast && (
                    <div className="text-xs">
                      <span className="text-gray-500">🌅 </span>
                      <span className="text-gray-700">{meals.breakfast}</span>
                    </div>
                  )}
                  {meals.lunch && (
                    <div className="text-xs">
                      <span className="text-gray-500">☀️ </span>
                      <span className="text-gray-700">{meals.lunch}</span>
                    </div>
                  )}
                  {meals.dinner && (
                    <div className="text-xs">
                      <span className="text-gray-500">🌙 </span>
                      <span className="text-gray-700">{meals.dinner}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shopping List */}
      {summary.shoppingList && summary.shoppingList.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🛒 Suggested Shopping List</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {summary.shoppingList.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Priority */}
      {summary.usePriority && summary.usePriority.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔥 Use These First (Expiring Soon)</h3>
          <div className="flex flex-wrap gap-2">
            {summary.usePriority.map((item, i) => (
              <span key={i} className="badge-red">
                ⏰ {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button onClick={onGenerate} className="btn-secondary">
          🔄 Refresh Summary
        </button>
      </div>
    </div>
  );
}