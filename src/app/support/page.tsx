'use client';

import clsx from 'clsx';
import { IoSend } from 'react-icons/io5';
import styles from './support.module.css';
import { ChatMessage } from './interface';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Cursor, IconButtonBackground } from '@/constants/enums';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { INITIAL_MESSAGES, formatMessageTime, getDayLabel, handleKeyDown, handleTextareaInput, isUserMessage, sendMessage } from './utils';

export default function Support() {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className={styles.container}>
      <div className={styles.messages__area}>
        {messages.map((msg, index) => {
          const isMine = isUserMessage(index);
          const currentDay = getDayLabel(msg.timestamp);
          const prevDay = index > 0 ? getDayLabel(messages[index - 1].timestamp) : null;
          const showDateDivider = currentDay !== prevDay;

          return (
            <Fragment key={msg.id}>
              {showDateDivider && (
                <div className={styles.date__divider}>
                  <span className={styles.date__badge}>{currentDay}</span>
                </div>
              )}
              <div
                className={clsx(styles.message__row, {
                  [styles.self]: isMine,
                  [styles.other]: !isMine,
                })}
              >
                {!isMine && (
                  <span className={styles.message__sender}>{msg.senderName || 'Support'}</span>
                )}
                <div className={styles.message__bubble}>{msg.text}</div>
                <span className={styles.message__time}>
                  {formatMessageTime(msg.timestamp)}
                </span>
              </div>
            </Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.input__card__container}>
        <div className={styles.input__card}>
          <div className={styles.textarea__wrapper}>
            <textarea
              rows={1}
              ref={textareaRef}
              value={inputText}
              className={styles.textarea}
              onInput={handleTextareaInput}
              placeholder="Type a message..."
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, () => sendMessage(inputText, messages.length, setMessages, setInputText, textareaRef.current))}
            />
          </div>
          <IconButton
            cursor={Cursor.pointer}
            aria-label="Send message"
            icon={<IoSend size={16} />}
            disabled={!inputText.trim()}
            variant={IconButtonBackground.primary}
            onClick={() => sendMessage(inputText, messages.length, setMessages, setInputText, textareaRef.current)}
          />
        </div>
      </div>
    </div>
  );
}