import { MessageSender } from '@/constants/enums';

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  senderName?: string;
  sender: MessageSender;
}