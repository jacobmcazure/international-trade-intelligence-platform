import Image from "next/image";
import Link from "next/link";
import Globe from "./components/Globe.jsx";
import NewsFeed from "./components/NewsFeed.jsx";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center pt-[3.5rem]">
        <section className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute bottom-3 left-4 z-20 max-w-xs text-[10px] text-slate-200/45 sm:left-6 sm:bottom-4">
            <span>Photo by </span>
            <a
              href="https://unsplash.com/@some_random_guy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              className="decoration-slate-200/40 underline-offset-2"
            >
              Alex Duffy
            </a>
            <span> on </span>
            <a
              href="https://unsplash.com/photos/docked-shipping-ship-on-body-of-water-a-E__y8y5Wo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              className="decoration-slate-200/40 underline-offset-2"
            >
              Unsplash
            </a>
          </div>
          <div className="absolute inset-0">
            <Image
              src="/alex-duffy-a-E__y8y5Wo-unsplash flipped.jpg"
              alt="Shipping lane and dockside view representing trade intelligence"
              width={1600}
              height={1200}
              className="h-full w-full object-cover object-center opacity-90"
            />
            {/* div here to darken bg image and apply gradient */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,29,45,0.8)_0%,rgba(15,29,45,0.7)_24%,rgba(15,29,45,0.38)_55%,rgba(15,29,45,0.8)_100%)]" />
          </div>

          <div className="relative mx-auto grid min-h-[620px] max-w-6xl items-center px-6 py-12 sm:px-8 lg:px-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-0 py-1 text-[10px] font-medium uppercase tracking-[0.32em] text-sky-100">
                Geo-intelligence platform
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                Trade Intel
              </h1>

              <p className="mt-4 text-xl font-medium tracking-tight text-sky-100 sm:text-2xl">
                Smarter global decisions, grounded in data straight from the United Nations.
              </p>

              <p className="mt-5 max-w-lg text-base leading-8 text-slate-200 sm:text-lg">
                Monitor sanctions exposure, trade routes, and tariffs in one platform built for policy teams, analysts, and global operators.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/explore"
                  className="rounded-lg bg-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-400"
                >
                  Get Started
                </Link>
                <Link
                  href="/about"
                  className="rounded-lg border border-slate-700 bg-slate-900/60 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800/80"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex w-full justify-center overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(transparent_0_39px,rgba(56,189,248,0.22)_39px_40px),linear-gradient(90deg,rgba(56,189,248,0.22)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20"
          />
          <div className="relative z-10 flex max-w-3xl flex-col justify-center gap-6">
              <p className="max-w-lg text-4xl">
                Explore International Trade flows and Country Economic History.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link 
                  href="/trade"
                  className="rounded-lg bg-blue-800 px-6 py-3 font-semibold text-slate-100 transition shadow-md shadow-blue-700/25 hover:bg-blue-700"
                  >
                  Bilateral Trade
                </Link>
                <Link
                  href="/history"
                  className="rounded-lg bg-blue-800 px-6 py-3 font-semibold text-slate-100 transition shadow-md shadow-blue-700/25 hover:bg-blue-700"
                >
                  Country Indicators
                </Link>
              </div>
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="relative mx-auto aspect-square w-full max-w-[720px] min-h-[420px]">
              <div className="relative h-full w-full">
                <Globe />
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/nasa-Q1p7bh3SHj8-unsplash.jpg"
              alt="NASA view of the world and it's atmosphere from space"
              width={1600}
              height={1200}
              className="h-full w-full object-cover object-center opacity-50"
            />
            <div className="absolute inset-0 bg-slate-900/70" />
          </div>
          <div className="relative px-6 py-14 text-slate-100 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-6xl">
              <div className="mb-6 flex items-center gap-4">
                <div>
                  <p className="text-lg font-medium text-slate-100 sm:text-xl">International News</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-slate-500">Globally Trending Articles</p>
                </div>
                <div className="h-px flex-1 bg-slate-700" />
              </div>
              <NewsFeed />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
