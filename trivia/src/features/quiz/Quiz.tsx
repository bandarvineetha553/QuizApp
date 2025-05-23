// src/features/quiz/Quiz.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  loadQuestions,
  selectAnswer,
  enterResults,
} from './quizSlice';
import { submitScore } from '../../utils/api';
import QuestionCard from '../../components/QuestionCard';
import { showResults, ResultsData } from '../results/resultsSlice';

export default function Quiz() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { meta, questions, answers, status, error } =
    useAppSelector((s) => s.quiz);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (meta.category) {
      dispatch(loadQuestions(meta));
    }
  }, [dispatch, meta]);

  if (status === 'loading') return <p>Loading questions…</p>;
  if (status === 'failed')  return <p>Error loading questions: {error}</p>;

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);

    try {
      const { correct, total } = await submitScore(answers);

      // prepare detailed results by combining question data and user's answers
      const details = questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        selected: answers[q.id]!,          // user's selected index
        correctIndex: q.correctIndex,
        correct: answers[q.id] === q.correctIndex,
      }));

      const resultsPayload: ResultsData = {
        score: correct,
        total,
        details,
        meta,
      };

      // dispatch results and navigate
      dispatch(showResults(resultsPayload));
      dispatch(enterResults());
      navigate('/result');
    } catch (err: any) {
      console.error('Submit failed:', err);
      alert(
        `Submission failed: ${
          err.response?.data?.error || err.message || 'Server error'
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          q={q}
          selected={answers[q.id]}
          onSelect={(id, idx) => dispatch(selectAnswer({ id, answerIndex: idx }))}
        />
      ))}

      <button disabled={!allAnswered || submitting} onClick={handleSubmit}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
