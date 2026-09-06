"use client";

import { useCallback, useEffect, useState } from "react";
import CountryTrade from "./CountryTrade";
import WorldTrade from "./WorldTrade";
import {
  COMMODITIES,
  YEARS,
  type GraphData,
  type TooltipState,
} from "../typings/tradeTypes";

export default function TradeMap() {
  const [hsCode, setHsCode] = useState("2709");
  const [year, setYear] = useState(2024);
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Single shared hover handler passed to every child view.
  const handleHover = useCallback(
    (iso: string | null, next: TooltipState | null) => {
      setHoveredCountry(iso);
      setTooltip(next);
    },
    [],
  );

  // Fetch data whenever the commodity or year filter changes.
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/data?year=${year}&hs_code=${encodeURIComponent(hsCode)}`,
          { signal: controller.signal },
        );
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }
        const json = (await res.json()) as GraphData;
        setData(json);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message ?? "Failed to load trade data");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [hsCode, year]);

  const selectedCommodity =
    COMMODITIES.find((c) => c.code === hsCode)?.name ?? hsCode;

  const hasData = !data || data.nodes.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 px-4 pt-24 pb-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Bilateral Trade Dependencies
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Who imports {selectedCommodity} from whom in {year}. Ribbon width
            reflects each importer&apos;s reliance on a partner.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-400">
            Commodity
            <select
              value={hsCode}
              onChange={(e) => setHsCode(e.target.value)}
              className="min-w-52 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
            >
              {COMMODITIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-400">
            Year
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="min-w-32 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          {loading && (
            <span className="pb-2 text-sm text-sky-300">Loading…</span>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            Could not load trade data: {error}
          </div>
        )}

        {!error && data && data.nodes.length === 0 && !loading && (
          <div className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-slate-300">
            No trade data available for {selectedCommodity} in {year}.
          </div>
        )}

        {!error && hasData && (
          <div className="flex flex-col gap-8">
            <WorldTrade
              worldTotals={data?.worldTotals ?? []}
              hoveredCountry={hoveredCountry}
              onHover={handleHover}
            />
            <CountryTrade
              data={data}
              hoveredCountry={hoveredCountry}
              onHover={handleHover}
            />
          </div>
        )}
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 max-w-xs rounded-md border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-lg"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
          dangerouslySetInnerHTML={{ __html: tooltip.html }}
        />
      )}
    </div>
  );
}
