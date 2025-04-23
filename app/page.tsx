import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-indigo-500 p-4 text-white">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl">Gil's Number Quest</h1>
        <p className="max-w-[600px] text-xl">A math adventure for young explorers!</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="./game">
            <Button size="lg" className="h-16 w-40 rounded-full bg-amber-500 text-xl hover:bg-amber-600">
              Play!
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
