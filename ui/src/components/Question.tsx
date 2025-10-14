import type { Question } from "@/lib/types";
import { sendAnswer } from "@/lib/utils";
import { useState } from "react";

export function Question({id, title, answers}: Question) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) {
      return;
    }
    sendAnswer(id, answers[idx].id);
    setSelected(idx)
  }

  return (
    <div className="w-[calc(100%-40px)] md:max-w-160 bg-card rounded-4xl flex flex-col items-center justify-between shadow-lg shadow-shadow/50 inset-shadow-2xs inset-shadow-glare/50">
      <span className="w-full text-3xl font-bold p-8">{title}</span>
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full text-center border-t-2 border-background ">
        {answers.map((answer, idx) => (
        <div
          className={`min-h-16 flex-1 w-full place-content-center transition duration-500 py-3 border-b-2 border-background text-xl ${idx === answers.length - 1 && 'rounded-b-4xl'} ${idx === selected ? 'bg-selected text-highlighted' : 'bg-card'} ${selected !== null && 'text-disabled cursor-default'} ${selected === null && 'hover:bg-selected cursor-pointer'}`}
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