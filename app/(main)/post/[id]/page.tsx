'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PostCard, { Post } from '@/components/PostCard';
import CommentCard, { Comment } from '@/components/CommentCard';
import CommentInput from '@/components/CommentInput';

const mockPost: Post = {
  id: '1',
  authorId: 'user_1',
  author: { id: 'user_1', name: 'Алина Миронова', initials: 'АМ' },
  createdAt: new Date('2025-04-09T10:00:00'),
  moods: ['спокойствие'],
  text: 'Сегодня утром просто сидела у окна с чашкой чая. Иногда этого достаточно 🍵',
  likesCount: 47,
  commentsCount: 12,
  isLiked: true,
};

const mockComments: Comment[] = [
  {
    id: 'c1',
    authorId: 'user_2',
    author: { name: 'Кирилл Власов', initials: 'КВ' },
    createdAt: new Date('2025-04-09T10:15:00'),
    text: 'Очень понимаю это чувство 🌿',
    likesCount: 5,
    isLiked: false,
  },
  {
    id: 'c2',
    authorId: 'user_3',
    author: { name: 'Маша Светлова', initials: 'МС' },
    createdAt: new Date('2025-04-09T11:00:00'),
    text: 'Такие утра — лучшее начало дня',
    images: [],
    likesCount: 2,
  },
];

export default function PostPage() {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(mockComments);

  function handleNewComment(text: string, images: string[]) {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      authorId: 'user_1',
      author: { name: 'Алина Миронова', initials: 'АМ' },
      createdAt: new Date(),
      text,
      images: images.length > 0 ? images : undefined,
      likesCount: 0,
    };
    setComments((prev) => [...prev, newComment]);
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Скроллящийся контент */}
      <div className="flex-1 pb-4">

        {/* Топбар */}
        <div className="flex items-center gap-3 pt-8 pb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-[#EDEFF3] flex items-center justify-center shrink-0"
          >
            <Image src="/icons/back.svg" alt="назад" width={16} height={16} style={{ width: 'auto' }} />
          </button>
          <span className="text-base font-bold text-[#1F2A44]">Пост</span>
        </div>

        {/* Пост */}
        <PostCard post={mockPost} />

        {/* Комментарии */}
        <div className="mt-4 mb-2">
          <span className="text-xs font-bold text-[#9AA3B8] uppercase tracking-wide">
            Комментарии · {comments.length}
          </span>
        </div>

        <div className="flex flex-col divide-y divide-[#DDE3EC]">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </div>

      {/* Инпут — прилипает к низу */}
      <div className="sticky bottom-0">
        <CommentInput onSubmit={handleNewComment} />
      </div>

    </div>
  );
}