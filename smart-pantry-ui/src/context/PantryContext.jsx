import React, { createContext, useContext, useReducer, useCallback } from 'react';

const PantryContext = createContext();

// ─── Initial State ───
const initialState = {
  pantryItems: [],
  mealSuggestions: [],
  weeklySummary: null,
  selectedRecipe: null,
  filters: {
    dietaryType: 'ALL',    // ALL, VEG, NON_VEG, VEGAN
    urgency: 'ALL',        // ALL, USE_SOON, STABLE
    mealCategory: 'ALL',   // ALL, BREAKFAST, LUNCH, DINNER, SNACK
  },
  loading: {
    pantry: false,
    meals: false,
    recipe: false,
    summary: false,
    upload: false,
    ai: false,
  },
  error: null,
  notification: null,
};

// ─── Action Types ───
const ACTIONS = {
  SET_PANTRY_ITEMS: 'SET_PANTRY_ITEMS',
  ADD_PANTRY_ITEM: 'ADD_PANTRY_ITEM',
  UPDATE_PANTRY_ITEM: 'UPDATE_PANTRY_ITEM',
  REMOVE_PANTRY_ITEM: 'REMOVE_PANTRY_ITEM',
  SET_MEAL_SUGGESTIONS: 'SET_MEAL_SUGGESTIONS',
  SET_WEEKLY_SUMMARY: 'SET_WEEKLY_SUMMARY',
  SET_SELECTED_RECIPE: 'SET_SELECTED_RECIPE',
  SET_FILTERS: 'SET_FILTERS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
};

// ─── Reducer ───
function pantryReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PANTRY_ITEMS:
      return { ...state, pantryItems: action.payload };

    case ACTIONS.ADD_PANTRY_ITEM:
      return { ...state, pantryItems: [...state.pantryItems, action.payload] };

    case ACTIONS.UPDATE_PANTRY_ITEM:
      return {
        ...state,
        pantryItems: state.pantryItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case ACTIONS.REMOVE_PANTRY_ITEM:
      return {
        ...state,
        pantryItems: state.pantryItems.filter(item => item.id !== action.payload),
      };

    case ACTIONS.SET_MEAL_SUGGESTIONS:
      return { ...state, mealSuggestions: action.payload };

    case ACTIONS.SET_WEEKLY_SUMMARY:
      return { ...state, weeklySummary: action.payload };

    case ACTIONS.SET_SELECTED_RECIPE:
      return { ...state, selectedRecipe: action.payload };

    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case ACTIONS.SET_LOADING:
      return { ...state, loading: { ...state.loading, ...action.payload } };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.SET_NOTIFICATION:
      return { ...state, notification: action.payload };

    case ACTIONS.CLEAR_NOTIFICATION:
      return { ...state, notification: null };

    default:
      return state;
  }
}

// ─── Provider ───
export function PantryProvider({ children }) {
  const [state, dispatch] = useReducer(pantryReducer, initialState);

  // ── Pantry Actions ──
  const setPantryItems = useCallback((items) => {
    dispatch({ type: ACTIONS.SET_PANTRY_ITEMS, payload: items });
  }, []);

  const addPantryItem = useCallback((item) => {
    dispatch({ type: ACTIONS.ADD_PANTRY_ITEM, payload: item });
  }, []);

  const updatePantryItem = useCallback((item) => {
    dispatch({ type: ACTIONS.UPDATE_PANTRY_ITEM, payload: item });
  }, []);

  const removePantryItem = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_PANTRY_ITEM, payload: id });
  }, []);

  // ── Meal Actions ──
  const setMealSuggestions = useCallback((meals) => {
    dispatch({ type: ACTIONS.SET_MEAL_SUGGESTIONS, payload: meals });
  }, []);

  const setWeeklySummary = useCallback((summary) => {
    dispatch({ type: ACTIONS.SET_WEEKLY_SUMMARY, payload: summary });
  }, []);

  const setSelectedRecipe = useCallback((recipe) => {
    dispatch({ type: ACTIONS.SET_SELECTED_RECIPE, payload: recipe });
  }, []);

  // ── Filter Actions ──
  const setFilters = useCallback((filters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
  }, []);

  // ── UI Actions ──
  const setLoading = useCallback((loadingState) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loadingState });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { message, type } });
    setTimeout(() => dispatch({ type: ACTIONS.CLEAR_NOTIFICATION }), 4000);
  }, []);

  // ── Computed values ──
  const lowStockItems = state.pantryItems.filter(
    item => item.quantity <= (item.lowThreshold || 2)
  );

  const expiringItems = state.pantryItems.filter(item => {
    if (!item.estimatedExpiry) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(item.estimatedExpiry) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
  });

  const expiredItems = state.pantryItems.filter(item => {
    if (!item.estimatedExpiry) return false;
    return new Date(item.estimatedExpiry) < new Date();
  });

  const value = {
    ...state,
    // Actions
    setPantryItems,
    addPantryItem,
    updatePantryItem,
    removePantryItem,
    setMealSuggestions,
    setWeeklySummary,
    setSelectedRecipe,
    setFilters,
    setLoading,
    setError,
    showNotification,
    // Computed
    lowStockItems,
    expiringItems,
    expiredItems,
  };

  return (
    <PantryContext.Provider value={value}>
      {children}
    </PantryContext.Provider>
  );
}

// ─── Hook ───
export function usePantry() {
  const context = useContext(PantryContext);
  if (!context) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return context;
}