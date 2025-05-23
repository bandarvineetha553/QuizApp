// src/features/results/resultsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { QuizParams } from '../../utils/api';

export interface ResultDetail {
  id: string;
  question: string;
  options: string[];
  selected: number;
  correctIndex: number;
  correct: boolean;
}

export interface ResultsData {
  score: number;
  total: number;
  details: ResultDetail[];
  meta: QuizParams;
}

const initialState: ResultsData = {
  score: 0,
  total: 0,
  details: [],
  meta: { category: '', difficulty: 'easy', amount: 5 },
};

const slice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    showResults(state, action: PayloadAction<ResultsData>) {
      state.score   = action.payload.score;
      state.total   = action.payload.total;
      state.details = action.payload.details;
      state.meta    = action.payload.meta;
    },
  },
});

export const { showResults } = slice.actions;
export default slice.reducer;
