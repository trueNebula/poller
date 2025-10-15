import { CreateQuestionCard } from '@/components/CreateQuestionCard'
import { QuestionCard } from '@/components/QuestionCard'
import { Button } from '@/components/ui/button'
import { useWs } from '@/components/WSContext'
import type { Answer, EndMessage, Question } from '@/lib/types'
import { MESSAGE_TYPES } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

const DEFAULT: Question = {
  id: -1,
  title: "Second question!",
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

function RouteComponent() {
  const [sentQuestion, setSentQuestion] = useState<Question | null>(
    localStorage.getItem('sent') ? JSON.parse(localStorage.getItem('sent')!) : null
  );
  const [createdQuestions, setCreatedQuestions] = useState<Question[]>([]);
  const { sendJsonMessage } = useWs();

  const handleCreate = () => {
    const newQuestion = {
      id: createdQuestions.length,
      title: '',
      answers: [
        {id: 0, title: '', isCorrect: false},
        {id: 1, title: '', isCorrect: false},
        {id: 2, title: '', isCorrect: false},
        {id: 3, title: '', isCorrect: false}
      ],
    };

    setCreatedQuestions(
      (prev) => prev.concat(newQuestion)
    );
  }

  const handleEnd = () => {
    const message: EndMessage = {
      type: MESSAGE_TYPES.end,
    }

    localStorage.removeItem('sent');
    setSentQuestion(null);
    sendJsonMessage(message);
  }

  const handleReveal = () => {
    const message: EndMessage = {
      type: MESSAGE_TYPES.reveal,
    }

    sendJsonMessage(message);
  }

  const handleSendQuestion = (id: number, title: string, answers: Answer[]) => {
    setCreatedQuestions((prev) => prev.filter((question) => question.id !== id));
    const newQuestion = {
      id,
      title,
      answers,
    };
    localStorage.setItem('sent', JSON.stringify(newQuestion));
    setSentQuestion(newQuestion);
  }

  return <div className='p-16 text-center min-h-screen flex flex-row gap-16 items-start justify-center bg-background text-white'>
    <div className='flex flex-col flex-1 h-full gap-8'>
      <Button variant="outline" className='shadow-lg shadow-shadow/50' onClick={handleCreate}>
        Add New Question
      </Button>
      <div className='flex flex-col gap-8'>
        {createdQuestions.map((question) => (
          <CreateQuestionCard
            cb={handleSendQuestion}
            id={question.id}
            title={question.title}
            answers={question.answers}
            key={question.id}
          />
        ))}
      </div>
    </div>
    <div className='flex flex-col flex-1 h-full gap-8'>
      <Button variant="outline" className='shadow-lg shadow-shadow/50' onClick={handleEnd}>
        End Current Round
      </Button>
      {sentQuestion !== null && (
        <div className='flex flex-row gap-16 w-full justify-center items-center'>
          <QuestionCard id={sentQuestion.id} title={sentQuestion.title} answers={sentQuestion.answers}/>
          <Button size='icon-lg' variant='outline' onClick={handleReveal}>🔔</Button>
        </div>
      )}
    </div>
  </div>
}
