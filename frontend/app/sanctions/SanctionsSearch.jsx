'use client';

import { useRouter } from 'next/navigation';
import SearchBar from '../components/SearchBar';

export default function SanctionsSearch({ countries }) {
  const router = useRouter();

  const handleSelect = (country) => {
    if (country?.iso_code) {
      router.push(`/sanctions/${encodeURIComponent(country.iso_code)}`);
    }
  };

  return <SearchBar allCountryData={countries} onSearchSubmit={handleSelect} />;
}
