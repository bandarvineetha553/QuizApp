import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesSlice';
import quizReducer       from '../features/quiz/quizSlice';
import resultsReducer    from '../features/results/resultsSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    quiz:       quizReducer,
    results:    resultsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
