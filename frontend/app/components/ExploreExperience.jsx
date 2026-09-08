'use client';

import { useState } from "react";
import DetailsDrawer from "./DetailsDrawer";
import SearchBar from "./SearchBar";
import WorldMap from "./WorldMap";


export default function ExploreExperience({ countries }) {
    //console.log(countries)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    //const [allCountries, setAllCountries] = useState(''); // for querying against country list
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleSelect = (countrySelection) => {
        if (!countrySelection) return;

        const countryObject = 
            typeof countrySelection === 'string'
                ? countries.find((country) => country.name?.toLowerCase() === countrySelection.toLowerCase())
                : countrySelection;

        setSelectedCountry(countryObject || { name: countrySelection });
        setIsDrawerOpen(true);
    };

    return (
        <div className="relative min-h-screen w-full bg-blue-300 px-6 py-24 text-center">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4">
                <div className="max-w-2xl">
                    <h3 className="text-2xl font-semibold">World Map</h3>
                    <p className="mt-2 text-sm text-gray-600">Use the interactive map below, or the search bar.</p>
                </div>

                <SearchBar allCountryData={countries} onSearchSubmit={handleSelect} />
                <WorldMap onSelectCountry={handleSelect} />
            </div>

            <DetailsDrawer
                isOpen={isDrawerOpen}
                country={selectedCountry || 'Selected country'}
                onClose={() => setIsDrawerOpen(false)}
            >
                {selectedCountry ? (
                  <div className="space-y-4 text-left">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Region</p>
                      <p className="mt-1 text-gray-900">{selectedCountry.region || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">ISO Code</p>
                      <p className="mt-1 text-gray-900">{selectedCountry.iso_code || 'N/A'}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Population</p>
                        <p className="mt-1 text-gray-900">{selectedCountry.population?.toLocaleString() ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">GDP (USD)</p>
                        <p className="mt-1 text-gray-900">{selectedCountry.gdp_usd ? `$${Number(selectedCountry.gdp_usd).toLocaleString()}` : 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">GDP Year</p>
                      <p className="mt-1 text-gray-900">{selectedCountry.gdp_year ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Coordinates</p>
                      <p className="mt-1 text-gray-900">
                        {selectedCountry.latitude != null && selectedCountry.longitude != null
                          ? `${selectedCountry.latitude}, ${selectedCountry.longitude}`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-gray-900">No country selected</p>
                    <p className="mt-2">Search for a country or select one on the map to see details.</p>
                  </>
                )}
            </DetailsDrawer>
        </div>
    );
}
