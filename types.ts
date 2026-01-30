
export interface Message {
  id: number;
  text: string;
  sender: "character" | "user";
  timestamp: string;
  status?: "read" | "sent" | "delivered";
}

export interface FAQItem {
  question: string;
  answer: string;
}
