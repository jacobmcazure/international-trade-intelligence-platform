export async function GET(request: Request) {
    const apiBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:3001';

    const res = await fetch(`${apiBaseUrl}/countries/codes`);
    const data = await res.json();

    return Response.json(data, { status: res.status });
}
