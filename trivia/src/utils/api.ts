import axios from 'axios';

export interface QuizParams {
  category: string;
  difficulty: string;
  amount: number;
}

// Use a map for answers payload
export type ScorePayload = Record<string, number>;

export const fetchCategories = () =>
  axios
    .get<{ id: string; name: string }[]>('/api/categories')
    .then((res) => res.data);

export const fetchQuizQuestions = (params: QuizParams) =>
  axios.get<any[]>('/api/quiz', { params }).then((res) => res.data);

export const submitScore = (answers: ScorePayload) =>
  axios
    .post<{ correct: number; total: number }>('/api/quiz/score', { answers })
    .then((res) => res.data);
