'use client';

import { useState, useEffect } from "react";
import World from "@react-map/world";
//import { useNavigate } from "react-router-dom";

// import { csv } from "d3-fetch";
// import { scaleLinear } from "d3-scale";
// import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps"

// const geoUrl = "/features.json";

// const colorScale = scaleLinear()
//   .domain([0.29, 0.68])
//   .range(["#ffedea", "#ff5233"]);

export default function WorldMap() {

    //const a = useNavigate();
    const redirect = (sc) => {
        //direct country click to here (eventually put it in search and trigger it)
    }

    return(
        <World onSelect={redirect} size={1200} hoverColor="lightblue" type='select-single'/>
    )

//     const [data, setData] = useState([]);

//     useEffect(() => {
//         csv('/vulnerability.csv')
//             .then((loadedData) => {
//                 setData(loadedData);
//             })
//             .catch((error) => {
//                 console.error('Failed to load vulnerability data:', error);
//             });
//     }, []);

//     return (
//         <ComposableMap
//         projectionConfig={{
//             rotate: [-10, 0, 0],
//             scale: 147
//         }}
//         >
//         <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
//         <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
//         {data.length > 0 && (
//             <Geographies geography={geoUrl}>
//             {({ geographies }) =>
//                 geographies.map((geo) => {
//                 const d = data.find((s) => s.ISO3 === geo.id);
//                 return (
//                     <Geography
//                     key={geo.rsmKey}
//                     geography={geo}
//                     fill={d ? colorScale(d["2017"]) : "#F5F4F6"}
//                     />
//                 );
//                 })
//             }
//             </Geographies>
//         )}
//         </ComposableMap>
//     );
    
    // const geoUrl =
    //   "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"
    // return(
    //     <ComposableMap>
    //         <Geographies geography={geoUrl}>
    //             {
    //                 ({ geographies }) =>
    //                     geographies.map((geo) => (
    //                         <Geography key={geo.rsmKey} geography={geo} />
    //                 ))
    //             }
    //         </Geographies>
    //     </ComposableMap>
    // )
}