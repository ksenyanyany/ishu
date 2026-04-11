'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const active = (path: string) => pathname === path;

  // потом придёт с бэка
  const currentUser = {
    initials: 'АМ',
    avatarUrl: null as string | null,
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-6 pt-3 pb-8 bg-[#D7E0EA]/90 backdrop-blur-sm border-t border-white/50">

      {/* Главная */}
      <Link href="/feed" className="flex flex-col items-center gap-1">
        <Image
          src={active('/feed') ? '/icons/home-active.svg' : '/icons/home.svg'}
          alt="главная"
          width={24}
          height={24}
        />
        {active('/feed') && <div className="w-1 h-1 rounded-full bg-[#6B7FA8]" />}
      </Link>

      {/* Поиск */}
      <Link href="/search" className="flex flex-col items-center gap-1">
        <Image
          src={active('/search') ? '/icons/search-active.svg' : '/icons/search.svg'}
          alt="поиск"
          width={24}
          height={24}
        />
        {active('/search') && <div className="w-1 h-1 rounded-full bg-[#6B7FA8]" />}
      </Link>

      {/* Создать пост */}
      <Link href="/create">
        <div className="w-11 h-11 rounded-full bg-[#6B7FA8]/75 flex items-center justify-center border-2 border-white/60 -mt-2">
          <Image src="/icons/plus.svg" alt="создать" width={18} height={18} />
        </div>
      </Link>

      {/* Активность */}
      <Link href="/activity" className="flex flex-col items-center gap-1">
        <div className="relative">
          <Image
            src={active('/activity') ? '/icons/chat-active.svg' : '/icons/chat.svg'}
            alt="активность"
            width={24}
            height={24}
          />
          {/* бейдж — потом будет динамическим с бэка */}
          <div className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#B06B8A] flex items-center justify-center border border-[#D7E0EA]">
            <span className="text-white text-[9px] font-bold">3</span>
          </div>
        </div>
        {active('/activity') && <div className="w-1 h-1 rounded-full bg-[#6B7FA8]" />}
      </Link>

      {/* Профиль */}
      <Link href="/profile" className="flex flex-col items-center gap-1">
        <div className="w-7 h-7 rounded-full bg-[#B8C4D8] flex items-center justify-center overflow-hidden">
          {currentUser.avatarUrl ? (
            <Image
              src={currentUser.avatarUrl}
              alt="профиль"
              width={28}
              height={28}
              className="object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-[#3D4D66]">
              {currentUser.initials}
            </span>
          )}
        </div>
        {active('/profile') && <div className="w-1 h-1 rounded-full bg-[#6B7FA8]" />}
      </Link>

    </nav>
  );
}