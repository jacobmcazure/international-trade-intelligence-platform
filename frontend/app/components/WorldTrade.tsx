"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import type { Topology, GeometryObject } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import type { WorldTotal, TooltipState } from "../typings/tradeTypes";

const GEOMETRY_URL = "/countries-110m.json";

const MAP_WIDTH = 960;
const MAP_HEIGHT = 500;
const NO_DATA_FILL = "#334155";
const formatUsd = d3.format("$.3s");

// ISO 3166-1 alpha-3 -> numeric (M49). world-atlas country features are keyed
// by the zero-padded numeric id, while our data uses alpha-3, so we bridge here.
const A3_TO_NUM: Record<string, string> = {
  AFG: "004", ALA: "248", ALB: "008", DZA: "012", ASM: "016", AND: "020",
  AGO: "024", AIA: "660", ATA: "010", ATG: "028", ARG: "032", ARM: "051",
  ABW: "533", AUS: "036", AUT: "040", AZE: "031", BHS: "044", BHR: "048",
  BGD: "050", BRB: "052", BLR: "112", BEL: "056", BLZ: "084", BEN: "204",
  BMU: "060", BTN: "064", BOL: "068", BES: "535", BIH: "070", BWA: "072",
  BVT: "074", BRA: "076", IOT: "086", BRN: "096", BGR: "100", BFA: "854",
  BDI: "108", CPV: "132", KHM: "116", CMR: "120", CAN: "124", CYM: "136",
  CAF: "140", TCD: "148", CHL: "152", CHN: "156", CXR: "162", CCK: "166",
  COL: "170", COM: "174", COG: "178", COD: "180", COK: "184", CRI: "188",
  CIV: "384", HRV: "191", CUB: "192", CUW: "531", CYP: "196", CZE: "203",
  DNK: "208", DJI: "262", DMA: "212", DOM: "214", ECU: "218", EGY: "818",
  SLV: "222", GNQ: "226", ERI: "232", EST: "233", SWZ: "748", ETH: "231",
  FLK: "238", FRO: "234", FJI: "242", FIN: "246", FRA: "250", GUF: "254",
  PYF: "258", ATF: "260", GAB: "266", GMB: "270", GEO: "268", DEU: "276",
  GHA: "288", GIB: "292", GRC: "300", GRL: "304", GRD: "308", GLP: "312",
  GUM: "316", GTM: "320", GGY: "831", GIN: "324", GNB: "624", GUY: "328",
  HTI: "332", HMD: "334", VAT: "336", HND: "340", HKG: "344", HUN: "348",
  ISL: "352", IND: "356", IDN: "360", IRN: "364", IRQ: "368", IRL: "372",
  IMN: "833", ISR: "376", ITA: "380", JAM: "388", JPN: "392", JEY: "832",
  JOR: "400", KAZ: "398", KEN: "404", KIR: "296", PRK: "408", KOR: "410",
  KWT: "414", KGZ: "417", LAO: "418", LVA: "428", LBN: "422", LSO: "426",
  LBR: "430", LBY: "434", LIE: "438", LTU: "440", LUX: "442", MAC: "446",
  MDG: "450", MWI: "454", MYS: "458", MDV: "462", MLI: "466", MLT: "470",
  MHL: "584", MTQ: "474", MRT: "478", MUS: "480", MYT: "175", MEX: "484",
  FSM: "583", MDA: "498", MCO: "492", MNG: "496", MNE: "499", MSR: "500",
  MAR: "504", MOZ: "508", MMR: "104", NAM: "516", NRU: "520", NPL: "524",
  NLD: "528", NCL: "540", NZL: "554", NIC: "558", NER: "562", NGA: "566",
  NIU: "570", NFK: "574", MKD: "807", MNP: "580", NOR: "578", OMN: "512",
  PAK: "586", PLW: "585", PSE: "275", PAN: "591", PNG: "598", PRY: "600",
  PER: "604", PHL: "608", PCN: "612", POL: "616", PRT: "620", PRI: "630",
  QAT: "634", REU: "638", ROU: "642", RUS: "643", RWA: "646", BLM: "652",
  SHN: "654", KNA: "659", LCA: "662", MAF: "663", SPM: "666", VCT: "670",
  WSM: "882", SMR: "674", STP: "678", SAU: "682", SEN: "686", SRB: "688",
  SYC: "690", SLE: "694", SGP: "702", SXM: "534", SVK: "703", SVN: "705",
  SLB: "090", SOM: "706", ZAF: "710", SGS: "239", SSD: "728", ESP: "724",
  LKA: "144", SDN: "729", SUR: "740", SJM: "744", SWE: "752", CHE: "756",
  SYR: "760", TWN: "158", TJK: "762", TZA: "834", THA: "764", TLS: "626",
  TGO: "768", TKL: "772", TON: "776", TTO: "780", TUN: "788", TUR: "792",
  TKM: "795", TCA: "796", TUV: "798", UGA: "800", UKR: "804", ARE: "784",
  GBR: "826", USA: "840", UMI: "581", URY: "858", UZB: "860", VUT: "548",
  VEN: "862", VNM: "704", VGB: "092", VIR: "850", WLF: "876", ESH: "732",
  YEM: "887", ZMB: "894", ZWE: "716",
};

