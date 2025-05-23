// src/features/quiz/Quiz.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  loadQuestions,
  selectAnswer,
  enterResults
} from './quizSlice';
import { submitScore } from '../../utils/api';
import QuestionCard   from '../../components/QuestionCard';
import { showResults } from '../results/resultsSlice';

export default function Quiz() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { meta, questions, answers, status, error } =
    useAppSelector((s) => s.quiz);
  
  useEffect(() => {
    if (meta.category) {
      dispatch(loadQuestions(meta));
    }
  }, [dispatch, meta]);

  if (status === 'loading') return <p>Loading questions…</p>;
  if (error)          return <p>Error: {error}</p>;

  const allAnswered = questions.length > 0 &&
    questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    const result = await submitScore(
      Object.entries(answers).map(([id, ans]) => ({ id, answer: ans }))
    );
    dispatch(showResults(result));   // <-- use `result`
    dispatch(enterResults());
    navigate('/result');
  };

  return (
    <div>
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          q={q}
          selected={answers[q.id]}
          onSelect={(id, idx) =>{
            dispatch(selectAnswer({ id, answerIndex: idx }))
            console.log(answers);}
          }
          
        />
      ))}

      <button disabled={!allAnswered} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
