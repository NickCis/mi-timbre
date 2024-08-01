'use client';

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';

// fix-vim-highlight = }

export interface Message {
  id: string;
  time: number;
  expires: number;
  title: string;
  message: string;

  doorId: string;
  text: string;
}

class MessagesController extends EventTarget {
  uid?: string;
  since?: string;
  controller = new AbortController();
  messages: Message[] = [];

  setUID(uid: string) {
    this.controller.abort();
    this.controller = new AbortController();
    this.uid = uid;
    this.since = undefined;
    this.messages = [];
    this.poll();
  }

  dispatchChange() {
    this.dispatchEvent(new Event('change'));
  }

  stop() {
    this.controller.abort();
  }

  async poll() {
    if (!this.uid) return;
    const controller = this.controller;
    await this.fetch(this.uid, controller.signal);
    await new Promise((rs) => setTimeout(rs, 10000));
    if (controller.signal.aborted) return;
    this.poll();
  }

  async fetch(uid: string, signal: AbortSignal) {
    const res = await fetch(
      `https://ntfy.sh/mtui-${uid}/json?poll=1${this.since ? `&since=${this.since}` : ''}`,
      { signal },
    );
    const text = await res.text(); // es un jsonl
    if (signal.aborted) return;
    if (text) {
      const lines = text.split('\n');
      let changed = false;
      for (const line of lines) {
        if (!line) continue;
        const json = JSON.parse(line);
        this.since = json.id;
        if (json.title === 'message' && json.message) {
          try {
            const parsed = JSON.parse(json.message);
            this.messages.push({
              ...parsed,
              ...json,
            });
            changed = true;
          } catch (e) {}
        }
      }

      if (changed) this.dispatchChange();
    }
  }
}

const MessagesContext = createContext<MessagesController | undefined>(
  undefined,
);

export function useMessages(doorId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesController = useContext(MessagesContext);

  useEffect(() => {
    if (!messagesController) return;
    const handler = () => {
      setMessages([...messagesController.messages]);
    };

    handler();

    messagesController.addEventListener('change', handler);

    return () => {
      messagesController.removeEventListener('change', handler);
    };
  }, [messagesController]);

  return useMemo(() => {
    if (!doorId) return messages;
    return messages.filter((m) => m.doorId === doorId);
  }, [messages, doorId]);
}

export function MessagesProvider({
  uid,
  children,
}: PropsWithChildren<{ uid?: string }>) {
  const [controller, setController] = useState<MessagesController>();

  useEffect(() => {
    const controller = new MessagesController();
    setController(controller);
    return () => {
      controller.stop();
    };
  }, []);

  useEffect(() => {
    if (uid && controller) controller.setUID(uid);
  }, [uid, controller]);

  return (
    <MessagesContext.Provider value={controller}>
      {children}
    </MessagesContext.Provider>
  );
}
