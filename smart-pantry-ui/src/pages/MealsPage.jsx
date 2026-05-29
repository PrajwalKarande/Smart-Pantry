import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { usePantry } from '../context/PantryContext';
import { mealApi } from '../services/api';
import FilterBar from '../components/meals/FilterBar';
import MealSuggestions from '../components/meals/MealSuggestions';
import ActionPlan from '../components/meals/ActionPlan';
import Loader from '../components/common/Loader';

export default function MealsPage() {
  const {
    mealSuggestions, setMealSuggestions,
    selectedRecipe, setSelectedRecipe,
    filters, setLoading, loading, showNotification
  } = usePantry();

  const [viewMode, setViewMode] = useState('suggestions'); // 'suggestions' | 'recipe'

  // ─── Fetch meal suggestions ───
  const fetchSuggestions = async () => {
    setLoading({ meals: true });
    try {
      const response = await mealApi.getSuggestions(filters);
      setMealSuggestions(response.data);
    } catch (err) {
      showNotification('Failed to get meal suggestions', 'error');
    }
    setLoading({ meals: false });
  };

  // Re-fetch on filter change
  useEffect(() => {
    if (mealSuggestions.length > 0 || filters.dietaryType !== 'ALL' || filters.urgency !== 'ALL' || filters.mealCategory !== 'ALL') {
      // Only auto-fetch if user has already triggered once or changed filters
    }
  }, [filters]);

  // ─── View recipe action plan ───
  const handleViewRecipe = async (meal) => {
    setLoading({ recipe: true });
    try {
      const response = await mealApi.generateRecipe({
        mealName: meal.name,
        mealCategory: meal.mealCategory,
        availableIngredients: meal.availableIngredients,
      });
      setSelectedRecipe(response.data);
      setViewMode('recipe');
    } catch (err) {
      showNotification('Failed to generate recipe', 'error');
    }
    setLoading({ recipe: false });
  };

  // ─── Render ───
  if (loading.recipe) return <Loader text="Generating your 15-minute action plan..." />;

  if (viewMode === 'recipe' && selectedRecipe) {
    return (
      <ActionPlan
        recipe={selectedRecipe}
        onBack={() => setViewMode('suggestions')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {mealSuggestions.length > 0
            ? `${mealSuggestions.length} meal ideas found`
            : 'Click generate to get AI-powered meal suggestions'}
        </p>
        <button
          onClick={fetchSuggestions}
          disabled={loading.meals}
          className="btn-primary flex items-center gap-2"
        >
          {loading.meals ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading.meals ? 'Thinking...' : 'Generate Meal Ideas'}
        </button>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Meal Cards */}
      {loading.meals ? (
        <Loader text="AI is analyzing your pantry and suggesting meals..." />
      ) : (
        <MealSuggestions meals={mealSuggestions} onViewRecipe={handleViewRecipe} />
      )}
    </div>
  );
}