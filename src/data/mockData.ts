import type {
  Incident,
  Vessel,
  SuspectVessel,
  PipelineStage,
  AlertItem,
  DriftRun,
  HealthComponent,
  StatCardData,
} from "../types";

export const incidentStats: StatCardData[] = [
  { label: "ACTIVE INCIDENTS", value: "3", delta: "+1", icon: "warning" },
  { label: "SUSPECT VESSELS", value: "12", unit: "AIS", icon: "vessel" },
  { label: "DRIFT FORECAST", value: "48", unit: "hours", icon: "wave" },
  { label: "MODEL HEALTH", value: "98%", unit: "nominal", accent: "teal", icon: "pulse" },
];

export const vesselStats: StatCardData[] = [
  { label: "TRACKED VESSELS", value: "342", icon: "vessel" },
  { label: "AIS-DARK NOW", value: "7", accent: "red", icon: "dark" },
  { label: "FLAGGED / HIGH RISK", value: "12", icon: "flag" },
  { label: "NEW TODAY", value: "5", delta: "+5", icon: "plus" },
];

export const driftStats: StatCardData[] = [
  { label: "ACTIVE SIMULATIONS", value: "2", icon: "wave" },
  { label: "PARTICLES MODELED", value: "50", unit: "k", icon: "particles" },
  { label: "FORECAST HORIZON", value: "72", unit: "hours", icon: "clock" },
  { label: "LAST RUN", value: "6", unit: "min ago", accent: "teal", icon: "clock" },
];

export const alertStats: StatCardData[] = [
  { label: "OPEN ALERTS", value: "9", icon: "bell" },
  { label: "CRITICAL", value: "2", accent: "red", icon: "warning" },
  { label: "ACKNOWLEDGED TODAY", value: "14", icon: "check" },
  { label: "AVG RESPONSE", value: "4", unit: "min", accent: "teal", icon: "clock" },
];

export const healthStats: StatCardData[] = [
  { label: "OVERALL UPTIME", value: "99.4%", accent: "teal", icon: "pulse" },
  { label: "AVG INFERENCE LATENCY", value: "860", unit: "ms", icon: "clock" },
  { label: "DATA FRESHNESS", value: "2", unit: "min", icon: "wave" },
  { label: "FAILED JOBS · 24H", value: "1", accent: "amber", icon: "warning" },
];

