import Image from "next/image";
import Link from "next/link";
import Globe from "./components/Globe.jsx";
import NewsFeed from "./components/NewsFeed.jsx";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="absolute inset-0" />

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center pb-24 pt-[3.5rem]">
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
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,29,45,0.82)_0%,rgba(15,29,45,0.70)_24%,rgba(15,29,45,0.38)_55%,rgba(15,29,45,0.8)_100%)]" />
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
                Smarter global decisions, grounded in real-time trade signals.
              </p>

              <p className="mt-5 max-w-lg text-base leading-8 text-slate-200 sm:text-lg">
                Monitor sanctions exposure, geopolitical risk, and supply-chain shifts in one modern platform built for policy teams, analysts, and global operators.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/explore"
                  className="rounded-lg bg-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
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

        <section className="mt-24 flex w-full justify-center">
          <div className="relative w-full max-w-3xl">
            <div className="relative mx-auto aspect-square w-full max-w-[720px] min-h-[420px]">
              <div className="relative h-full w-full">
                <Globe />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 w-full bg-slate-900 px-6 py-14 text-slate-100 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
              <div>
                <p className="text-lg font-medium text-slate-100 sm:text-xl">International News</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-slate-500">What's trending lately</p>
              </div>
              <div className="h-px flex-1 bg-slate-700" />
            </div>
            <NewsFeed />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
