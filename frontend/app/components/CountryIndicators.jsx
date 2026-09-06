"use client"

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Indicator
, { INDICATORS } from "../typings/indicatorTypes"


export default function CountryIndicators() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [country, setCountry] = useState("USA");
  const [indicator, setIndicator] = useState("FP.CPI.TOTL.ZG"); //inflation
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState({ country: null, indicator: null, units: null });
  const countries = useCountryList();
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  // Gets all country codes and names
  function useCountryList() {
    const [countries, setCountries] = useState([]);
    //const [loading, setLoading] = useState(true);

    useEffect(() => {
      const controller = new AbortController();

      async function load() {
        const res = await fetch(
          `/api/countries`,
          { signal: controller.signal },
        );
        const json = await res.json();
        console.log(json);
        setCountries(json ?? []);
        setLoading(false);
      }
      load();

      return () => controller.abort();
    }, []);

    return countries;
  }

  // Gets the specific country and indicator for the graph
  useEffect(() => {
    if (!country || !indicator) return;

    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      //setError(null);
      try {
        const res = await fetch(
          `/api/indicators?country=${country}&indicator=${indicator}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
       // console.log(json.data ?? json); //PROBLEM HERE
        setData(json.data);
        setMeta({ country: json.country, indicator: json.indicator, units: json.unit });
      } catch (err) {
        //setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    return () => controller.abort();
  }, [country, indicator]);

  // Sets dimensions of the graph
  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = Math.max(containerRef.current.clientWidth, 320);
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const points = data
      .map((point) => ({
        ...point,
        ref_year: Number(point.ref_year),
        value: point.value === null ? null : Number(point.value),
      }))
      .filter((point) => Number.isFinite(point.ref_year));

    if (points.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain(d3.extent(points, (d) => d.ref_year))
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(points, (d) => d.value))
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .defined((d) => d.value !== null)
      .x((d) => x(d.ref_year))
      .y((d) => y(d.value));

    svg.attr("width", width).attr("height", height);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("class", "fill-slate-400 text-xs")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text(meta.units ?? "");

    svg
      .append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .selectAll(".dot")
      .data(points.filter((d) => Number.isFinite(d.value)))
      .join("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.ref_year))
      .attr("cy", (d) => y(d.value))
      .attr("r", 3)
      .attr("fill", "steelblue");

    svg.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#1e293b") // slate-800, subtle
      .attr("stroke-width", 1);

    //   svg.selectAll(".tick text").attr("fill", "#94a3b8").attr("font-size", "13px"); // slate-400
    // svg.selectAll(".domain, .tick line").attr("stroke", "#475569"); // slate-600
    svg.selectAll(".tick text").attr("fill", "#94a3b8").attr("font-size", "13px");
    svg.select(".fill-slate-400").attr("font-size", "13px"); // your rotated unit label
  }, [data, indicator]);

  return (
    <div className="min-h-screen bg-slate-900 px-4 pt-24 pb-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-400">
          Country
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="min-w-52 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
          >
            {countries.map((c) => (
              <option key={c.iso_code} value={c.iso_code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        
        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-400">
          Indicator
          <select
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
            className="min-w-52 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
          >
            {INDICATORS.map((i) => (
              <option key={i.code} value={i.code}>
                {i.name}
              </option>
            ))}
          </select>
        </label>
        {loading && (
          <span className="pb-2 text-sm text-sky-300">Loading…</span>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-6">
        <h2 className="mb-2 text-lg font-medium text-slate-100">{meta.indicator} — {meta.country}</h2>
        <div ref={containerRef} style={{ width: "100%" }}>
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
}
