import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CategoriesSelector from './features/categories/CategoriesSelector';
import Quiz               from './features/quiz/Quiz';
import Results            from './features/results/Results';

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/"       element={<CategoriesSelector />} />
        <Route path="/quiz"   element={<Quiz />} />
        <Route path="/result" element={<Results />} />
        <Route path="*"       element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
