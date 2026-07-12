import Image from "next/image";
import Link from "next/link";
import Globe from "./components/Globe.jsx";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-mist-950 font-sans dark:bg-black">
      <Globe />
      <main className="flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl sm:text-5xl md:text-6xl">Geo-Intelligence Trade Platform</h1>
        <h3>International Relations Info, made easily accessible to you.</h3>
        <h4>Whether you're an economist, a student, or just curious, you can find
          what you're looking for here.
        </h4>
      </main>
      <div>
        <Link href="/explore" className="flex justify-center w-auto p-2 m-2 rounded-md shadow-md text-amber-100 bg-sky-500 hover:bg-sky-300">Get Started</Link>
      </div>
    </div>
  );
}
