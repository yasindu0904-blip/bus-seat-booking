// src/components/customer/CustomerBottomNav.tsx

import Link from 'next/link'

type CustomerBottomNavProps = {
  activeTab: 'book' | 'tickets'
}

export default function CustomerBottomNav({ activeTab }: CustomerBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 items-center justify-around rounded-t-3xl bg-white/90 px-4 pb-4 pt-3 shadow-[0_-4px_24px_rgba(22,29,24,0.08)] backdrop-blur-lg">
      <Link
        href="/dashboard"
        className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 active:scale-95 ${
          activeTab === 'book'
            ? 'bg-[#0d50d5] text-white'
            : 'text-[#3d4a41] hover:bg-gray-100'
        }`}
      >
        <span className="text-xl">🚌</span>
        <span className="text-[11px] font-semibold">Book Ticket</span>
      </Link>

      <Link
        href="/tickets"
        className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 active:scale-95 ${
          activeTab === 'tickets'
            ? 'bg-[#0d50d5] text-white'
            : 'text-[#3d4a41] hover:bg-gray-100'
        }`}
      >
        <span className="text-xl">🎫</span>
        <span className="text-[11px] font-semibold">My Tickets</span>
      </Link>
    </nav>
  )
}