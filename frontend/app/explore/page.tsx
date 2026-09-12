import ExploreExperience from "../components/ExploreExperience";

export default async function ExplorePage() {
    const apiBaseUrl = process.env.API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/countries`, { cache: 'force-cache'});
    const countries = await res.json();
    console.log(countries)
    return <ExploreExperience countries={countries} />;
}
