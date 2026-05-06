'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import PostCard, { Post } from '@/components/PostCard';
import ImageCropModal from '@/components/ImageCropModal';

const defaultUser = {
  id: 'user_1',
  name: 'Анна Морозова',
  handle: '@ann_moroz',
  initials: 'АМ',
  bio: 'собираю моменты и эмоции ✨',
};

const mockFollowers = [
  { id: 'u2', name: 'Кирилл Власов', initials: 'КВ', handle: '@kirill_v' },
  { id: 'u3', name: 'Маша Светлова', initials: 'МС', handle: '@masha_s' },
  { id: 'u4', name: 'Антон Рыжов', initials: 'АР', handle: '@anton_r' },
  { id: 'u5', name: 'Соня Белова', initials: 'СБ', handle: '@sonya_b' },
];

const mockFollowing = [
  { id: 'u2', name: 'Кирилл Власов', initials: 'КВ', handle: '@kirill_v' },
  { id: 'u6', name: 'Лена Орлова', initials: 'ЛО', handle: '@lena_o' },
  { id: 'u7', name: 'Ваня Смирнов', initials: 'ВС', handle: '@vanya_s' },
];

const mockPosts: Post[] = [
  {
    id: 'p1',
    authorId: 'user_1',
    author: { id: 'user_1', name: 'Анна Морозова', initials: 'АМ' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    moods: ['спокойствие'],
    text: 'Сегодня утром просто сидела у окна и смотрела как идёт дождь. Иногда это всё что нужно.',
    likesCount: 42,
    commentsCount: 7,
    isLiked: false,
  },
  {
    id: 'p2',
    authorId: 'user_1',
    author: { id: 'user_1', name: 'Анна Морозова', initials: 'АМ' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    moods: ['радость', 'любовь'],
    text: 'Нашла старый дневник и провела с ним весь вечер. Столько воспоминаний...',
    likesCount: 89,
    commentsCount: 14,
    isLiked: true,
  },
];

type ModalType = 'followers' | 'following' | null;
type TabType = 'posts' | 'replies' | 'likes';

export default function ProfilePage() {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [cropState, setCropState] = useState<{ src: string; type: 'cover' | 'avatar' } | null>(null);
  const [listModal, setListModal] = useState<ModalType>(null);
  const [tab, setTab] = useState<TabType>('posts');

  // профиль
  const [currentUser, setCurrentUser] = useState(defaultUser);

  // редактирование
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editHandle, setEditHandle] = useState(currentUser.handle);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [sheetVisible, setSheetVisible] = useState(false);

  // анимация появления / скрытия sheet
  useEffect(() => {
    if (editOpen) {
      // небольшая задержка чтобы CSS transition успел сработать
      requestAnimationFrame(() => setSheetVisible(true));
    }
  }, [editOpen]);

  function openEdit() {
    setEditName(currentUser.name);
    setEditHandle(currentUser.handle);
    setEditBio(currentUser.bio);
    setEditOpen(true);
  }

  function closeEdit() {
    setSheetVisible(false);
    setTimeout(() => setEditOpen(false), 300);
  }

  function saveEdit() {
    setCurrentUser((u) => ({
      ...u,
      name: editName.trim() || u.name,
      handle: editHandle.trim() || u.handle,
      bio: editBio.trim(),
    }));
    closeEdit();
  }

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar') {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropState({ src: URL.createObjectURL(file), type });
    e.target.value = '';
  }

  function handleCropConfirm(dataUrl: string) {
    if (cropState?.type === 'cover') setCoverUrl(dataUrl);
    else setAvatarUrl(dataUrl);
    URL.revokeObjectURL(cropState!.src);
    setCropState(null);
  }

  function handleCropCancel() {
    URL.revokeObjectURL(cropState!.src);
    setCropState(null);
  }

  const listData = listModal === 'followers' ? mockFollowers : mockFollowing;
  const listTitle = listModal === 'followers' ? 'Подписчики' : 'Подписки';

  const TAB_LABELS: Record<TabType, string> = {
    posts: 'Публикации',
    replies: 'Ответы',
    likes: 'Нравится',
  };

  return (
    <>
      {/* Кроппер */}
      {cropState && (
        <ImageCropModal
          src={cropState.src}
          cropType={cropState.type}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      {/* Модаль подписчиков / подписок */}
      {listModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setListModal(null)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[65vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#DDE3EC] shrink-0">
              <span className="text-base font-bold text-[#1F2A44]">{listTitle}</span>
              <button onClick={() => setListModal(null)} className="text-sm text-[#9AA3B8]">Закрыть</button>
            </div>
            <div className="overflow-y-auto flex-1 px-4 py-2">
              {listData.map((user) => (
                <div key={user.id} className="flex items-center gap-3 py-3 border-b border-[#F3F6FC] last:border-0">
                  <div className="w-10 h-10 rounded-full bg-[#C5CEDC] flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-[#4B5563]">{user.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1F2A44]">{user.name}</p>
                    <p className="text-xs text-[#9AA3B8]">{user.handle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Обложка — во всю ширину, выходит за паддинги layout'а */}
      <div className="-mx-4 relative z-0">
        <div className="w-full h-36 relative overflow-hidden">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="обложка" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#B8C4D8] to-[#8E9BB5]" />
          )}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <Image src="/icons/image.svg" alt="изменить обложку" width={16} height={16} style={{ width: 'auto' }} />
          </button>
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'cover')}
        />
      </div>

      {/* Аватар + кнопка редактирования */}
      <div className="relative z-10 flex items-end justify-between -mt-10 mb-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-[#F3F6FC] bg-[#C5CEDC] flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="аватар" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-[#4B5563]">{currentUser.initials}</span>
            )}
          </div>
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-[#6B7FA8] flex items-center justify-center border-2 border-[#F3F6FC]"
          >
            <Image src="/icons/plus.svg" alt="изменить фото" width={10} height={10} style={{ width: 'auto' }} />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, 'avatar')}
          />
        </div>

        <button
          onClick={openEdit}
          className="px-4 py-1.5 rounded-full border border-[#C5CEDC] text-sm font-semibold text-[#1F2A44] active:opacity-60 transition-opacity"
        >
          Редактировать
        </button>
      </div>

      {/* Имя и хэндл */}
      <div className="mb-4 min-w-0">
        <h1 className="text-lg font-bold text-[#1F2A44] break-all">{currentUser.name}</h1>
        <p className="text-sm text-[#9AA3B8] truncate">{currentUser.handle}</p>
        {currentUser.bio && (
          <p className="text-sm text-[#3D4860] mt-1.5 leading-relaxed break-words">{currentUser.bio}</p>
        )}
      </div>

      {/* Статистика */}
      <div className="flex gap-6 mb-5">
        <div className="flex flex-col items-center">
          <span className="text-base font-bold text-[#1F2A44]">{mockPosts.length}</span>
          <span className="text-xs text-[#9AA3B8]">публикаций</span>
        </div>
        <button onClick={() => setListModal('following')} className="flex flex-col items-center active:opacity-60">
          <span className="text-base font-bold text-[#1F2A44]">{mockFollowing.length}</span>
          <span className="text-xs text-[#9AA3B8]">подписок</span>
        </button>
        <button onClick={() => setListModal('followers')} className="flex flex-col items-center active:opacity-60">
          <span className="text-base font-bold text-[#1F2A44]">{mockFollowers.length}</span>
          <span className="text-xs text-[#9AA3B8]">подписчиков</span>
        </button>
      </div>

      {/* Вкладки */}
      <div className="flex border-b border-[#DDE3EC] mb-4 -mx-4">
        {(['posts', 'replies', 'likes'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === t
                ? 'text-[#1F2A44] border-b-2 border-[#6B7FA8]'
                : 'text-[#9AA3B8]'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Контент вкладок */}
      {tab === 'posts' && (
        <div className="flex flex-col gap-4 pb-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
      {tab !== 'posts' && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <span className="text-[#C5CEDC] text-4xl">·</span>
          <span className="text-sm text-[#9AA3B8]">Пока ничего нет</span>
        </div>
      )}

      {/* ——— Bottom sheet: редактирование профиля ——— */}
      {editOpen && (
        <>
          {/* оверлей */}
          <div
            className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
            style={{ opacity: sheetVisible ? 1 : 0 }}
            onClick={closeEdit}
          />

          {/* sheet — совпадает по ширине с основным layout'ом */}
          <div
            className="fixed bottom-0 inset-x-0 max-w-sm mx-auto z-50 bg-white rounded-t-2xl flex flex-col transition-transform duration-300 ease-out"
            style={{ transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)' }}
          >
            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#DDE3EC]" />
            </div>

            {/* заголовок */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#DDE3EC] shrink-0">
              <button onClick={closeEdit} className="text-sm text-[#9AA3B8] active:opacity-60">
                Отмена
              </button>
              <span className="text-base font-bold text-[#1F2A44]">Редактировать профиль</span>
              <button
                onClick={saveEdit}
                className="text-sm font-bold text-[#6B7FA8] active:opacity-60"
              >
                Готово
              </button>
            </div>

            {/* поля */}
            <div className="px-4 py-5 flex flex-col gap-5 overflow-y-auto pb-10">
              {/* Имя */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#9AA3B8] uppercase tracking-wide">
                  Имя
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={50}
                  className="w-full bg-[#F3F6FC] rounded-xl px-4 py-3 text-sm text-[#1F2A44] placeholder:text-[#C5CEDC] outline-none focus:ring-2 focus:ring-[#6B7FA8]/30"
                  placeholder="Твоё имя"
                />
              </div>

              {/* Никнейм */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#9AA3B8] uppercase tracking-wide">
                  Никнейм
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9AA3B8]">@</span>
                  <input
                    type="text"
                    inputMode="url"
                    value={editHandle.replace(/^@/, '')}
                    onChange={(e) => {
                      // только латиница, цифры, _ и .
                      const clean = e.target.value
                        .replace(/^@/, '')
                        .replace(/[^a-zA-Z0-9._-]/g, '')
                        .toLowerCase();
                      setEditHandle('@' + clean);
                    }}
                    maxLength={30}
                    className="w-full bg-[#F3F6FC] rounded-xl pl-8 pr-4 py-3 text-sm text-[#1F2A44] placeholder:text-[#C5CEDC] outline-none focus:ring-2 focus:ring-[#6B7FA8]/30"
                    placeholder="nickname"
                  />
                </div>
              </div>

              {/* О себе */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#9AA3B8] uppercase tracking-wide">
                    О себе
                  </label>
                  <span className="text-xs text-[#C5CEDC]">{editBio.length}/150</span>
                </div>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={150}
                  rows={3}
                  className="w-full bg-[#F3F6FC] rounded-xl px-4 py-3 text-sm text-[#1F2A44] placeholder:text-[#C5CEDC] outline-none focus:ring-2 focus:ring-[#6B7FA8]/30 resize-none leading-relaxed"
                  placeholder="Расскажи о себе..."
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
