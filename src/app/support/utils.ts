import dayjs from 'dayjs';
import { ChatMessage } from './interface';
import { MessageSender, Overflow } from '@/constants/enums';

export const getDayLabel = (timestamp: number): string => {
  const d = dayjs(timestamp);
  const now = dayjs();
  if (d.isSame(now, 'day')) return 'Today';
  if (d.isSame(now.subtract(1, 'day'), 'day')) return 'Yesterday';
  if (d.isSame(now, 'year')) return d.format('MMMM D');
  return d.format('MMMM D, YYYY');
};

export const formatMessageTime = (timestamp: number): string => dayjs(timestamp).format('h:mm A');

export const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>): void => {
  const textarea = e.currentTarget;
  textarea.style.height = '40px';

  const maxHeight = 86;
  const scrollHeight = textarea.scrollHeight;

  if (scrollHeight > 40) {
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? Overflow.auto : Overflow.hidden;
  } else {
    textarea.style.height = '40px';
    textarea.style.overflowY = Overflow.hidden;
  }
};

export const resetTextareaHeight = (textarea: HTMLTextAreaElement | null): void => {
  if (textarea) {
    textarea.style.height = '40px';
    textarea.style.overflowY = Overflow.hidden;
  }
};

export const isUserMessage = (index: number): boolean => index % 2 !== 0;

export const createChatMessage = (text: string, currentMessageCount: number): ChatMessage => {
  const isMine = isUserMessage(currentMessageCount);
  return {
    text: text.trim(),
    timestamp: Date.now(),
    senderName: isMine ? undefined : 'Support',
    sender: isMine ? MessageSender.me : MessageSender.other,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  };
};

export const sendMessage = (inputText: string, messagesLength: number, setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>, setInputText: React.Dispatch<React.SetStateAction<string>>, textarea: HTMLTextAreaElement | null): void => {
  const trimmed = inputText.trim();
  if (!trimmed) return;

  const newMessage = createChatMessage(trimmed, messagesLength);
  setMessages((prev) => [...prev, newMessage]);
  setInputText('');
  resetTextareaHeight(textarea);
};

