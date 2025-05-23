import axios from 'axios';

export interface QuizParams {
  category: string;
  difficulty: string;
  amount: number;
}

export interface ScoreAnswer {
  id: string;
  answer: number;
}

export const fetchCategories = () =>
  axios.get<{ id: string; name: string }[]>('/api/categories')
       .then(res => res.data);

export const fetchQuizQuestions = (params: QuizParams) =>
  axios.get<any[]>('/api/quiz', { params }).then(res => res.data);

export const submitScore = (answers: ScoreAnswer[]) =>
  axios.post<any>('/api/quiz/score', { answers }).then(res => res.data);
