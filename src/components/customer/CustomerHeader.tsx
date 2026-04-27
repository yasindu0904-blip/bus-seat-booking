type CustomerHeaderProps = {
  firstName?: string | null
}

export default function CustomerHeader({ firstName }: CustomerHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#f4fbf3]">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a86b] text-lg font-bold text-white">
            {firstName?.charAt(0).toUpperCase() || 'C'}
          </div>

          <h1 className="text-2xl font-extrabold text-[#006d43]">
            Hello, {firstName || 'Traveler'}
          </h1>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-[#006d43] transition hover:bg-[#eef6ed] active:scale-95"
        >
          ⚙️
        </button>
      </div>
    </header>
  )
}