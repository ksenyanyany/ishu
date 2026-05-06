'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostCard, { Post } from '@/components/PostCard';

const MOCK_USERS: Record<string, {
  id: string; name: string; handle: string; initials: string; bio: string;
}> = {
  u2: { id: 'u2', name: 'Кирилл Власов', handle: '@kirill_v', initials: 'КВ', bio: 'думаю вслух и не жалею об этом'  },
  u3: { id: 'u3', name: 'Маша Светлова',  handle: '@masha_s',  initials: 'МС', bio: 'ищу радость в мелочах 🌿'        },
  u4: { id: 'u4', name: 'Антон Рыжов',    handle: '@anton_r',  initials: 'АР', bio: ''                                },
  u5: { id: 'u5', name: 'Соня Белова',    handle: '@sonya_b',  initials: 'СБ', bio: 'люблю ночь и тишину 🌙'          },
  u6: { id: 'u6', name: 'Лена Орлова',    handle: '@lena_o',   initials: 'ЛО', bio: 'рисую, читаю, мечтаю'            },
  u7: { id: 'u7', name: 'Ваня Смирнов',   handle: '@vanya_s',  initials: 'ВС', bio: 'просто живу'                     },
};

const MOCK_POSTS: Record<string, Post[]> = {
  u2: [
    { id: 'u2p1', authorId: 'u2', author: { id: 'u2', name: 'Кирилл Власов', initials: 'КВ' }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),  moods: ['тревога'],      text: 'Бывает ли у вас так, что вроде всё хорошо, но внутри что-то не так?', likesCount: 83,  commentsCount: 34 },
    { id: 'u2p2', authorId: 'u2', author: { id: 'u2', name: 'Кирилл Власов', initials: 'КВ' }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), moods: ['спокойствие'], text: 'Лежал на траве и смотрел в небо. Давно так не делал.',                  likesCount: 57,  commentsCount: 11 },
  ],
  u3: [
    { id: 'u3p1', authorId: 'u3', author: { id: 'u3', name: 'Маша Светлова', initials: 'МС' }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),  moods: ['радость'],     text: 'Сегодня впервые за долгое время смеялась до слёз. Это так важно — смеяться.', likesCount: 120, commentsCount: 18 },
  ],
  u5: [
    { id: 'u5p1', authorId: 'u5', author: { id: 'u5', name: 'Соня Белова',   initials: 'СБ' }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10), moods: ['грусть'],      text: 'Иногда хочется чтобы кто-то просто сидел рядом. Молча.',                    likesCount: 98,  commentsCount: 22 },
  ],
};

type TabType = 'posts' | 'replies' | 'likes';

const TAB_LABELS: Record<TabType, string> = {
  posts: 'Публикации',
  replies: 'Ответы',
  likes: 'Нравится',
};

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const user = MOCK_USERS[id];
  const posts = MOCK_POSTS[id] ?? [];

  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<TabType>('posts');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <span className="text-3xl">·  ·  ·</span>
        <span className="text-sm text-[#9AA3B8]">Пользователь не найден</span>
      </div>
    );
  }

  return (
    <>
      {/* ── обложка с кнопкой назад поверх ── */}
      <div className="-mx-4 relative z-0">
        <div className="w-full h-36 bg-gradient-to-br from-[#B8C4D8] to-[#8E9BB5]" />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white active:opacity-60"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Назад
        </button>
      </div>

      {/* ── аватар + кнопки ── */}
      <div className="relative z-10 flex items-end justify-between -mt-10 mb-3">
        <div className="w-20 h-20 rounded-full border-4 border-[#F3F6FC] bg-[#C5CEDC] flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-[#4B5563]">{user.initials}</span>
        </div>

        <div className="flex items-center gap-2 pb-1">
          <button
            onClick={() => router.push(`/activity/chat/${user.id}`)}
            className="w-9 h-9 rounded-full border border-[#C5CEDC] bg-white flex items-center justify-center active:opacity-60"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="#6B7FA8" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={() => setFollowing((f) => !f)}
            className="px-4 py-1.5 rounded-full text-sm font-bold transition-all active:opacity-70"
            style={
              following
                ? { background: '#EDEFF3', color: '#9AA3B8', border: '1px solid #DDE3EC' }
                : { background: 'linear-gradient(135deg, #7D90B8, #5A6E96)', color: 'white' }
            }
          >
            {following ? 'Вы подписаны' : 'Подписаться'}
          </button>
        </div>
      </div>

      {/* ── имя и хэндл ── */}
      <div className="mb-4 min-w-0">
        <h1 className="text-lg font-bold text-[#1F2A44] break-all">{user.name}</h1>
        <p className="text-sm text-[#9AA3B8] truncate">{user.handle}</p>
        {user.bio && (
          <p className="text-sm text-[#3D4860] mt-1.5 leading-relaxed break-words">{user.bio}</p>
        )}
      </div>

      {/* ── статистика — только публикации ── */}
      <div className="flex gap-6 mb-5">
        <div className="flex flex-col items-center">
          <span className="text-base font-bold text-[#1F2A44]">{posts.length}</span>
          <span className="text-xs text-[#9AA3B8]">публикаций</span>
        </div>
      </div>

      {/* ── вкладки ── */}
      <div className="flex border-b border-[#DDE3EC] mb-4 -mx-4">
        {(['posts', 'replies', 'likes'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === t ? 'text-[#1F2A44] border-b-2 border-[#6B7FA8]' : 'text-[#9AA3B8]'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* ── контент ── */}
      {tab === 'posts' && (
        posts.length > 0 ? (
          <div className="flex flex-col gap-4 pb-4">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <span className="text-[#C5CEDC] text-3xl">·  ·  ·</span>
            <span className="text-sm text-[#9AA3B8]">Публикаций пока нет</span>
          </div>
        )
      )}
      {tab !== 'posts' && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <span className="text-[#C5CEDC] text-3xl">·  ·  ·</span>
          <span className="text-sm text-[#9AA3B8]">Пока ничего нет</span>
        </div>
      )}
    </>
  );
}
