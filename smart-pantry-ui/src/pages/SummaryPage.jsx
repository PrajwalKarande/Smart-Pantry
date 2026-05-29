import React, { useState } from 'react';
import { usePantry } from '../context/PantryContext';
import { mealApi } from '../services/api';
import WeeklySummary from '../components/summary/WeeklySummary';

export default function SummaryPage() {
  const { weeklySummary, setWeeklySummary, showNotification } = usePantry();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await mealApi.getWeeklySummary();
      setWeeklySummary(response.data);
    } catch (err) {
      showNotification('Failed to generate weekly summary', 'error');
    }
    setLoading(false);
  };

  return (
    <WeeklySummary
      summary={weeklySummary}
      loading={loading}
      onGenerate={handleGenerate}
    />
  );
}