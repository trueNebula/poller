import type { Message, Question } from "@/lib/types";
import { MESSAGE_TYPES, SOCKET_URL, uuid } from "@/lib/utils";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export function Question({id, title, answers}: Question) {
  const [selected, setSelected] = useState<number | null>(null);
  const {sendJsonMessage, lastJsonMessage} = useWebSocket(SOCKET_URL);
  const [reveal, setReveal] = useState(false);

    useEffect(() => {
      if(lastJsonMessage !== null) {
        console.log((lastJsonMessage as Message), typeof lastJsonMessage)
        switch ((lastJsonMessage as Message).type) {
          case MESSAGE_TYPES.reveal:
            setSelected(null);
            setReveal(true);
            break;
          case MESSAGE_TYPES.question:
            setSelected(null);
            setReveal(false);
            break;
        }
      }
    }, [lastJsonMessage]);

  const handleSelect = (idx: number) => {
    if (selected !== null || reveal) {
      return;
    }
    sendJsonMessage({type: MESSAGE_TYPES.answer, uuid, questionId: id, answerId: answers[idx].id});
    setSelected(idx)
  }

  return (
    <div className="w-[calc(100%-40px)] md:max-w-160 bg-card rounded-4xl flex flex-col items-center justify-between shadow-lg shadow-shadow/50 inset-shadow-2xs inset-shadow-glare/50">
      <span className="w-full text-3xl font-bold p-8">{title}</span>
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full text-center border-t-2 border-background ">
        {answers.map((answer, idx) => (
        <div
          className={`min-h-16 flex-1 w-full place-content-center transition duration-500 py-3 border-b-2 border-background text-xl ${idx === answers.length - 1 && 'rounded-b-4xl'} ${idx === selected ? 'bg-selected text-highlighted' : 'bg-card'} ${selected !== null && 'text-disabled cursor-default'} ${selected === null && 'hover:bg-selected cursor-pointer'} ${reveal && (answers[idx].isCorrect ? 'bg-green-500 hover:bg-green-500! cursor-default!' : 'bg-red-500 hover:bg-red-500! cursor-default!')}`}
          onClick={() => handleSelect(idx)}
          key={idx}
        >
          {answer.title}
        </div>
      ))}
      </div>
    </div>
  )
}