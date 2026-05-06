'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

type Message = {
  id: string;
  authorId: string;
  text?: string;
  images?: string[];
  createdAt: Date;
};

const currentUserId = 'user_1';

const mockUser = { name: 'Кирилл Власов', initials: 'КВ', avatarUrl: null as string | null };

const mockMessages: Message[] = [
  { id: 'm1', authorId: 'user_2', text: 'Привет! Как ты?', createdAt: new Date(Date.now() - 1000 * 60 * 10) },
  { id: 'm2', authorId: 'user_1', text: 'Привет! Всё хорошо, спасибо 🌿', createdAt: new Date(Date.now() - 1000 * 60 * 8) },
  { id: 'm3', authorId: 'user_2', text: 'Твой пост сегодня очень откликнулся', createdAt: new Date(Date.now() - 1000 * 60 * 5) },
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!text.trim() && images.length === 0) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        authorId: currentUserId,
        text: text.trim() || undefined,
        images: images.length > 0 ? images : undefined,
        createdAt: new Date(),
      },
    ]);
    setText('');
    setImages([]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach((file) =>
      setImages((prev) => [...prev, URL.createObjectURL(file)])
    );
    if (fileRef.current) fileRef.current.value = '';
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  const isMe = (msg: Message) => msg.authorId === currentUserId;

  return (
    <div className="flex flex-col h-screen">

      {/* Шапка — фиксированная */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 pt-14 pb-3 px-4 bg-[#F3F6FC]/95 backdrop-blur-sm border-b border-[#DDE3EC] shrink-0">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#EDEFF3] flex items-center justify-center shrink-0"
        >
          <Image src="/icons/back.svg" alt="назад" width={18} height={18} style={{ width: 'auto' }} />
        </button>

        <div className="w-10 h-10 rounded-full bg-[#C5CEDC] flex items-center justify-center shrink-0 overflow-hidden">
          {mockUser.avatarUrl ? (
            <Image src={mockUser.avatarUrl} alt={mockUser.name} width={40} height={40} className="object-cover" />
          ) : (
            <span className="text-sm font-semibold text-[#4B5563]">{mockUser.initials}</span>
          )}
        </div>

        <span className="text-base font-bold text-[#1F2A44] flex-1">{mockUser.name}</span>
      </div>

      {/* Сообщения — отступ сверху под шапку, сообщения прилипают к низу */}
      <div className="flex-1 overflow-y-auto pt-[110px]">
        <div className="flex flex-col justify-end min-h-full px-4 pt-4 pb-6">
        {messages.map((msg, i) => {
          const mine = isMe(msg);
          const showTime =
            i === messages.length - 1 ||
            messages[i + 1].authorId !== msg.authorId;

          return (
            <div key={msg.id} className={`flex mb-1.5 ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>

                {/* Пузырь */}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed ${
                    mine
                      ? 'bg-[#6B7FA8] text-white rounded-br-sm'
                      : 'bg-[#EDEFF3] text-[#1F2A44] rounded-bl-sm'
                  }`}
                >
                  {msg.text && <p>{msg.text}</p>}

                  {/* Фото в сообщении */}
                  {msg.images && msg.images.length > 0 && (
                    <div className={`grid gap-1 mt-1 ${msg.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {msg.images.map((src, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden aspect-square">
                          <Image src={src} alt="фото" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Время */}
                {showTime && (
                  <span className="text-xs text-[#9AA3B8] mt-1 mx-1">
                    {formatDistanceToNow(msg.createdAt, { addSuffix: true, locale: ru })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
        </div>
      </div>

      {/* Инпут */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-transparent">
        <div className="w-full px-4 pt-2 pb-8">

          {/* Превью фото */}
          {images.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {images.map((src, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <Image src={src} alt="фото" fill className="object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <span className="text-white text-xs leading-none">×</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">

            {/* Кнопка фото */}
            <label className="w-10 h-10 rounded-full bg-[#EDEFF3] flex items-center justify-center shrink-0 cursor-pointer mb-0.5">
              <Image src="/icons/photo.svg" alt="фото" width={20} height={20} style={{ width: 'auto' }} />
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImage} />
            </label>

            {/* Поле */}
            <div className="flex-1 bg-[#EDEFF3] rounded-2xl px-4 py-3 flex items-end gap-2">
              <textarea
                className="flex-1 bg-transparent outline-none text-[15px] text-[#1F2A44] placeholder:text-[#9AA3B8] resize-none max-h-28 leading-relaxed"
                placeholder="Сообщение..."
                rows={1}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onKeyDown={handleKeyDown}
              />
              {(text.trim() || images.length > 0) && (
                <button
                  onClick={handleSend}
                  className="w-8 h-8 rounded-full bg-[#6B7FA8] flex items-center justify-center shrink-0 mb-0.5"
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7L13 1L7.5 13L6 8L1 7Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
