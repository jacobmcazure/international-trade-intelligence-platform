import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>Geo-Intelligence Trade Platform</h1>
        <h3>International Relations Info, made easily accessible to you.</h3>
        <h4>Whether you're an economist, a student, or just curious, you can find
          what you're looking for here.
        </h4>
      </main>
      <div>
        <Link href="/explore" className="flex justify-center w-auto p-2 m-2 rounded-md shadow-md bg-sky-500 hover:bg-sky-300">Get Started</Link>
      </div>
    </div>
  );
}
