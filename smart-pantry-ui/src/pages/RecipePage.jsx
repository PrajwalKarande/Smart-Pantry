import React, { useState } from 'react';
import { Sparkles, Loader2, ChefHat } from 'lucide-react';
import { usePantry } from '../context/PantryContext';
import { mealApi } from '../services/api';
import ActionPlan from '../components/meals/ActionPlan';

export default function RecipePage() {
  const { pantryItems, showNotification } = usePantry();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customMeal, setCustomMeal] = useState('');

  const handleGenerateQuick = async () => {
    setLoading(true);
    try {
      const response = await mealApi.generateRecipe({
        mealName: customMeal || null,
        quickMode: true,
      });
      setRecipe(response.data);
    } catch (err) {
      showNotification('Failed to generate action plan', 'error');
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Quick Generate Section */}
      {!recipe && (
        <div className="max-w-xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">15-Minute Action Plan</h2>
          <p className="text-gray-500 text-sm mb-6">
            AI will create a quick recipe using only ingredients currently in your pantry.
            {pantryItems.length > 0
              ? ` You have ${pantryItems.length} ingredients available.`
              : ' Add items to your pantry first!'}
          </p>

          <div className="flex gap-3 justify-center mb-4">
            <input
              type="text"
              value={customMeal}
              onChange={(e) => setCustomMeal(e.target.value)}
              placeholder="Optional: request a specific dish..."
              className="input-field max-w-sm"
            />
          </div>

          <button
            onClick={handleGenerateQuick}
            disabled={loading || pantryItems.length === 0}
            className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? 'Generating...' : 'Generate Action Plan'}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Creating your personalized 15-minute recipe...</p>
          <p className="text-sm text-gray-400 mt-1">Analyzing pantry stock & optimizing for freshness</p>
        </div>
      )}

      {/* Recipe Display */}
      {recipe && !loading && (
        <ActionPlan recipe={recipe} onBack={() => setRecipe(null)} />
      )}
    </div>
  );
}