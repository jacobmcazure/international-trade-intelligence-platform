import SanctionsSearch from './SanctionsSearch';

async function fetchData() {
    const apiBaseUrl = process.env.API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/countries`);
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

export default async function SanctionsPage() {
    const data = await fetchData();
    return (

        <main className="min-h-screen bg-background px-6 pb-16 pt-28 text-slate-100">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-4xl font-semibold">Sanctions</h1>
                <p className="mt-4 text-lg text-slate-300">
                    Search for a country to view all sanctioned entities.
                </p>
            </div>
            <SanctionsSearch countries={data} />
        </main>
    )
}
