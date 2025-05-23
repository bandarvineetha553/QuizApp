// import React from 'react';
// import { useNavigate }    from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { resetResults }   from './resultsSlice';
// // remove startQuiz import

// export default function Results() {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const data     = useAppSelector(s => s.results.data);

//   if (!data) return null;

//   return (
//     <div className="results-container">
      
//       <button
//         type="button"
//         onClick={() => {
//           dispatch(resetResults());  // clear old results
//           navigate('/', { replace: true });
//         }}
//       >
//         Start New Quiz
//       </button>
//     </div>
//   );
// }

// src/features/results/Results.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetResults } from './resultsSlice';

export default function Results() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const data     = useAppSelector((s) => s.results.data);

  // If we somehow landed here with no data, go home
  if (!data) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="results-container">
      <h2>
        Your Score: {data.score}/{data.total}
      </h2>

      {data.details.map((q) => (
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

      <button
        type="button"
        onClick={() => {
          // Clear out the old results so next time it's blank
          dispatch(resetResults());
          // And navigate back to the selector
          navigate('/', { replace: true });
        }}
      >
        Start New Quiz
      </button>
    </div>
  );
}

