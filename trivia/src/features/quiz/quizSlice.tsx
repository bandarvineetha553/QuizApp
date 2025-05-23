// src/features/quiz/quizSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import type { QuizParams } from '../../utils/api';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizState {
  stage: 'select' | 'quiz' | 'results';
  meta: QuizParams;
  questions: Question[];
  answers: Record<string, number>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuizState = {
  stage: 'select',
  meta: { category: '', difficulty: 'easy', amount: 5 },
  questions: [],
  answers: {},
  status: 'idle',
  error: null,
};

// helper: retry/backoff for 429
async function fetchWithRetry(
  params: Record<string, any>,
  retries = 3,
  delay = 1000
): Promise<AxiosResponse<any>> {
  try {
    return await axios.get('https://opentdb.com/api.php', { params });
  } catch (err: any) {
    if (err.response?.status === 429 && retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(params, retries - 1, delay * 2);
    }
    throw err;
  }
}

export const loadQuestions = createAsyncThunk<Question[], QuizParams>(
  'quiz/loadQuestions',
  async ({ category, difficulty, amount }) => {
    const params = { amount, category, difficulty, type: 'multiple' };
    const response = await fetchWithRetry(params);
    const data = response.data;
    if (data.response_code !== 0) {
      throw new Error('No questions available for that selection');
    }
    return data.results.map((item: any) => {
      const opts = [...item.incorrect_answers];
      const correctIndex = Math.floor(Math.random() * (opts.length + 1));
      opts.splice(correctIndex, 0, item.correct_answer);
      return {
        id: `${item.question}-${category}-${difficulty}`,
        question: item.question,
        options: opts,
        correctIndex,
      };
    });
  }
);

const slice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz(state, action: PayloadAction<QuizParams>) {
      state.stage = 'quiz';
      state.meta = action.payload;
      state.questions = [];
      state.answers = {};
      state.status = 'idle';
      state.error = null;
    },
    selectAnswer(state, action: PayloadAction<{ id: string; answerIndex: number }>) {
      state.answers[action.payload.id] = action.payload.answerIndex;
    },
    enterResults(state) {
      state.stage = 'results';
    },
    resetQuiz(state) {
      state.stage = 'select';
      state.meta = { category: '', difficulty: 'easy', amount: 5 };
      state.questions = [];
      state.answers = {};
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadQuestions.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(loadQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load questions';
      });
  },
});

export const { startQuiz, selectAnswer, enterResults, resetQuiz } = slice.actions;
export default slice.reducer;
