import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sendAnswer(qId: number, aId: number) {
  const uuid = v4();
  console.log(`${uuid}: Question #${qId} Answer#${aId}`);
}