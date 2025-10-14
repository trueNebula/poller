import { Question } from '@/components/Question';
import type { Question as QuestionType } from '@/lib/types';
import { MESSAGE_TYPES, SOCKET_URL } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket';

export const Route = createFileRoute('/')({
  component: App,
})

const DEFAULT: QuestionType = {
  id: -1,
  title: "Is this correct? Idk lets find out! I'm just rambling here to see how this long ass text will fit.",
  answers: [
    {
      id: 0,
      title: "No",
      isCorrect: false,
    },
    {
      id: 1,
      title: "Not",
      isCorrect: false,
    },
    {
      id: 2,
      title: "Yes",
      isCorrect: true,
    },
    {
      id: 3,
      title: "Maybe",
      isCorrect: false,
    },
  ],
}


function App() {
  const [questionData, setQuestionData] = useState<QuestionType | null>(null);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const {sendJsonMessage, lastMessage} = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log('connected'),
    onClose: () => console.log('disconnected'),
    onError: (err) => console.error('error:', err),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleSend = useCallback(() => sendJsonMessage({type: MESSAGE_TYPES.reveal}), []);

  useEffect(() => {
    setTimeout(() => setQuestionData(DEFAULT), 1 * 1000);
  }, []);

  const getSpinner = () => {
    const rand = Math.floor(Math.random() * 2);
    if (rand) {
      return <span className='loader'></span>
    }
    return <span className='loader2'></span>
  }

  return (
    <div className="text-center min-h-screen flex flex-col items-center justify-center bg-background text-white">
      {!questionData ? getSpinner() : <Question id={questionData.id} title={questionData.title} answers={questionData.answers} />}
      <button onClick={handleSend}>reveal</button>
    </div>
  )
}
