import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const uuid = v4();

export const SOCKET_URL = 'ws://localhost:3000/';

export const MESSAGE_TYPES = {
  question: "QUESTION_CHANGE",
  answer: "ANSWER_SUBMISSION",
  reveal: "ANSWERS_REVEAL",
  end: "QUESTION_HIDE",
}