interface WorldTradeProps {
  worldTotals: WorldTotal[];
  hoveredCountry: string | null;
  onHover: (iso: string | null, tooltip: TooltipState | null) => void;
}

export default function WorldTrade({
  worldTotals,
  hoveredCountry,
  onHover,
}: WorldTradeProps) {
  const mapRef = useRef<SVGSVGElement | null>(null);
  const [topology, setTopology] = useState<Topology | null>(null);

  // Load the world geometry once from the public asset.
  useEffect(() => {
    const controller = new AbortController();
    fetch(GEOMETRY_URL, { signal: controller.signal })
      .then((res) => res.json() as Promise<Topology>)
      .then((topo) => setTopology(topo))
      .catch((err) => {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load world geometry:", err);
        }
      });
    return () => controller.abort();
  }, []);

  // Convert the TopoJSON to GeoJSON features once loaded.
  const countries = useMemo<FeatureCollection<Geometry> | null>(() => {
    if (!topology) return null;
    return feature(
      topology,
      topology.objects.countries as GeometryObject,
    ) as FeatureCollection<Geometry>;
  }, [topology]);

  // Numeric id -> total import value, plus a numeric id -> alpha-3 back-map so
  // hover can report the alpha-3 code the rest of the dashboard keys on.
  const { valueByNum, isoByNum, nameByNum, extent } = useMemo(() => {
    const valueByNum = new Map<string, number>();
    const isoByNum = new Map<string, string>();
    const nameByNum = new Map<string, string>();
    for (const w of worldTotals) {
      const num = A3_TO_NUM[w.reporter_iso];
      if (!num) continue;
      valueByNum.set(num, w.primary_value);
      isoByNum.set(num, w.reporter_iso);
      nameByNum.set(num, w.reporter_name);
    }
    const positives = worldTotals
      .map((w) => w.primary_value)
      .filter((v) => v > 0);
    const extent: [number, number] = [
      positives.length ? Math.min(...positives) : 1,
      positives.length ? Math.max(...positives) : 1,
    ];
    return { valueByNum, isoByNum, nameByNum, extent };
  }, [worldTotals]);

  const colorFor = useMemo(() => {
    const scale = d3
      .scaleSequential(d3.interpolateYlGnBu)
      .domain([Math.log10(extent[0]), Math.log10(extent[1])]);
    return (value: number | undefined) =>
      value && value > 0 ? scale(Math.log10(value)) : NO_DATA_FILL;
  }, [extent]);

  // Render the choropleth.
  useEffect(() => {
    const svg = d3.select(mapRef.current);
    svg.selectAll("*").remove();
    if (!countries) return;

    const projection = d3
      .geoNaturalEarth1()
      .fitSize([MAP_WIDTH, MAP_HEIGHT], countries);
    const path = d3.geoPath(projection);

    svg
      .append("g")
      .selectAll<SVGPathElement, (typeof countries.features)[number]>("path")
      .data(countries.features)
      .join("path")
      .attr("d", (d) => path(d) ?? "")
      .attr("data-iso", (d) => isoByNum.get(String(d.id)) ?? "")
      .attr("fill", (d) => colorFor(valueByNum.get(String(d.id))))
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 0.4)
      .style("cursor", "pointer")
      .on("mousemove", (event, d) => {
        const num = String(d.id);
        const iso = isoByNum.get(num);
        const value = valueByNum.get(num);
        const name = nameByNum.get(num) ?? "";
        if (!iso) {
          onHover(null, null);
          return;
        }
        onHover(iso, {
          x: event.clientX,
          y: event.clientY,
          html: `<strong>${name}</strong><br/>Total imports · ${
            value ? formatUsd(value) : "no data"
          }`,
        });
      })
      .on("mouseleave", () => onHover(null, null));
  }, [countries, valueByNum, isoByNum, nameByNum, colorFor, onHover]);

  // Hover highlight without re-rendering the geometry.
  useEffect(() => {
    d3.select(mapRef.current)
      .selectAll<SVGPathElement, unknown>("path[data-iso]")
      .attr("stroke", function () {
        const iso = (this as SVGPathElement).getAttribute("data-iso");
        return iso && iso === hoveredCountry ? "#38bdf8" : "#0f172a";
      })
      .attr("stroke-width", function () {
        const iso = (this as SVGPathElement).getAttribute("data-iso");
        return iso && iso === hoveredCountry ? 1.6 : 0.4;
      })
      .filter(function () {
        return (
          (this as SVGPathElement).getAttribute("data-iso") === hoveredCountry
        );
      })
      .raise();
  }, [hoveredCountry]);

  // Legend gradient stops (log-spaced ticks across the value domain).
  const legend = useMemo(() => {
    const scale = d3
      .scaleSequential(d3.interpolateYlGnBu)
      .domain([Math.log10(extent[0]), Math.log10(extent[1])]);
    const stops = d3.range(0, 1.01, 0.1).map((f) => ({
      offset: `${f * 100}%`,
      color: scale(Math.log10(extent[0]) + f * (Math.log10(extent[1]) - Math.log10(extent[0]))),
    }));
    const ticks = [0, 0.5, 1].map((f) => ({
      left: `${f * 100}%`,
      label: formatUsd(
        Math.pow(10, Math.log10(extent[0]) + f * (Math.log10(extent[1]) - Math.log10(extent[0]))),
      ),
    }));
    return { stops, ticks };
  }, [extent]);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-300">
          Global Import Value by Country
        </h2>
        <div className="w-48">
          <div className="h-2 w-full overflow-hidden rounded">
            <svg viewBox="0 0 100 4" preserveAspectRatio="none" className="h-2 w-full">
              <defs>
                <linearGradient id="world-legend" x1="0" x2="1" y1="0" y2="0">
                  {legend.stops.map((s) => (
                    <stop key={s.offset} offset={s.offset} stopColor={s.color} />
                  ))}
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100" height="4" fill="url(#world-legend)" />
            </svg>
          </div>
          <div className="relative mt-1 h-3 text-[9px] text-slate-500">
            {legend.ticks.map((tk) => (
              <span
                key={tk.left}
                className="absolute -translate-x-1/2"
                style={{ left: tk.left }}
              >
                {tk.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <svg
        ref={mapRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        role="img"
        aria-label="World choropleth of total import value by country"
      />
    </section>
  );
}
