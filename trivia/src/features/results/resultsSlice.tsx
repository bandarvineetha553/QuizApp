import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ResultsData {
  score: number;
  total: number;
  details: Array<{
    id: string;
    question: string;
    options: string[];
    selected: number;
    correctIndex: number;
    correct: boolean;
  }>;
  meta: any;
}

interface ResultsState { data: ResultsData | null; }

const slice = createSlice({
  name: 'results',
  initialState: { data: null } as ResultsState,
  reducers: {
    showResults(state, action: PayloadAction<ResultsData>) {
      state.data = action.payload;
    },
    resetResults(state) {
      state.data = null;
    }
  }
});

export const { showResults, resetResults } = slice.actions;
export default slice.reducer;