export const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, onSend: () => void): void => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    onSend();
  }
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-2025-1',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2025-11-20T09:00:00').valueOf(),
    text: 'Welcome to Kitaab! We are here to help you reflect, grow, and track your daily deeds.'
  },
  {
    id: 'msg-2025-2',
    sender: MessageSender.me,
    timestamp: dayjs('2025-11-20T09:05:00').valueOf(),
    text: 'Hello! I just started using the app. What is the recommended way to get started?'
  },
  {
    id: 'msg-2025-3',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2025-11-20T09:10:00').valueOf(),
    text: 'We recommend exploring your default Hasanaat categories and customizing any deeds to fit your routine.'
  },
  {
    id: 'msg-2025-4',
    sender: MessageSender.me,
    timestamp: dayjs('2025-11-20T09:15:00').valueOf(),
    text: 'Can I also log Sayyiaat for habits I want to steer clear of?'
  },
  {
    id: 'msg-2025-5',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2025-11-20T09:20:00').valueOf(),
    text: 'Yes, certainly! The category toggle in the top header lets you switch between Hasanaat and Sayyiaat smoothly.'
  },
  {
    id: 'msg-2025-6',
    sender: MessageSender.me,
    timestamp: dayjs('2025-11-20T09:25:00').valueOf(),
    text: 'Great. How does daily reflection tracking work?'
  },
  {
    id: 'msg-2025-7',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2025-11-20T09:30:00').valueOf(),
    text: 'Each day you can mark completions, enter numerical counts, or rate your deeds. The records update your daily streak.'
  },
  {
    id: 'msg-2025-8',
    sender: MessageSender.me,
    timestamp: dayjs('2025-11-20T09:35:00').valueOf(),
    text: 'Can I view my long-term progress over weeks and months?'
  },
  {
    id: 'msg-2025-9',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2025-11-20T09:40:00').valueOf(),
    text: 'Yes! The Dashboard includes interactive line charts and breakdown views for custom date intervals.'
  },
  {
    id: 'msg-2025-10',
    sender: MessageSender.me,
    timestamp: dayjs('2025-11-20T09:45:00').valueOf(),
    text: 'Is there a dark mode available for night reflections?'
  },
  {
    id: 'msg-2025-11',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2025-11-20T09:50:00').valueOf(),
    text: 'Yes, click the theme button in the header to switch between light and dark modes anytime.'
  },
  {
    id: 'msg-2025-12',
    sender: MessageSender.me,
    timestamp: dayjs('2025-11-20T09:55:00').valueOf(),
    text: 'Can I reorganize the order of my deed cards?'
  },
  {
    id: 'msg-2025-13',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2025-11-20T10:00:00').valueOf(),
    text: 'You can drag and reorder deeds using the move handle on each deed card.'
  },
  {
    id: 'msg-2025-14',
    sender: MessageSender.me,
    timestamp: dayjs('2025-11-20T10:05:00').valueOf(),
    text: 'Wonderful, thank you so much for the detailed walkthrough!'
  },
  {
    id: 'msg-2025-15',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2025-11-20T10:10:00').valueOf(),
    text: 'You are very welcome! May Kitaab be a source of continuous consistency and barakah for you.'
  },
  {
    id: 'msg-aug-28-1',
    sender: MessageSender.me,
    timestamp: dayjs('2026-08-28T10:30:00').valueOf(),
    text: 'Hi Support! Checking back in — my daily habits have been consistent over the past few months.'
  },
  {
    id: 'msg-sep-3-1',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2026-09-03T14:02:00').valueOf(),
    text: 'Welcome back! Wonderful to hear about your consistency. How can we assist today?'
  },
  {
    id: 'msg-sep-3-2',
    sender: MessageSender.me,
    timestamp: dayjs('2026-09-03T14:05:00').valueOf(),
    text: 'I started logging my daily deeds, but I want to customize the scale for some of them.'
  },
  {
    id: 'msg-sep-3-3',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2026-09-03T14:08:00').valueOf(),
    text: 'You can customize scales anytime by opening the deed settings and selecting or creating a scale.'
  },
  {
    id: 'msg-sep-3-4',
    sender: MessageSender.me,
    timestamp: dayjs('2026-09-03T14:11:00').valueOf(),
    text: 'Does changing a scale affect the deeds I previously recorded?'
  },
  {
    id: 'msg-sep-3-5',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2026-09-03T14:14:00').valueOf(),
    text: 'Once records exist against a specific scale type, that type is locked to preserve historical data accuracy.'
  },
  {
    id: 'msg-sep-3-6',
    sender: MessageSender.me,
    timestamp: dayjs('2026-09-03T14:17:00').valueOf(),
    text: 'That makes sense. Can I create sub-deeds instead?'
  },
  {
    id: 'msg-sep-3-7',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2026-09-03T14:20:00').valueOf(),
    text: 'Yes, exactly! For example, under Salah you can add Fajr, Dhuhr, Asr, Maghrib, and Isha as sub-deeds.'
  },
  {
    id: 'msg-sep-3-8',
    sender: MessageSender.me,
    timestamp: dayjs('2026-09-03T14:23:00').valueOf(),
    text: 'Perfect, that helps break down my daily prayers nicely.'
  },
  {
    id: 'msg-sep-3-9',
    senderName: 'Support',
    sender: MessageSender.other,
    timestamp: dayjs('2026-09-03T14:26:00').valueOf(),
    text: 'Each sub-deed will also have its own tracking history and will automatically aggregate in your dashboard charts.'
  },
  {
    id: 'msg-sep-3-10',
    sender: MessageSender.me,
    timestamp: dayjs('2026-09-03T14:29:00').valueOf(),
    text: 'Awesome! Will these updates sync in real time if I open another tab?'
  }
];