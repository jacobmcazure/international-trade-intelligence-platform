import CountryIndicators from "../components/CountryIndicators";

export default async function history() {
    // const apiBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:3001';
    // const res = await fetch(`${apiBaseUrl}/indicators?iso3=USA&indicator_code=NY.GDP.PKTP.CD`);

    // if (!res.ok) {
    //     throw new Error(`Failed to load indicators: ${res.status}`);
    // }

    // const { data, indicator } = await res.json();

    return (
       <CountryIndicators /> 
    )
}
