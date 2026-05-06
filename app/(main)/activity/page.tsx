'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

type NotificationType = 'like' | 'comment';

type Notification = {
  id: string;
  type: NotificationType;
  actor: { name: string; initials: string; avatarUrl?: string };
  postText: string;
  postId: string;
  createdAt: Date;
  isRead: boolean;
};

type Chat = {
  id: string;
  user: { name: string; initials: string; avatarUrl?: string };
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
};

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    actor: { name: 'Кирилл Власов', initials: 'КВ' },
    postText: 'Сегодня утром просто сидела у окна...',
    postId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
  },
  {
    id: 'n2',
    type: 'comment',
    actor: { name: 'Маша Светлова', initials: 'МС' },
    postText: 'Сегодня утром просто сидела у окна...',
    postId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
  },
  {
    id: 'n3',
    type: 'like',
    actor: { name: 'Антон Рыжов', initials: 'АР' },
    postText: 'Сегодня утром просто сидела у окна...',
    postId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
  },
];

const mockChats: Chat[] = [
  {
    id: 'ch1',
    user: { name: 'Кирилл Власов', initials: 'КВ' },
    lastMessage: 'Привет! Как ты?',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 10),
    unreadCount: 2,
  },
  {
    id: 'ch2',
    user: { name: 'Маша Светлова', initials: 'МС' },
    lastMessage: 'Спасибо за пост, очень откликнулось 🌿',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60),
    unreadCount: 0,
  },
  {
    id: 'ch3',
    user: { name: 'Антон Рыжов', initials: 'АР' },
    lastMessage: 'Окей, договорились!',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 0,
  },
  {
    id: 'ch4',
    user: { name: 'Соня Белова', initials: 'СБ' },
    lastMessage: 'Увидимся завтра?',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 1,
  },
];

function Avatar({
  name, initials, avatarUrl, size = 10,
}: {
  name: string; initials: string; avatarUrl?: string; size?: number;
}) {
  return (
    <div className={`w-${size} h-${size} rounded-full bg-[#C5CEDC] flex items-center justify-center shrink-0 overflow-hidden`}>
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} width={size * 4} height={size * 4} className="object-cover" />
      ) : (
        <span className="text-xs font-semibold text-[#4B5563]">{initials}</span>
      )}
    </div>
  );
}

export default function ActivityPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState<'notifications' | 'chats'>('chats');

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadChats = mockChats.reduce((sum, c) => sum + (c.unreadCount > 0 ? 1 : 0), 0);

  return (
    <main className="flex flex-col py-6 gap-4">

      {/* Переключатель вкладок */}
      <div className="flex gap-1 bg-[#E2E6EF] rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'chats'
              ? 'bg-white text-[#1F2A44] shadow-sm'
              : 'text-[#9AA3B8]'
          }`}
        >
          Сообщения
          {unreadChats > 0 && (
            <div className="w-4 h-4 rounded-full bg-[#6B7FA8] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">{unreadChats}</span>
            </div>
          )}
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'notifications'
              ? 'bg-white text-[#1F2A44] shadow-sm'
              : 'text-[#9AA3B8]'
          }`}
        >
          Уведомления
          {unreadCount > 0 && (
            <div className="w-4 h-4 rounded-full bg-[#B06B8A] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">{unreadCount}</span>
            </div>
          )}
        </button>
      </div>

      {/* Уведомления */}
      {activeTab === 'notifications' && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-[#1F2A44]">Уведомления</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-[#9AA3B8]">
                Прочитать все
              </button>
            )}
          </div>

          <div className="bg-[#EDEFF3] rounded-2xl overflow-hidden">
            {notifications.map((n, i) => (
              <div key={n.id}>
                <Link href={`/post/${n.postId}`}>
                  <div className={`flex items-center gap-3 px-4 py-3 ${!n.isRead ? 'bg-[#E6EAF2]' : ''}`}>
                    <div className="relative shrink-0">
                      <Avatar name={n.actor.name} initials={n.actor.initials} avatarUrl={n.actor.avatarUrl} size={10} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${n.type === 'like' ? 'bg-[#B06B8A]' : 'bg-[#6B7FA8]'}`}>
                        {n.type === 'like' ? (
                          <svg width="8" height="8" viewBox="0 0 14 14" fill="white">
                            <path d="M7 12S1 8 1 4.5A3.5 3.5 0 0 1 7 2.5 3.5 3.5 0 0 1 13 4.5C13 8 7 12 7 12Z" />
                          </svg>
                        ) : (
                          <svg width="8" height="8" viewBox="0 0 14 14" fill="white">
                            <path d="M2 2h10v8H8l-3 2v-2H2z" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1F2A44] leading-snug">
                        <span className="font-semibold">{n.actor.name}</span>
                        {n.type === 'like' ? ' лайкнул(а) ' : ' прокомментировал(а) '}
                        <span className="text-[#9AA3B8] truncate">«{n.postText}»</span>
                      </p>
                      <span className="text-xs text-[#9AA3B8]">
                        {formatDistanceToNow(n.createdAt, { addSuffix: true, locale: ru })}
                      </span>
                    </div>

                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#B06B8A] shrink-0" />
                    )}
                  </div>
                </Link>
                {i < notifications.length - 1 && <div className="h-px bg-[#DDE3EC] mx-4" />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Чаты */}
      {activeTab === 'chats' && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-[#1F2A44]">Сообщения</span>
          </div>

          <div className="bg-[#EDEFF3] rounded-2xl overflow-hidden">
            {mockChats.map((chat, i) => (
              <div key={chat.id}>
                <Link href={`/activity/chat/${chat.id}`}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar name={chat.user.name} initials={chat.user.initials} avatarUrl={chat.user.avatarUrl} size={10} />

                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-[#1F2A44] block">{chat.user.name}</span>
                      <span className="text-xs text-[#9AA3B8] truncate block">{chat.lastMessage}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-[#9AA3B8]">
                        {formatDistanceToNow(chat.lastMessageAt, { addSuffix: false, locale: ru })}
                      </span>
                      {chat.unreadCount > 0 && (
                        <div className="w-5 h-5 rounded-full bg-[#6B7FA8] flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">{chat.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                {i < mockChats.length - 1 && <div className="h-px bg-[#DDE3EC] mx-4" />}
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
