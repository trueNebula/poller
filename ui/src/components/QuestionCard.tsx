import { useWs } from "@/components/WSContext";
import type { AnswerMessage, Message, Question } from "@/lib/types";
import { MESSAGE_TYPES } from "@/lib/utils";
import { useEffect, useState } from "react";

export function QuestionCard({id, title, answers}: Question) {
  const [votes, setVotes] = useState(answers.map((_) => 0));
  const [hasVoted, setHasVoted] = useState<string[]>([])
  const {lastJsonMessage} = useWs();

  useEffect(() => {
    if (lastJsonMessage !== null) {
      if ((lastJsonMessage as Message).type === MESSAGE_TYPES.answer) {
        const message = (lastJsonMessage as AnswerMessage);
        if (message.questionId !== id || hasVoted.includes(message.uuid)) {
          return;
        }
        
        setHasVoted([...hasVoted, message.uuid]);
        setVotes((prev) => prev.map((vote, idx) => {
          if (idx !== message.answerId) {
            return vote;
          }
          return vote + 1;
        }))
      }
    }
  }, [lastJsonMessage]);

  return (
    <div className="w-[calc(100%-40px)] md:max-w-160 bg-card rounded-4xl flex flex-col items-center justify-between shadow-lg shadow-shadow/50 inset-shadow-2xs inset-shadow-glare/50">
      <span className="w-full text-3xl font-bold p-8">{title}</span>
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full text-center border-t-2 border-background ">
        {answers.map((answer, idx) => (
        <div
          className={`flex flex-row justify-between items-center px-8 min-h-16 flex-1 w-full place-content-center transition duration-500 py-3 border-b-2 border-background text-xl ${idx === answers.length - 1 && 'rounded-b-4xl'} ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
          key={idx}
        >
          <span>{answer.title}</span>
          <span>{votes[idx]}</span>
        </div>
      ))}
      </div>
    </div>
  )

}