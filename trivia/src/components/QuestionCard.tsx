import React from 'react';
import type { Question } from '../features/quiz/quizSlice';

interface Props {
  q: Question;
  selected?: number;
  onSelect: (id: string, idx: number) => void;
}

// export default function QuestionCard({ q, selected, onSelect }: Props) {
//   return (
//     <div className="question-card">
//       <h3 dangerouslySetInnerHTML={{ __html: q.question }} />
//       <ul>
//         {q.options.map((opt, i) => (
//           <li key={i}>
//             <button
//               className={selected===i ? 'selected' : ''}
//               onClick={() => onSelect(q.id, i)}
//               dangerouslySetInnerHTML={{ __html: opt }}
//             />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
export default function QuestionCard({ q, selected, onSelect }: Props) {
  return (
    <div className="question-card">
      <h3 dangerouslySetInnerHTML={{ __html: q.question }} />
      <ul>
        {q.options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"                                // ← ensure it’s not treated as a form “submit”
              className={selected === i ? 'selected' : ''}
              disabled={selected !== undefined}
              onClick={() => {
                console.log('Option clicked:', q.id, i);  // ← debug
                onSelect(q.id, i);
              }}
              dangerouslySetInnerHTML={{ __html: opt }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}