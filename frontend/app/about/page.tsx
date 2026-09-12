

export default function About() {
    return (
        <main className="flex min-h-[calc(100vh-7rem)] items-center justify-center pb-16 sm:px-10">
            <article className="w-full p-7">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-sky-300">
                    About Trade Intel
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Making global trade easier to understand.
                </h1>

                <div className="mt-6 space-y-5 text-base leading-8 text-slate-300 sm:text-lg">
                    <p>
                        Trade Intel was created to make global economic data easier to
                        retrieve, explore, and analyze. Whether you are curious about
                        international trade or assessing risk professionally, this
                        platform brings important information together in a clear and
                        accessible way.
                    </p>
                    <p>
                        This project grew from a genuine interest in international
                        relations and trade, topics that will only become more important as
                        the global economy continues to evolve.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-slate-800 pt-6">
                    <p className="text-sm font-medium text-slate-200">Built by Jacob McEwen</p>
                    <a
                        href="https://github.com/jacobmcazure"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Jacob McEwen on GitHub"
                        className="text-sm font-medium text-sky-300 underline decoration-sky-300/40 underline-offset-4 transition hover:text-sky-200"
                    >
                        GitHub
                    </a>
                </div>
            </article>
        </main>
    );
}
