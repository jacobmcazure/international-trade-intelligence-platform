export interface Link {
  source: string;
  target: string;
  value: number;
  primary_value: number;
  hs_code: string;
}

export interface Node {
  id: string;
  name: string;
}

export interface WorldTotal {
  reporter_iso: string;
  reporter_name: string;
  primary_value: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
  worldTotals: WorldTotal[];
}

export interface TooltipState {
  x: number;
  y: number;
  html: string;
}

export interface Commodity {
  code: string;
  name: string;
}

export const COMMODITIES: Commodity[] = [
  { code: "0901", name: "Coffee" },
  { code: "2709", name: "Crude Oil" },
  { code: "2710", name: "Refined Petroleum" },
  { code: "2711", name: "Petroleum Gas" },
  { code: "8542", name: "Integrated Circuits" },
  { code: "8471", name: "Computers" },
  { code: "8703", name: "Vehicles" },
  { code: "8708", name: "Vehicle Parts" },
  { code: "3004", name: "Medications" },
  { code: "3002", name: "Vaccines/Blood" },
  { code: "29", name: "Organic Chemicals" },
];

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