export const incidents: Incident[] = [
  {
    id: "INC-2601",
    name: "Mumbai High Bilge Discharge",
    tonnage: "3.3 - 33.0 MT",
    status: "Active Interception Alert",
    severity: "critical",
    lat: 18.9822,
    lon: 72.4510,
    region: "Offshore Mumbai / Arabian Sea Corridor",
    timeDetected: "T-0 (Real-time Sentinel-1 SAR)",
    estimatedVolume: "3.3 - 33.0 MT",
    slickAreaKm2: 0.0776,
    windVector: "12.4 kt @ 245° (SW Monsoon)",
    currentVector: "0.42 m/s @ 165° (Arabian Sea Current)",
    suspects: [
      {
        rank: 1,
        name: "MT PACIFIC TRADER",
        confidencePct: 95,
        note: "Lagrangian backtrack intersects vessel AIS track with ±295.6m dispersion.",
        id: "SUSP-419001284",
        mmsi: "419001284",
        imo: "9481234",
        flag: "Panama",
        vesselType: "Crude Oil Tanker",
        aisGapDuration: "42 min during transit corridor",
        fuelTypeMatch: "Heavy Fuel Oil (HFO-380)",
        speedAnomaly: "-4.2 kt deceleration during discharge window",
        evidenceHash: "327d6d5c886fa74b4bc259e084440f3779e563cb9429ffe0bcd92e959a5bbe98",
        bayesianScores: {
          proximity: 94,
          fuelMatch: 88,
          driftBacktrack: 96,
          speedAnomaly: 82,
        },
        dossierSummary:
          "High probability attribution. 6h Lagrangian backward hindcast intersects vessel AIS track with ±295.6m dispersion.",
      },
    ],
  },
  {
    id: "INC-2602",
    name: "Malacca Strait Tanker Slick",
    tonnage: "2.8 - 28.2 MT",
    status: "Active Interception Alert",
    severity: "critical",
    lat: 2.4510,
    lon: 101.8840,
    region: "Southeast Asia / Malacca Choke Point",
    timeDetected: "T-0 (Real-time Sentinel-1 SAR)",
    estimatedVolume: "2.8 - 28.2 MT",
    slickAreaKm2: 0.0663,
    windVector: "8.5 kt @ 190°",
    currentVector: "0.55 m/s @ 315° (Malacca Jet)",
    suspects: [
      {
        rank: 1,
        name: "PACIFIC EXPLORER",
        confidencePct: 91,
        note: "Lagrangian trajectory matches vessel corridor track at T-5.2h within ±420m.",
        id: "SUSP-563082000",
        mmsi: "563082000",
        imo: "9314812",
        flag: "Singapore",
        vesselType: "Chemical / Oil Tanker",
        aisGapDuration: "28 min transit blackout",
        fuelTypeMatch: "Low Sulfur Marine Gasoil (LSMGO)",
        speedAnomaly: "-3.8 kt speed deviation",
        evidenceHash: "396c49a54736065c36a8bfbf258a789f8414d84e3b69eb7beca04e7ff81781a1",
        bayesianScores: {
          proximity: 91,
          fuelMatch: 89,
          driftBacktrack: 93,
          speedAnomaly: 84,
        },
        dossierSummary:
          "Lagrangian trajectory matches vessel corridor track at T-5.2h within ±420m.",
      },
    ],
  },
  {
    id: "INC-2603",
    name: "Gulf of Kutch Refinery Channel",
    tonnage: "4.2 - 42.0 MT",
    status: "Active Interception Alert",
    severity: "elevated",
    lat: 22.5210,
    lon: 69.1840,
    region: "Gujarat Coast / Jamnagar Terminal",
    timeDetected: "T-0 (Real-time Sentinel-1 SAR)",
    estimatedVolume: "4.2 - 42.0 MT",
    slickAreaKm2: 0.0915,
    windVector: "14.1 kt @ 280°",
    currentVector: "0.68 m/s @ 095° (Kutch Tidal Stream)",
    suspects: [
      {
        rank: 1,
        name: "OCEAN VOYAGER",
        confidencePct: 88,
        note: "Offshore bunkering discharge flagged. Bayesian attribution score: 88.4%.",
        id: "SUSP-538008120",
        mmsi: "538008120",
        imo: "9552140",
        flag: "Marshall Islands",
        vesselType: "Very Large Crude Carrier (VLCC)",
        aisGapDuration: "55 min anchored offshore",
        fuelTypeMatch: "Bunker C / Residual Fuel",
        speedAnomaly: "Unscheduled offshore drift pattern",
        evidenceHash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        bayesianScores: {
          proximity: 87,
          fuelMatch: 92,
          driftBacktrack: 89,
          speedAnomaly: 78,
        },
        dossierSummary:
          "Offshore bunkering discharge flagged. Bayesian attribution score: 88.4%.",
      },
    ],
  },
  {
    id: "INC-2604",
    name: "Strait of Hormuz Bunkering Leak",
    tonnage: "5.5 - 55.0 MT",
    status: "Active Interception Alert",
    severity: "critical",
    lat: 26.4820,
    lon: 56.3810,
    region: "Persian Gulf / Hormuz Corridor",
    timeDetected: "T-0 (Real-time Sentinel-1 SAR)",
    estimatedVolume: "5.5 - 55.0 MT",
    slickAreaKm2: 0.1140,
    windVector: "11.2 kt @ 330° (Shamal Wind)",
    currentVector: "0.38 m/s @ 220°",
    suspects: [
      {
        rank: 1,
        name: "STARLIGHT CARRIER",
        confidencePct: 83,
        note: "Nighttime transponder deactivation detected along inbound shipping lane.",
        id: "SUSP-538008129",
        mmsi: "538008129",
        imo: "9238192",
        flag: "Liberia",
        vesselType: "Aframax Tanker",
        aisGapDuration: "35 min radar shadow corridor",
        fuelTypeMatch: "IFO-180",
        speedAnomaly: "-5.1 kt sudden throttle cut",
        evidenceHash: "4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b",
        bayesianScores: {
          proximity: 84,
          fuelMatch: 81,
          driftBacktrack: 85,
          speedAnomaly: 79,
        },
        dossierSummary:
          "Nighttime transponder deactivation detected along inbound shipping lane.",
      },
    ],
  },
];

