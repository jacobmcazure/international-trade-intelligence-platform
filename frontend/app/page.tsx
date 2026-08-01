import Link from "next/link";
import Globe from "./components/Globe.jsx";
import NewsFeed from "./components/NewsFeed.jsx";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(5,8,20,0.98))]" />

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-24 sm:px-8 lg:px-10">
        <section className="w-full max-w-5xl text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Geo-Intelligence Trade Platform</p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Data-driven trade intelligence for global policy and sanctions.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
            Explore how international relations, sanctions, and market signals intersect with a single modern platform built for analysts and decision-makers.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/explore"
              className="rounded-full bg-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800/80"
            >
              Learn More
            </Link>
          </div>
        </section>

        <section className="mt-24 flex w-full justify-center">
          <div className="relative w-full max-w-3xl">
            <div className="relative mx-auto aspect-square w-full max-w-[720px] min-h-[420px]">
              <div className="relative h-full w-full">
                <Globe />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center mt-24">
          <div className="relative w-full justify-center">
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              International News
            </p>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">What's trending lately</p>
            <NewsFeed />
          </div>
        </section>

      </div>
    </div>
  );
}
