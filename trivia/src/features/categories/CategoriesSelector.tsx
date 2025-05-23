import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCategories } from './categoriesSlice';
import { startQuiz, loadQuestions }      from '../quiz/quizSlice';
import type { RootState, AppDispatch } from '../../app/store';
import { useNavigate } from 'react-router-dom';

export default function CategoriesSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list, status, error } = useSelector((s: RootState) => s.categories);
  const [category, setCategory]     = useState('');
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('easy');
  const [amount, setAmount]         = useState(5);
   const handleStart = () => {
    const params = { category, difficulty, amount };
    dispatch(startQuiz(params));
    dispatch(loadQuestions(params));
    navigate('/quiz');
  };
  useEffect(() => { dispatch(loadCategories()); }, [dispatch]);

  return (
    <div>
      <h2>Select Category & Difficulty</h2>
      {status==='loading' && <p>Loading…</p>}
      {error && <p>Error: {error}</p>}
      {status==='succeeded' && (
        <>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}>
            <option value="">-- Choose --</option>
            {list.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <div>
            {(['easy','medium','hard'] as const).map(d => (
              <label key={d}>
                <input
                  type="radio"
                  value={d}
                  checked={difficulty===d}
                  onChange={() => setDifficulty(d)}
                /> {d.charAt(0).toUpperCase()+d.slice(1)}
              </label>
            ))}
          </div>

          <div>
            <label>Number of Questions:</label>
            <input
              type="number"
              min={1} max={20}
              value={amount}
              onChange={e => setAmount(+e.target.value)}
            />
          </div>

          <button
            onClick={handleStart} disabled={!category}
          >
            Start Quiz
          </button>
        </>
      )}
    </div>
  );
}
