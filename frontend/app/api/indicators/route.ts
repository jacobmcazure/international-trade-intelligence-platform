export async function GET(request: Request) {
    const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:3001";
    const { searchParams } = new URL(request.url);

    const country = searchParams.get("country");
    const indicator = searchParams.get("indicator");

    const res = await fetch(
        `${apiBaseUrl}/indicators?iso3=${encodeURIComponent(country ?? "")}&indicator_code=${encodeURIComponent(indicator ?? "")}`
    );

    const data = await res.json()

    return Response.json(data, { status: res.status })

}
