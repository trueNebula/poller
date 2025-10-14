export interface Question {
  id: number;
  title: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  title: string;
  isCorrect: boolean;
}

export interface QuestionMessage {
  type: 'QUESTION_CHANGE',
  question: Question,
}

export interface AnswerMessage {
  type: 'ANSWER_SUBMISSION',
  uuid: string,
  questionId: number,
  answerId: number,
}

export interface RevealMessage {
  type: 'ANSWERS_REVEAL',
}

export interface EndMessage {
  type: 'QUESTION_HIDE',
}

export type Message = QuestionMessage | AnswerMessage | RevealMessage | EndMessage;
