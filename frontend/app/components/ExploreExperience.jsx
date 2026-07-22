'use client';

import { useState } from "react";
import DetailsDrawer from "./DetailsDrawer";
import SearchBar from "./SearchBar";
import WorldMap from "./WorldMap";

export default function ExploreExperience() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("A country");

    const handleSelect = (countryName) => {
        setSelectedCountry(countryName || "Selected country");
        setIsDrawerOpen(true);
    };

    return (
        <div className="relative min-h-screen w-full bg-blue-300 px-6 py-24 text-center">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4">
                <div className="max-w-2xl">
                    <h3 className="text-2xl font-semibold">World Map</h3>
                    <p className="mt-2 text-sm text-gray-600">Use the interactive map below, or the search bar.</p>
                </div>

                <SearchBar onSearchSubmit={handleSelect} />
                <WorldMap onSelectCountry={handleSelect} />
            </div>

            <DetailsDrawer
                isOpen={isDrawerOpen}
                title={selectedCountry}
                onClose={() => setIsDrawerOpen(false)}
            >
                <p className="font-medium text-gray-900">Placeholder details</p>
                <p className="mt-2">This drawer opens for search and map interactions without connecting to any live data yet.</p>
            </DetailsDrawer>
        </div>
    );
}
