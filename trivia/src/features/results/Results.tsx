// src/features/results/Results.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { resetQuiz } from '../quiz/quizSlice';
import type { RootState } from '../../app/store';

export default function Results() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Get details array from results slice
  const { details } = useAppSelector((state: RootState) => state.results);

  // Compute score and total directly from details
  const total = details.length;
  const score = details.filter((d) => d.correct).length;

  const handleNewQuiz = () => {
    dispatch(resetQuiz());
    navigate('/');
  };

  return (
    <div>
      <h2>Your Score: {score}/{total}</h2>

      <div className="results-list">
        {details.map((q) => (
          <div key={q.id} className="result-card">
            <p dangerouslySetInnerHTML={{ __html: q.question }} />
            <p>
              You answered:{' '}
              <span
                className={q.correct ? 'correct' : 'incorrect'}
                dangerouslySetInnerHTML={{ __html: q.options[q.selected] }}
              />
            </p>
            {!q.correct && (
              <p>
                Correct answer:{' '}
                <span
                  className="correct"
                  dangerouslySetInnerHTML={{
                    __html: q.options[q.correctIndex],
                  }}
                />
              </p>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleNewQuiz} className="start-new-quiz-btn">
        Start New Quiz
      </button>
    </div>
  );
}
