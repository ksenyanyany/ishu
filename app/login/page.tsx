import Link from 'next/link';

export default function Home() {
  return (
    <main className="w-full max-w-sm flex flex-col gap-6 shrink-0">
      {/* нижняя карточка */}
      <div className="w-full bg-[#EDEFF3] rounded-2xl shadow-md p-6 flex flex-col items-center gap-4">

        <h1 className="text-5xl text-bold font-[var(--font-astroneer)] text-[#1F2A44]">
          Вход
        
        </h1>


        <input 
            type="email" 
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-[#D6DAE3] text-[#1F2A44] placeholder-[#4B5563] outline-none focus:ring-2 focus:ring-[#8E9BB5] transition-all font-[var(--font-inter)]"
        />

        <input 
            type="password" 
            placeholder="Пароль"
            className="w-full px-4 py-3 rounded-xl bg-[#D6DAE3] text-[#1F2A44] placeholder-[#4B5563] outline-none focus:ring-2 focus:ring-[#8E9BB5] transition-all font-[var(--font-inter)]"
        />

        <button className="w-full py-3 rounded-xl bg-[#8E9BB5] text-[#1F2A44] text-xl font-[var(--font-inter)] active:bg-[#68758D]">
          Войти
        </button>

        <div className="border-t border-gray-200 py-2 flex justify-between items-center text-[#94A3B8] text-sm gap-4">
            <span className='whitespace-nowrap'>Ещё нет аккаунта?</span>

            <Link href="/register"><button className="text-[#1F2A44] font-semibold hover:underline">
                Зарегистрироваться
            </button></Link>
        </div>

      </div>

    </main>
  )
}