import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchQuizQuestions, QuizParams } from '../../utils/api';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizState {
  stage: 'select'|'quiz'|'results';
  meta: QuizParams;
  questions: Question[];
  answers: Record<string, number>;
  status: 'idle'|'loading'|'succeeded'|'failed';
  error: string | null;
}

const initialState: QuizState = {
  stage: 'select',
  meta: { category:'', difficulty:'easy', amount:5 },
  questions: [],
  answers: {},
  status: 'idle',
  error: null,
};

export const loadQuestions = createAsyncThunk<
  Question[],          // ← this is the **return** type
  QuizParams >(
  'quiz/loadQuestions',
  async (params) => {return await fetchQuizQuestions(params);}
);

const slice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz(state, action: PayloadAction<QuizParams>) {
      state.stage     = 'quiz';
      state.meta      = action.payload;
      state.questions = [];
      state.answers   = {};
      state.status    = 'idle';
    },
    selectAnswer(state, action: PayloadAction<{ id:string; answerIndex:number }>) {
      state.answers[action.payload.id] = action.payload.answerIndex;
    },
    enterResults(state) {
      state.stage = 'results';
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadQuestions.pending, state => { state.status = 'loading'; })
      .addCase(loadQuestions.fulfilled, (state, action) => {
        state.status    = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(loadQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error  = action.error.message || null;
      });
  },
});

export const { startQuiz, selectAnswer, enterResults } = slice.actions;
export default slice.reducer;
