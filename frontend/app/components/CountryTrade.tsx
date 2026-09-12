"use client";

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import type { GraphData, Link, WorldTotal, TooltipState } from "../typings/tradeTypes";

const CHORD_SIZE = 640;
const CHORD_INNER = CHORD_SIZE / 2 - 130;
const CHORD_OUTER = CHORD_INNER + 12;

const BAR_TOP_N = 12;
const BAR_WIDTH = 460;
const BAR_ROW_HEIGHT = 30;
const BAR_MARGIN = { top: 8, right: 72, bottom: 8, left: 132 };

const formatUsd = d3.format("$.3s");
const formatPct = d3.format(".1%");

interface CountryTradeProps {
  data: GraphData | null;
  hoveredCountry: string | null;
  onHover: (iso: string | null, tooltip: TooltipState | null) => void;
}

export default function CountryTrade({
  data,
  hoveredCountry,
  onHover,
}: CountryTradeProps) {
  const chordRef = useRef<SVGSVGElement | null>(null);
  const barRef = useRef<SVGSVGElement | null>(null);

  // Ordered list of country ISO codes + a stable index lookup for the matrix.
  const chord = useMemo(() => {
    if (!data || data.nodes.length === 0) return null;

    const ids = data.nodes.map((n) => n.id);
    const nameById = new Map(data.nodes.map((n) => [n.id, n.name]));
    const index = new Map(ids.map((id, i) => [id, i]));

    const matrix: number[][] = ids.map(() => ids.map(() => 0));
    for (const link of data.links) {
      const s = index.get(link.source);
      const t = index.get(link.target);
      if (s === undefined || t === undefined) continue;
      // value = pct_of_total: "target imports value% from source".
      matrix[s][t] += link.value;
    }

    // Lookup of the raw link for tooltip detail (partner -> reporter).
    const linkByPair = new Map<string, Link>();
    for (const link of data.links) {
      linkByPair.set(`${link.source}->${link.target}`, link);
    }

    const layout = d3.chord().padAngle(0.045).sortSubgroups(d3.descending)(
      matrix,
    );

    return { ids, nameById, index, layout, linkByPair };
  }, [data]);

  const color = useMemo(() => {
    if (!chord) return null;
    return d3
      .scaleOrdinal<string, string>()
      .domain(chord.ids)
      .range(chord.ids.map((_, i) => d3.interpolateTurbo(i / chord.ids.length)));
  }, [chord]);

  // Render the chord diagram.
  useEffect(() => {
    const svg = d3.select(chordRef.current);
    svg.selectAll("*").remove();
    if (!chord || !color) return;

    const { ids, nameById, layout, linkByPair } = chord;
    const arc = d3
      .arc<d3.ChordGroup>()
      .innerRadius(CHORD_INNER)
      .outerRadius(CHORD_OUTER);
    const ribbon = d3.ribbon<d3.Chord, d3.ChordSubgroup>().radius(CHORD_INNER);

    const g = svg
      .append("g")
      .attr("transform", `translate(${CHORD_SIZE / 2},${CHORD_SIZE / 2})`);

    // Ribbons (dependency flows).
    g.append("g")
      .attr("fill-opacity", 0.72)
      .selectAll("path")
      .data(layout)
      .join("path")
      .attr("d", ribbon as never)
      .attr("fill", (d) => color(ids[d.target.index]))
      .attr("stroke", "rgba(15,23,42,0.6)")
      .attr("data-source", (d) => ids[d.source.index])
      .attr("data-target", (d) => ids[d.target.index])
      .style("cursor", "pointer")
      .on("mousemove", (event, d) => {
        const sourceIso = ids[d.source.index];
        const targetIso = ids[d.target.index];
        const link = linkByPair.get(`${sourceIso}->${targetIso}`);
        onHover(targetIso, {
          x: event.clientX,
          y: event.clientY,
          html: `<strong>${nameById.get(targetIso)}</strong> imports from <strong>${nameById.get(
            sourceIso,
          )}</strong><br/>${
            link
              ? `${formatPct(link.value)} of imports · ${formatUsd(link.primary_value)}`
              : ""
          }`,
        });
      })
      .on("mouseleave", () => onHover(null, null));

    // Group arcs (countries).
    const group = g
      .append("g")
      .selectAll<SVGGElement, d3.ChordGroup>("g")
      .data(layout.groups)
      .join("g")
      .attr("data-iso", (d) => ids[d.index])
      .style("cursor", "pointer")
      .on("mousemove", (event, d) => {
        const iso = ids[d.index];
        onHover(iso, {
          x: event.clientX,
          y: event.clientY,
          html: `<strong>${nameById.get(iso)}</strong>`,
        });
      })
      .on("mouseleave", () => onHover(null, null));

    group
      .append("path")
      .attr("fill", (d) => color(ids[d.index]))
      .attr("stroke", "rgba(15,23,42,0.8)")
      .attr("d", arc as never);

    // Arc labels.
    group
      .append("text")
      .each((d) => {
        (d as d3.ChordGroup & { angle: number }).angle =
          (d.startAngle + d.endAngle) / 2;
      })
      .attr("dy", "0.35em")
      .attr("transform", (d) => {
        const angle = (d as d3.ChordGroup & { angle: number }).angle;
        const rotate = (angle * 180) / Math.PI - 90;
        const flip = angle > Math.PI ? "rotate(180)" : "";
        return `rotate(${rotate}) translate(${CHORD_OUTER + 8}) ${flip}`;
      })
      .attr("text-anchor", (d) =>
        (d as d3.ChordGroup & { angle: number }).angle > Math.PI
          ? "end"
          : "start",
      )
      .attr("fill", "#cbd5e1")
      .attr("font-size", 11)
      .text((d) => nameById.get(ids[d.index]) ?? ids[d.index]);
  }, [chord, color, onHover]);

  // Apply hover highlight to the chord without a full re-render.
  useEffect(() => {
    const svg = d3.select(chordRef.current);
    svg
      .selectAll<SVGPathElement, unknown>("path[data-source]")
      .attr("fill-opacity", function () {
        if (!hoveredCountry) return 0.72;
        const el = this as SVGPathElement;
        const isMatch =
          el.getAttribute("data-source") === hoveredCountry ||
          el.getAttribute("data-target") === hoveredCountry;
        return isMatch ? 0.9 : 0.08;
      });
    svg
      .selectAll<SVGGElement, unknown>("g[data-iso]")
      .attr("opacity", function () {
        if (!hoveredCountry) return 1;
        return (this as SVGGElement).getAttribute("data-iso") === hoveredCountry
          ? 1
          : 0.35;
      });
  }, [hoveredCountry, chord]);

  // Render the Top-N bar chart from worldTotals.
  useEffect(() => {
    const svg = d3.select(barRef.current);
    if (!data) {
      svg.selectAll("*").remove();
      return;
    }

    const rows = [...data.worldTotals]
      .sort((a, b) => b.primary_value - a.primary_value)
      .slice(0, BAR_TOP_N);

    const innerWidth = BAR_WIDTH - BAR_MARGIN.left - BAR_MARGIN.right;
    const innerHeight = rows.length * BAR_ROW_HEIGHT;
    const height = innerHeight + BAR_MARGIN.top + BAR_MARGIN.bottom;

    svg.attr("viewBox", `0 0 ${BAR_WIDTH} ${height}`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(rows, (d) => d.primary_value) ?? 1])
      .range([0, innerWidth]);
    const y = d3
      .scaleBand<string>()
      .domain(rows.map((d) => d.reporter_iso))
      .range([0, innerHeight])
      .padding(0.22);

    let root = svg.select<SVGGElement>("g.bar-root");
    if (root.empty()) {
      root = svg
        .append("g")
        .attr("class", "bar-root")
        .attr("transform", `translate(${BAR_MARGIN.left},${BAR_MARGIN.top})`);
    }

    const t = svg.transition().duration(750) as unknown as d3.Transition<
      d3.BaseType,
      unknown,
      null,
      undefined
    >;

    root
      .selectAll<SVGGElement, WorldTotal>("g.bar-row")
      .data(rows, (d) => d.reporter_iso)
      .join(
        (enter) => {
          const row = enter
            .append("g")
            .attr("class", "bar-row")
            .attr("data-iso", (d) => d.reporter_iso)
            .style("cursor", "pointer");
          row
            .append("rect")
            .attr("class", "bar-rect")
            .attr("height", y.bandwidth())
            .attr("y", (d) => y(d.reporter_iso) ?? 0)
            .attr("width", 0)
            .attr("rx", 3)
            .attr("fill", "#38bdf8");
          row
            .append("text")
            .attr("class", "bar-label")
            .attr("x", -8)
            .attr("y", (d) => (y(d.reporter_iso) ?? 0) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .attr("fill", "#cbd5e1")
            .attr("font-size", 11)
            .text((d) => d.reporter_name);
          row
            .append("text")
            .attr("class", "bar-value")
            .attr("y", (d) => (y(d.reporter_iso) ?? 0) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("dx", 6)
            .attr("fill", "#94a3b8")
            .attr("font-size", 11)
            .text((d) => formatUsd(d.primary_value));
          return row;
        },
        (update) => update,
        (exit) => exit.remove(),
      )
      .attr("data-iso", (d) => d.reporter_iso)
      .on("mousemove", (event, d) => {
        onHover(d.reporter_iso, {
          x: event.clientX,
          y: event.clientY,
          html: `<strong>${d.reporter_name}</strong><br/>Total imports · ${formatUsd(
            d.primary_value,
          )}`,
        });
      })
      .on("mouseleave", () => onHover(null, null))
      .each(function (d) {
        const row = d3.select(this);
        row
          .select<SVGRectElement>("rect.bar-rect")
          .transition(t)
          .attr("y", y(d.reporter_iso) ?? 0)
          .attr("height", y.bandwidth())
          .attr("width", x(d.primary_value));
        row
          .select<SVGTextElement>("text.bar-label")
          .transition(t)
          .attr("y", (y(d.reporter_iso) ?? 0) + y.bandwidth() / 2);
        row
          .select<SVGTextElement>("text.bar-value")
          .transition(t)
          .attr("x", x(d.primary_value))
          .attr("y", (y(d.reporter_iso) ?? 0) + y.bandwidth() / 2);
      });
  }, [data, onHover]);

  // Hover highlight for the bars.
  useEffect(() => {
    d3.select(barRef.current)
      .selectAll<SVGGElement, unknown>("g.bar-row")
      .attr("opacity", function () {
        if (!hoveredCountry) return 1;
        return (this as SVGGElement).getAttribute("data-iso") === hoveredCountry
          ? 1
          : 0.35;
      })
      .select("rect.bar-rect")
      .attr("fill", function () {
        const iso = (this as SVGRectElement).parentElement?.getAttribute(
          "data-iso",
        );
        return iso && iso === hoveredCountry ? "#7dd3fc" : "#38bdf8";
      });
  }, [hoveredCountry, data]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
      <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <h2 className="mb-2 text-sm font-medium text-slate-300">
          Dependency Chord
        </h2>
        <svg
          ref={chordRef}
          viewBox={`0 0 ${CHORD_SIZE} ${CHORD_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-auto w-full"
          role="img"
          aria-label="Chord diagram of bilateral trade dependencies"
        />
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <h2 className="mb-2 text-sm font-medium text-slate-300">
          Top {BAR_TOP_N} Importers (Total Value)
        </h2>
        <svg
          ref={barRef}
          preserveAspectRatio="xMidYMid meet"
          className="h-auto w-full"
          role="img"
          aria-label="Bar chart of top importing countries by total value"
        />
      </section>
    </div>
  );
}