export const suppressedIncidents: Incident[] = [
  {
    id: "LOOK-01",
    name: "Bengal Bay Algal Bloom",
    tonnage: "0 MT (Suppressed)",
    status: "SUPPRESSED · Physics Filter Rejection",
    severity: "watch",
    lat: 19.45,
    lon: 85.80,
    region: "Bay of Bengal / Coast of Odisha",
    timeDetected: "T-0 (Automated Interception)",
    estimatedVolume: "0 MT (Natural Low-Reflectivity Phenomenon)",
    slickAreaKm2: 1.7452,
    windVector: "4.1 kt @ 080° (Calm Sea)",
    currentVector: "0.22 m/s @ 210°",
    suspects: [
      {
        rank: 1,
        name: "NO SUSPECT (Natural Bloom)",
        confidencePct: 0,
        note: "Morphometrics: AR 1.57:1 (< 1.6:1), Coverage 26.6% (> 10%). Correctly suppressed.",
        id: "NONE-LOOK-01",
        mmsi: "N/A",
        flag: "Natural Phenomenon",
        vesselType: "Trichodesmium Bloom",
        aisGapDuration: "N/A",
        fuelTypeMatch: "Non-Petroleum (Biological Organics)",
        speedAnomaly: "Zero velocity anomaly",
        evidenceHash: "9185dc5f5cde0ea10d21bccd661d39ed1f9032f3706384e43cf2101b0fb8b740",
        bayesianScores: {
          proximity: 5,
          fuelMatch: 0,
          driftBacktrack: 2,
          speedAnomaly: 0,
        },
        dossierSummary:
          "Physics-informed filter successfully intercepted and rejected this SAR anomaly. Aspect ratio 1.57 and 26.6% frame coverage indicate biological algal bloom or calm-sea wind shelter. Zero false alarm dispatched to Coast Guard.",
      },
    ],
  },
  {
    id: "LOOK-02",
    name: "Lakshadweep Low-Wind Shadow",
    tonnage: "0 MT (Suppressed)",
    status: "SUPPRESSED · Physics Filter Rejection",
    severity: "watch",
    lat: 9.20,
    lon: 72.85,
    region: "Lakshadweep Sea / Minicoy Channel",
    timeDetected: "T-0 (Automated Interception)",
    estimatedVolume: "0 MT (Natural Low-Reflectivity Phenomenon)",
    slickAreaKm2: 1.0076,
    windVector: "3.2 kt @ 120° (Low Wind)",
    currentVector: "0.15 m/s @ 190°",
    suspects: [
      {
        rank: 1,
        name: "NO SUSPECT (Calm Wind Shadow)",
        confidencePct: 0,
        note: "Morphometrics: AR 1.34:1 (< 1.6:1), Coverage 15.4% (> 10%). Correctly suppressed.",
        id: "NONE-LOOK-02",
        mmsi: "N/A",
        flag: "Natural Phenomenon",
        vesselType: "Wind Shadow / Calm Sea",
        aisGapDuration: "N/A",
        fuelTypeMatch: "Non-Petroleum",
        speedAnomaly: "Zero anomaly",
        evidenceHash: "16392f84b11e2fc44447c0e7161b9a699b8da9e27e16f6210ac99a78938588d0",
        bayesianScores: {
          proximity: 4,
          fuelMatch: 0,
          driftBacktrack: 1,
          speedAnomaly: 0,
        },
        dossierSummary:
          "Physics discriminator intercepted wind shadow shelter near Minicoy Atoll. High radar damping (2.39 dB) with diffuse circular boundary confirms natural calm water without surface hydrocarbons.",
      },
    ],
  },
];

export const suspects: SuspectVessel[] = incidents[0].suspects;

export const pipelineStatus: PipelineStage[] = [
  { label: "SAR / EO ingest", state: "live" },
  { label: "Drift model", state: "running" },
  { label: "Vessel match", state: "queued", detail: "Queued · 4" },
  { label: "Evidence store", state: "synced" },
  { label: "Alert routing", state: "held", detail: "1 held" },
];

