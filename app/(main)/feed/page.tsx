'use client';

import { useState } from 'react';
import PostCard from '@/components/PostCard';

const posts = [
  {
    id: '1',
    authorId: 'user_1',
    author: { id: 'user_1', name: 'Алина Миронова', initials: 'АМ' },
    createdAt: new Date('2025-04-09T10:00:00'),
    moods: ['спокойствие'],
    text: 'Сегодня утром просто сидела у окна с чашкой чая. Иногда этого достаточно 🍵',
    likesCount: 47,
    commentsCount: 12,
    isLiked: true,
  },
  {
    id: '2',
    authorId: 'user_2',
    author: { id: 'user_2', name: 'Кирилл Власов', initials: 'КВ' },
    createdAt: new Date('2025-04-09T07:00:00'),
    moods: ['тревога', 'мысли'],
    text: 'Бывает ли у вас так, что вроде всё хорошо, но внутри что-то не так?',
    likesCount: 83,
    commentsCount: 34,
  },
];

export default function FeedPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? posts.filter(
        (p) =>
          p.text.toLowerCase().includes(query.toLowerCase()) ||
          p.author.name.toLowerCase().includes(query.toLowerCase()) ||
          p.moods.some((m) => m.toLowerCase().includes(query.toLowerCase())),
      )
    : posts;

  return (
    <main className="w-full max-w-sm flex flex-col gap-4 py-6">

      {/* шапка — всё в одной строке */}
      <div className="flex items-center gap-2 overflow-hidden">

        {/* заголовок — уезжает влево */}
        <h1
          className="text-3xl text-[#2D3452] whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          style={{
            maxWidth: searchOpen ? '0px' : '160px',
            opacity: searchOpen ? 0 : 1,
            marginRight: searchOpen ? 0 : undefined,
          }}
        >
          ishu.
        </h1>

        {/* инпут — раскрывается */}
        <div
          className="flex items-center gap-2 bg-[#E8ECF2] rounded-2xl overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            flex: searchOpen ? 1 : 0,
            maxWidth: searchOpen ? '100%' : '0px',
            opacity: searchOpen ? 1 : 0,
            paddingLeft: searchOpen ? '14px' : 0,
            paddingRight: searchOpen ? '14px' : 0,
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" className="shrink-0 opacity-40">
            <circle cx="8" cy="8" r="5.5" stroke="#1F2A44" strokeWidth="1.8"/>
            <path d="M12.5 12.5L16 16" stroke="#1F2A44" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            tabIndex={searchOpen ? 0 : -1}
            ref={(el) => { if (searchOpen && el) el.focus(); }}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск в ленте..."
            className="flex-1 bg-transparent text-sm text-[#1F2A44] placeholder:text-[#9AA3B8] outline-none min-w-0"
          />
        </div>

        {/* кнопка поиска / крестик */}
        <button
          onClick={() => { setSearchOpen((o) => !o); setQuery(''); }}
          className="ml-auto shrink-0 w-9 h-9 rounded-xl flex items-center justify-center active:opacity-60 transition-colors"
          style={{ background: searchOpen ? '#6B7FA815' : 'transparent' }}
        >
          <div className="transition-all duration-200" style={{ transform: searchOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            {searchOpen ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 2l11 11M13 2L2 13" stroke="#6B7FA8" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="#9AA3B8" strokeWidth="1.8"/>
                <path d="M12.5 12.5L16 16" stroke="#9AA3B8" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* посты */}
      {filtered.length > 0 ? (
        filtered.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="flex flex-col items-center py-16 gap-2">
          <span className="text-2xl">·  ·  ·</span>
          <span className="text-sm text-[#9AA3B8]">Ничего не нашлось</span>
        </div>
      )}

    </main>
  );
}
