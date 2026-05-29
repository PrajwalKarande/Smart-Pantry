import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PantryProvider } from './context/PantryContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import PantryPage from './pages/PantryPage';
import MealsPage from './pages/MealsPage';
import RecipePage from './pages/RecipePage';
import SummaryPage from './pages/SummaryPage';

export default function App() {
  return (
    <PantryProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/pantry" element={<PantryPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/summary" element={<SummaryPage />} />
          </Routes>
        </Layout>
      </Router>
    </PantryProvider>
  );
}