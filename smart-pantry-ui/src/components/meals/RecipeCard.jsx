import React from 'react';
import { Clock, Users, ChefHat, AlertCircle, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';

export default function RecipeCard({ meal, onViewRecipe }) {
  const categoryColors = {
    BREAKFAST: 'bg-amber-50 text-amber-700 border-amber-200',
    LUNCH: 'bg-blue-50 text-blue-700 border-blue-200',
    DINNER: 'bg-purple-50 text-purple-700 border-purple-200',
    SNACK: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <div className="card p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
              categoryColors[meal.mealCategory] || 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              {meal.mealCategory}
            </span>
            {meal.dietaryType && (
              <Badge variant={meal.dietaryType === 'VEG' ? 'green' : meal.dietaryType === 'VEGAN' ? 'purple' : 'red'}>
                {meal.dietaryType}
              </Badge>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-800 mt-2">{meal.name}</h3>
        </div>
      </div>

      {/* Description */}
      {meal.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meal.description}</p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{meal.cookingTime || 15} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{meal.servings || 2} servings</span>
        </div>
        <div className="flex items-center gap-1">
          <ChefHat className="w-3.5 h-3.5" />
          <span>{meal.difficulty || 'Easy'}</span>
        </div>
      </div>

      {/* Ingredients Status */}
      <div className="mb-4 flex-1">
        <p className="text-xs font-medium text-gray-500 mb-2">Ingredients:</p>
        <div className="flex flex-wrap gap-1.5">
          {meal.availableIngredients?.map((ing, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> {ing}
            </span>
          ))}
          {meal.missingIngredients?.map((ing, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" /> {ing}
            </span>
          ))}
        </div>
      </div>

      {/* Match Score */}
      {meal.matchScore !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Ingredient Match</span>
            <span className="font-semibold text-primary-700">{meal.matchScore}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                meal.matchScore >= 80 ? 'bg-green-500' : meal.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-400'
              }`}
              style={{ width: `${meal.matchScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Action */}
      <button
        onClick={() => onViewRecipe(meal)}
        className="btn-primary w-full flex items-center justify-center gap-2 text-sm mt-auto"
      >
        <ChefHat className="w-4 h-4" />
        View 15-Min Action Plan
      </button>
    </div>
  );
}