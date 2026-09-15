export async function GET(request: Request) {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001'
    const url = new URL(request.url)

    const res = await fetch(
        `${apiBaseUrl}/sanctions`
    );

    const data = await res.json()


    return Response.json(data, {status: res.status})

}
