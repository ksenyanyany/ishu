import PostCard from '@/components/PostCard';

const posts = [
  {
    id: '1',
    authorId: 'user_1',
    author: {
      id: 'user_1',
      name: 'Алина Миронова',
      initials: 'АМ',
    },
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
    author: {
      id: 'user_2',
      name: 'Кирилл Власов',
      initials: 'КВ',
    },
    createdAt: new Date('2025-04-09T07:00:00'),
    moods: ['тревога', 'мысли'],
    text: 'Бывает ли у вас так, что вроде всё хорошо, но внутри что-то не так?',
    likesCount: 83,
    commentsCount: 34,
  },

];

export default function FeedPage() {
  return (
    <main className="w-full max-w-sm flex flex-col gap-4 py-6">
      <h1 className='text-3xl text-[#2D3452] '>ishu.</h1>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}