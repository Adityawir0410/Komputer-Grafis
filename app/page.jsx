// app/page.jsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image className="dark:invert" src="/next.svg" alt="Next.js" width={180} height={38} priority />
        <h1 className="font-bold text-xl">Virtual Wastewater Treatment Plant</h1>
        <p className="mb-6 text-center">Explore the process in VR</p>

        {/* ini yang penting */}
        <Link
          href="/tour/briefing"
          className="rounded-full bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors"
        >
          Start Tour
        </Link>
      </main>
    </div>
  );
}
