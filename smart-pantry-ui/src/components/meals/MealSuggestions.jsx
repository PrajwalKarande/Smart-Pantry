import React from 'react';
import RecipeCard from './RecipeCard';
import EmptyState from '../common/EmptyState';
import { UtensilsCrossed } from 'lucide-react';

export default function MealSuggestions({ meals, onViewRecipe }) {
  if (!meals || meals.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="No meal suggestions yet"
        description="Add ingredients to your pantry first, then AI will suggest meals you can cook."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {meals.map((meal, index) => (
        <RecipeCard key={meal.id || index} meal={meal} onViewRecipe={onViewRecipe} />
      ))}
    </div>
  );
}