export const vessels: Vessel[] = [
  { id: "1", name: "M/T Nordblom", mmsi: "419004812", flag: "Panama", type: "Tanker", speedKt: 21.4, aisStatus: "dark", riskScore: 87 },
  { id: "2", name: "M/T Kestrel", mmsi: "311887220", flag: "Marshall Is.", type: "Tanker", speedKt: 13.1, aisStatus: "live", riskScore: 61 },
  { id: "3", name: "M/T Vale", mmsi: "228004311", flag: "Liberia", type: "Tanker", speedKt: 9.8, aisStatus: "live", riskScore: 34 },
  { id: "4", name: "MV Bergen Star", mmsi: "257119004", flag: "Norway", type: "Cargo", speedKt: 16.0, aisStatus: "live", riskScore: 18 },
  { id: "5", name: "MV Talara", mmsi: "701234098", flag: "Peru", type: "Fishing", speedKt: 7.2, aisStatus: "dark", riskScore: 45 },
  { id: "6", name: "MT Solvik", mmsi: "259887002", flag: "Sweden", type: "Tanker", speedKt: 12.6, aisStatus: "live", riskScore: 9 },
];

export const fleetDistribution = [
  { label: "Tanker", count: 120, pct: 80 },
  { label: "Cargo", count: 90, pct: 60 },
  { label: "Fishing", count: 60, pct: 40 },
  { label: "Other", count: 72, pct: 48 },
];

export const topFlagStates = [
  { label: "Panama", count: 64 },
  { label: "Marshall Islands", count: 51 },
  { label: "Liberia", count: 47 },
  { label: "Norway", count: 33 },
];

export const driftParameters = [
  { label: "Ocean currents", value: "INCOIS HYCOM" },
  { label: "Wind field", value: "IMD GFS 0.25°" },
  { label: "Time step", value: "15 min" },
  { label: "Particle count", value: "50,000" },
  { label: "Diffusion coeff.", value: "10 m²/s" },
  { label: "Weathering model", value: "ADIOS2" },
];

export const driftQueue: DriftRun[] = [
  { id: "1", label: "INC-0417 · ensemble", horizon: "72h horizon", state: "running" },
  { id: "2", label: "INC-0418 · forward", horizon: "48h horizon", state: "queued" },
  { id: "3", label: "INC-0419 · backward", horizon: "24h hindcast", state: "queued" },
];

export const alerts: AlertItem[] = [
  { title: "AIS gap detected — M/T Nordblom", detail: "went dark near active drift cone · INC-0417", time: "14:12", severity: "critical" },
  { title: "Model confidence spike — M/T Nordblom", detail: "attribution score crossed 85% threshold", time: "14:34", severity: "critical" },
  { title: "New SAR pass ingested", detail: "reprocessing spill boundary for INC-0417", time: "13:58", severity: "elevated" },
  { title: "Drift forecast updated", detail: "revised wind data applied to run #4471", time: "13:20", severity: "watch" },
  { title: "Speed anomaly — M/T Kestrel", detail: "14.2 kt over posted route limit", time: "12:45", severity: "elevated" },
  { title: "Evidence chain synced", detail: "3 new records added to case INC-0417", time: "11:58", severity: "watch" },
];

export const healthComponents: HealthComponent[] = [
  { name: "SAR / EO ingest", status: "Operational", latency: "142 ms avg", spark: [18, 14, 16, 10, 12, 8, 10, 6] },
  { name: "Spill detection", status: "Operational", latency: "310 ms avg", spark: [10, 12, 9, 14, 11, 13, 10, 12] },
  { name: "Drift model", status: "Running", latency: "2.1 s avg", spark: [20, 16, 18, 10, 14, 8, 12, 9] },
  { name: "Vessel attribution", status: "Degraded", latency: "4.8 s avg", spark: [8, 14, 10, 18, 15, 22, 17, 20] },
  { name: "Evidence fusion", status: "Operational", latency: "96 ms avg", spark: [14, 12, 13, 11, 12, 10, 11, 9] },
  { name: "Alert engine", status: "Operational", latency: "44 ms avg", spark: [12, 13, 11, 12, 10, 12, 11, 10] },
];
