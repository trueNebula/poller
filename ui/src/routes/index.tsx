import { Question } from '@/components/Question';
import { useWs } from '@/components/WSContext';
import type { Message, QuestionMessage, Question as QuestionType } from '@/lib/types';
import { MESSAGE_TYPES } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router'
import {  useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

// const DEFAULT: QuestionType = {
//   id: -1,
//   title: "Is this correct? Idk lets find out! I'm just rambling here to see how this long ass text will fit.",
//   answers: [
//     {
//       id: 0,
//       title: "No",
//       isCorrect: false,
//     },
//     {
//       id: 1,
//       title: "Not",
//       isCorrect: false,
//     },
//     {
//       id: 2,
//       title: "Yes",
//       isCorrect: true,
//     },
//     {
//       id: 3,
//       title: "Maybe",
//       isCorrect: false,
//     },
//   ],
// }

function App() {
  const [questionData, setQuestionData] = useState<QuestionType | null>(null);
  const {lastJsonMessage} = useWs();

  useEffect(() => {
    const ls = window.localStorage.getItem('lastQuestion');

    if (ls) {
      setQuestionData(JSON.parse(ls));
    }
  }, []);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      switch ((lastJsonMessage as Message).type) {
        case MESSAGE_TYPES.question:
          window.localStorage.setItem('lastQuestion', JSON.stringify((lastJsonMessage as QuestionMessage).question));
          setQuestionData((lastJsonMessage as QuestionMessage).question);
          break;
        case MESSAGE_TYPES.end:
          setQuestionData(null);
          break;
      }
    }
  }, [lastJsonMessage]);

  const getSpinner = () => {
    const rand = Math.floor(Math.random() * 2);
    if (rand) {
      return <span className='loader'></span>
    }
    return <span className='loader2'></span>
  }

  return (
    <div className="text-center min-h-screen flex flex-col items-center justify-center bg-background text-white gap-4">
      {!questionData && <span>You're in, let's wait for a question to start.</span>}
      {!questionData ? getSpinner() : <Question id={questionData.id} title={questionData.title} answers={questionData.answers} />}
    </div>
  )
}
