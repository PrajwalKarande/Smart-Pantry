import React from 'react';
import { Clock, ChefHat, CheckCircle2, AlertCircle, ArrowLeft, Printer } from 'lucide-react';
import Badge from '../common/Badge';

export default function ActionPlan({ recipe, onBack }) {
  if (!recipe) {
    return (
      <div className="text-center py-16">
        <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Select a meal to view the 15-minute action plan</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to suggestions
        </button>
      )}

      {/* Header Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="green">{recipe.mealCategory}</Badge>
              <Badge variant="purple">{recipe.dietaryType}</Badge>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{recipe.name}</h2>
            {recipe.description && (
              <p className="text-gray-600 mt-1">{recipe.description}</p>
            )}
          </div>
          <button className="btn-secondary flex items-center gap-2 text-xs">
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{recipe.cookingTime || 15} minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-primary-500" />
            <span>{recipe.difficulty || 'Easy'}</span>
          </div>
        </div>
      </div>

      {/* Ingredients Needed */}
      <div className="card p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🧾 Ingredients</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipe.ingredients?.map((ing, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-2.5 rounded-lg ${
                ing.available !== false ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              {ing.available !== false ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              )}
              <span className={`text-sm ${ing.available !== false ? 'text-green-700' : 'text-red-600'}`}>
                {ing.quantity && `${ing.quantity} `}{ing.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Action Plan */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⏱️ 15-Minute Action Plan</h3>
        <div className="space-y-4">
          {recipe.steps?.map((step, i) => (
            <div key={i} className="flex gap-4">
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                {i < recipe.steps.length - 1 && (
                  <div className="w-0.5 h-full bg-primary-100 mx-auto mt-1" />
                )}
              </div>
              {/* Step Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  {step.timeMinutes && (
                    <span className="text-[11px] bg-primary-50 text-primary-600 font-medium px-2 py-0.5 rounded-full">
                      {step.timeMinutes} min
                    </span>
                  )}
                  {step.title && (
                    <span className="text-sm font-semibold text-gray-700">{step.title}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step.instruction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}