import WorldMap from "../components/WorldMap";
import SearchBar from "../components/SearchBar";

export default function explore() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-4 px-6 py-24 text-center">
            <div className="max-w-2xl">
                <h3 className="text-2xl font-semibold">World Map</h3>
                <p className="mt-2 text-sm text-gray-600">Use the interactive map below, or the search bar.</p>
            </div>
            <SearchBar />
            <WorldMap />
        </div>
    )
}