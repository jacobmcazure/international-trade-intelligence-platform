async function NewsFeed() {
    const apiBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:3001';
    const res = await fetch(`${apiBaseUrl}/news`, { next: { revalidate: 900 } });

    if (!res.ok) {
        throw new Error(`Failed to fetch news: ${res.status}`);
    }

    const articles = await res.json();

    return (
        <ul className="mt-4 space-y-3">
            {articles.map((article) => {
                const articleText = article.summary;
                const articleDate = article.pubDate || article.publishedAt;

                return (
                    <li key={article.link} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-100 hover:text-sky-400">
                            {article.title}
                        </a>
                        {/* {articleText && (
                            <p className="mt-1 text-sm text-slate-300">{articleText}</p>
                        )} */}
                        {articleDate && (
                            <time className="mt-1 block text-xs text-slate-400" dateTime={articleDate}>
                                {articleDate}
                            </time>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

export default NewsFeed;
