import Parser from 'rss-parser';


const parser = new Parser();
const GOOGLE_NEWS_WORLD_URL = 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en';
const CACHE_KEY = 'news:world';
const CACHE_TTL_SECONDS = 900; //15 min

async function newsRoutes(fastify) {
    fastify.get('/news', async(request, reply) => {
        // check cache
        // const cached = await fastify.redis.get(CACHE_KEY);
        // if (cached) {
        //     return JSON.parse(cached);
        // }

        //cache miss
        try {
            const feed = await parser.parseURL(GOOGLE_NEWS_WORLD_URL);
            const articles = feed.items.slice(0, 10).map((item) => {
                const summary = item.contentSnippet ?? item.content ?? item.description ?? item.summary ?? null;

                return {
                    title: item.title ?? null,
                    link: item.link ?? null,
                    source: item.source ?? null,
                    summary,
                    pubDate: item.pubDate ?? null,
                    publishedAt: item.pubDate ?? null
                };
            });

            await fastify.redis.set(CACHE_KEY, JSON.stringify(articles), 'EX', CACHE_TTL_SECONDS);

            return articles;
        } catch (err) {
            fastify.log.error({ err }, 'Failed to parse news feed data');
            return reply.code(502).send({ error: 'Unable to retrieve news at this time' });
        }
    }); 
}

export default newsRoutes;
