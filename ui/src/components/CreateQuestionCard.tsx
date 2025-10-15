import { Button } from "@/components/ui/button";
import { useWs } from "@/components/WSContext";
import type { Answer, Question, QuestionMessage } from "@/lib/types";
import { MESSAGE_TYPES } from "@/lib/utils";
import React, { useState } from "react";

interface CreateQuestionCardType {
  cb: (id: number, title: string, answers: Answer[]) => void
}

export function CreateQuestionCard({ cb, id, title: titleDefault, answers: answersDefault }: Question & CreateQuestionCardType) {
  const [title, setTitle] = useState(titleDefault);
  const [answers, setAnswers] = useState<Answer[]>(answersDefault);
  const {sendJsonMessage} = useWs();

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleAnswer = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    setAnswers(answers.map((answer, index) => {
      if (idx !== index) {
        return answer;
      }
      return {
        ...answer,
        title: e.target.value,
      }
    }))
  }

  const handleAnswerTruth = (idx: number) => {
    setAnswers(answers.map((answer, index) => {
      if (idx !== index) {
        return answer;
      }
      return {
        ...answer,
        isCorrect: !answer.isCorrect,
      }
    }))
  }

  const handleCreate = () => {
    if (title === '' || answers.length === 0) {
      return;
    }

    answers.forEach((answer) => {
      if (answer.title === '') {
        return;
      }
    })

    const message: QuestionMessage = {
      type: MESSAGE_TYPES.question,
      question: {
        id,
        title,
        answers,
      }
    };

    cb(id, title, answers);
    sendJsonMessage(message);
  }

  return (
    <div className='flex flex-row gap-16 w-full justify-center items-center'>
      <div className="w-[calc(100%-40px)] min-h-[358px] md:max-w-160 bg-card rounded-4xl flex flex-col items-center justify-between shadow-lg shadow-shadow/50 inset-shadow-2xs inset-shadow-glare/50">
        <input className="text-center w-full text-3xl font-bold p-8 rounded-t-4xl" onChange={handleTitle} value={title}/>
        <div className="flex flex-col items-center justify-center flex-1 w-full h-full text-center border-t-2 border-background ">
          {answers.map((answer, idx) => (
            <div className={`flex flex-row justify-between items-center w-full border-b-2 border-background ${idx === answers.length - 1 && 'rounded-b-4xl'} px-4 ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`} key={idx}>
              <input
                className="text-center min-h-16 flex-1 w-full place-content-center transition duration-500 py-3 text-xl pr-8"
                key={idx}
                value={answer.title}
                onChange={(e) => handleAnswer(e, idx)}
              />
              <Button variant='outline' onClick={() => handleAnswerTruth(idx)}>Swap Truth</Button>
            </div>
          ))}
        </div>
      </div>
    <Button size='icon-lg' variant='outline' onClick={handleCreate}>✓</Button>
    </div>
  )

}