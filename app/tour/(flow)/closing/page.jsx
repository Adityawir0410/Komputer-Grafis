// app/tour/(flow)/closing/page.jsx
import Link from "next/link";

export default function ClosingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-xl font-bold">Closing</h1>
      <p>You have completed the tour!</p>

      <Link href="/" className="rounded border px-4 py-2">
        Kembali ke Home
      </Link>
    </main>
  );
}
