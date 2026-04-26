export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Source[];
  backend?: string;
  questionId?: string;
}

export interface Source {
  text: string;
  metadata: {
    crop?: string;
    topic?: string;
    source?: string;
    [key: string]: any;
  };
}