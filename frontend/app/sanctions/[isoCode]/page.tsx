import BackButton from "../../components/BackButton"

async function fetchJson(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }
    return res.json();
}

export default async function SanctionsByCountry({ params }: { params: Promise<{ isoCode: string }> }) {
    const { isoCode } = await params;
    const apiBaseUrl = process.env.API_BASE_URL;
    const countries = await fetchJson(`${apiBaseUrl}/countries`);
    const country = countries.find(
        (item: { iso_code?: string }) => item.iso_code?.toLowerCase() === isoCode.toLowerCase(),
    );

    if (!country) {
        return <div>Country not found</div>;
    }

    const sanctions = await fetchJson(
        `${apiBaseUrl}/sanctions?country=${encodeURIComponent(country.name)}`,
    );

    return (
        <div className="min-h-screen bg-slate-900 px-6 pb-16 pt-28 text-slate-100">
            <div className="flex flex-row self-start justify-between">
                <h1 className="text-4xl font-semibold">Sanctions: {country.name}</h1>
                <BackButton />
            </div>
            <p className="mt-2 text-slate-300">ISO-3 code: {country.iso_code}</p>
            <hr className="mt-4 border-gray-600" />
                <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {sanctions.data?.map((entity: { entity_id?: string; name?: string }) => (
                        <li key={entity.entity_id} className="p-2 text-base">
                            {entity.name ?? entity.entity_id}
                        </li>
                    ))}
                </ul>
            <hr className="mt-4 border-gray-600" />
            <p className="pt-14">
                You've reached the end of the sanctions list for this country.
            </p>
        </div>
    )
}
