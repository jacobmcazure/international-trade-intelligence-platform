'use client';

import { useState, useEffect } from "react";
import World from "@react-map/world";
import SearchBar from "../components/SearchBar";


export default function WorldMap({ onSelectCountry }) {

    const searchCountry = (selection) => {
        const countryName =
            typeof selection === "string"
                ? selection
                : selection?.name || selection?.country || selection?.label || "Selected Country";

        onSelectCountry?.(countryName);
    };

    return (
        <World
            onSelect={searchCountry}
            size={1400}
            hoverColor="lightblue"
            selectColor="blue"
            hints="1"
            type="select-single"
        />
    );
}
