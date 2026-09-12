export async function GET(request: Request) {
    const apiBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:3001';
    const { searchParams } = new URL(request.url);

    const year = searchParams.get('year') ?? '2025';
    const hs_code = searchParams.get('hs_code') ?? '2709';

    const res = await fetch(
        `${apiBaseUrl}/trade/dependencies?year=${encodeURIComponent(year)}&hs_code=${encodeURIComponent(hs_code)}`
    );

    const data = await res.json();

    return Response.json(data, { status: res.status });
}
