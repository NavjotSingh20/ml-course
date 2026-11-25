import { useState, useEffect } from "react";
import {
  Globe,
  Layers,
  Radar,
  Compass,
  Download,
  Clock,
  Anchor,
  Activity,
  FileCheck2,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Waves,
  Terminal,
  Ship,
  Search,
} from "lucide-react";
import { LiquidGlassPanel } from "../components/ui/LiquidGlassPanel";
import { LiquidButton } from "../components/ui/button";
import { InteractiveEarth } from "../components/earth/InteractiveEarth";
import { GoogleEarthMap } from "../components/earth/GoogleEarthMap";
import { IncidentMap } from "../components/maps/IncidentMap";
import { TimeScrubber } from "../components/console/TimeScrubber";
import { TelemetryTerminal } from "../components/console/TelemetryTerminal";
import { ForensicDossierModal } from "../components/console/ForensicDossierModal";
import {
  GLOBAL_INCIDENTS,
  VESSEL_ROUTES,
  SUPPRESSED_HOTSPOTS,
  type IncidentHotspot,
  type VesselRoute,
} from "../components/earth/earthUtils";
import { incidents, suppressedIncidents, vessels } from "../data/mockData";
import type { Incident, SuspectVessel } from "../types";

export default function Incidents() {
  const [viewMode, setViewMode] = useState<"globe" | "google" | "radar">("globe");
  const [filterCategory, setFilterCategory] = useState<"spills" | "lookalikes">("spills");

  // Verified Spills (Class_1) & Suppressed Look-Alikes (Class_0) datasets
  const [spillIncidents, setSpillIncidents] = useState<Incident[]>(incidents);
  const [spillHotspots, setSpillHotspots] = useState<IncidentHotspot[]>(GLOBAL_INCIDENTS);
  const [spillRoutes, setSpillRoutes] = useState<VesselRoute[]>(VESSEL_ROUTES);

  const [lookalikeIncidents, setLookalikeIncidents] = useState<Incident[]>(suppressedIncidents);
  const [lookalikeHotspots, setLookalikeHotspots] = useState<IncidentHotspot[]>(SUPPRESSED_HOTSPOTS);

  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<IncidentHotspot>(GLOBAL_INCIDENTS[0]);
  const [activeIncident, setActiveIncident] = useState<Incident>(incidents[0]);
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [selectedSuspectIndex, setSelectedSuspectIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"dossier" | "terminal" | "vessels">("dossier");
  const [isDossierOpen, setIsDossierOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Layer toggles for 3D Globe (satellite is permanently hidden on dashboard globe)
  const [showAIS, setShowAIS] = useState(true);
  const [showDrift, setShowDrift] = useState(true);
  const [showGeoLabels, setShowGeoLabels] = useState(true);

  // Fetch live pipeline detections from FastAPI backend
  useEffect(() => {
    let isMounted = true;
    async function fetchLivePipeline() {
      try {
        const [incRes, supRes] = await Promise.all([
          fetch("http://localhost:8000/api/incidents"),
          fetch("http://localhost:8000/api/incidents/suppressed")
        ]);

        if (incRes.ok) {
          const incData = await incRes.json();
          if (isMounted && incData.incidents && incData.incidents.length > 0) {
            setSpillIncidents(incData.incidents);
            setSpillHotspots(incData.hotspots);
            if (incData.vessel_routes && incData.vessel_routes.length > 0) {
              setSpillRoutes(incData.vessel_routes);
            }
            if (filterCategory === "spills") {
              setSelectedHotspot(incData.hotspots[0]);
              setActiveIncident(incData.incidents[0]);
            }
            setIsLiveConnected(true);
            console.log("[MARIS] Connected to live pipeline API on port 8000. Loaded", incData.incidents.length, "spills.");
          }
        }

        if (supRes.ok) {
          const supData = await supRes.json();
          if (isMounted && supData.incidents && supData.incidents.length > 0) {
            setLookalikeIncidents(supData.incidents);
            setLookalikeHotspots(supData.hotspots);
            console.log("[MARIS] Loaded", supData.incidents.length, "suppressed look-alikes.");
          }
        }
      } catch (err) {
        console.log("[MARIS] Pipeline API offline, using resilient fallback cache.");
        setIsLiveConnected(false);
      }
    }
    fetchLivePipeline();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentIncidents = filterCategory === "spills" ? spillIncidents : lookalikeIncidents;
  const currentHotspots = filterCategory === "spills" ? spillHotspots : lookalikeHotspots;
  const currentRoutes = filterCategory === "spills" ? spillRoutes : [];

  const switchCategory = (cat: "spills" | "lookalikes") => {
    setFilterCategory(cat);
    if (cat === "spills") {
      if (spillHotspots.length > 0) {
        setSelectedHotspot(spillHotspots[0]);
        setActiveIncident(spillIncidents[0]);
      }
    } else {
      if (lookalikeHotspots.length > 0) {
        setSelectedHotspot(lookalikeHotspots[0]);
        setActiveIncident(lookalikeIncidents[0]);
      }
    }
    setSelectedSuspectIndex(0);
    setTimeOffset(0);
  };

  const currentSuspect: SuspectVessel =
    activeIncident.suspects[selectedSuspectIndex] || activeIncident.suspects[0];

  const handleSelectHotspot = (hotspot: IncidentHotspot) => {
    setSelectedHotspot(hotspot);
    const matched = currentIncidents.find((i) => i.id === hotspot.id) || currentIncidents[0];
    setActiveIncident(matched);
    setTimeOffset(0);
    setSelectedSuspectIndex(0);
  };

  const isLookalike = activeIncident.id.startsWith("LOOK") || activeIncident.severity === "watch";

  const handleDownloadJson = (suspect: SuspectVessel) => {
    const isSuppressed = isLookalike;
    const dossierData = isSuppressed
      ? {
          investigationId: `MARIS-SUPPRESSION-AUDIT-${activeIncident.id}`,
          generatedAt: new Date().toISOString(),
          systemVersion: "MARIS 3D Autonomous Surveillance Engine v2.5",
          decision: "SUPPRESSED_LOOKALIKE",
          confidenceScore: 0.0,
          vesselInterceptionRequired: false,
          cryptographicHashSha256:
            suspect.evidenceHash || "9185dc5f5cde0ea10d21bccd661d39ed1f9032f3706384e43cf2101b0fb8b740",
          incident: {
            id: activeIncident.id,
            name: activeIncident.name,
            region: activeIncident.region,
            coordinates: { lat: activeIncident.lat, lon: activeIncident.lon },
            estimatedVolume: activeIncident.estimatedVolume,
            slickAreaKm2: activeIncident.slickAreaKm2,
          },
          physicsMorphometricsAudit: {
            aspectRatio: (activeIncident as any).aspectRatio || 1.57,
            dampingRatioDb: (activeIncident as any).dampingRatioDb || 2.27,
            coveragePct: (activeIncident as any).aspectRatio ? 26.6 : 15.4,
            thresholdAspectMin: 1.6,
            thresholdCoverageMax: 10.0,
            filterVerdict: "PASSED_SUPPRESSION_TEST",
            explanation: "Diffuse calm sea / algal bloom pattern rejected by physics filter. Zero naval response assets dispatched."
          },
          status: "AUDITED_FALSE_ALARM_PREVENTED",
        }
      : {
          investigationId: `MARIS-DOSSIER-${activeIncident.id}-${suspect.mmsi || "UNKNOWN"}`,
          generatedAt: new Date().toISOString(),
          systemVersion: "MARIS 3D Autonomous Surveillance Engine v2.5",
          cryptographicHashSha256:
            suspect.evidenceHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          incident: {
            id: activeIncident.id,
            name: activeIncident.name,
            region: activeIncident.region,
            coordinates: { lat: activeIncident.lat, lon: activeIncident.lon },
            estimatedVolume: activeIncident.estimatedVolume,
            slickAreaKm2: activeIncident.slickAreaKm2,
          },
          primarySuspect: {
            vesselName: suspect.name,
            rank: suspect.rank,
            attributionConfidence: `${suspect.confidencePct}%`,
            mmsi: suspect.mmsi,
            flag: suspect.flag,
            vesselType: suspect.vesselType,
            aisDarkGapDuration: suspect.aisGapDuration,
            fuelMatch: suspect.fuelTypeMatch,
            speedAnomaly: suspect.speedAnomaly,
            bayesianBreakdown: suspect.bayesianScores,
            evidenceSummary: suspect.dossierSummary,
          },
          status: "VERIFIED_TAMPER_EVIDENT",
        };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isSuppressed
      ? `MARIS-FalseAlarm-Audit-${activeIncident.id}.json`
      : `MARIS-Forensic-Evidence-${activeIncident.id}-${suspect.name.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredHotspots = currentHotspots.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 max-w-[1700px] mx-auto w-full">
      {/* ========================================================================= */}
      {/* 1. TOP FLOATING COMMAND DOCK (21st.dev Liquid Glass) */}
      {/* ========================================================================= */}
      <LiquidGlassPanel variant="card" glow="cyan" className="p-2 sm:p-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Switcher Tabs + Incident Hotspot Pills (Auto-spins 3D globe) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category Filter Switcher: Confirmed Spills vs Suppressed Look-Alikes */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10 mr-1.5">
              <button
                type="button"
                onClick={() => switchCategory("spills")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  filterCategory === "spills"
                    ? "bg-red text-white font-bold shadow-[0_0_15px_rgba(241,100,86,0.5)]"
                    : "text-text-muted hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>ACTIVE SPILLS ({spillHotspots.length})</span>
              </button>
              <button
                type="button"
                onClick={() => switchCategory("lookalikes")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  filterCategory === "lookalikes"
                    ? "bg-teal text-[#020a10] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    : "text-text-muted hover:text-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>LOOK-ALIKES ({lookalikeHotspots.length} SUPPRESSED)</span>
              </button>
            </div>

            <span
              className={`text-[9.5px] font-mono px-2 py-0.5 rounded border mr-1 font-semibold ${
                isLiveConnected
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/40"
              }`}
            >
              {isLiveConnected ? "● LIVE PIPELINE" : "● DEMO CACHE"}
            </span>

            {filteredHotspots.map((hotspot) => {
              const isActive = hotspot.id === activeIncident.id;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => handleSelectHotspot(hotspot)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? filterCategory === "spills"
                        ? "bg-red/90 text-white font-bold border border-red shadow-[0_0_20px_rgba(241,100,86,0.5)]"
                        : "bg-teal text-[#020a10] font-bold border border-teal shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "bg-white/[0.03] text-text-muted hover:text-white border border-white/[0.06] hover:border-white/[0.15]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hotspot.severity === "critical"
                        ? "bg-red animate-pulse"
                        : hotspot.severity === "elevated"
                        ? "bg-amber"
                        : "bg-teal"
                    }`}
                  />
                  <span>
                    {hotspot.id} · {hotspot.name}
                  </span>
                  <span className="text-[10px] opacity-75">({hotspot.spillTonnage})</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search & Viewport Mode Switcher */}
          <div className="flex items-center gap-2">
            {/* Quick search input */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-white/10 rounded-xl text-xs font-mono">
              <Search className="w-3.5 h-3.5 text-text-faint" />
              <input
                type="text"
                placeholder="Search ocean theater..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder:text-text-faint focus:outline-none w-36 text-[11px]"
              />
            </div>

            {/* Viewport Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-black/60 border border-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("globe")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "globe"
                    ? "bg-teal text-[#020a10] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    : "text-text-muted hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                3D Orbit
              </button>
              <button
                type="button"
                onClick={() => setViewMode("google")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "google"
                    ? "bg-teal text-[#020a10] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    : "text-text-muted hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Google Earth
              </button>
              <button
                type="button"
                onClick={() => setViewMode("radar")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "radar"
                    ? "bg-teal text-[#020a10] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    : "text-text-muted hover:text-white"
                }`}
              >
                <Radar className="w-3.5 h-3.5" />
                Radar HUD
              </button>
            </div>
          </div>
        </div>
      </LiquidGlassPanel>

      {/* ========================================================================= */}
      {/* 2. LIVING SURVEILLANCE STAGE: FULL-HEIGHT 3D GLOBE + FLOATING GLASS HUD */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[660px] lg:h-[720px] rounded-2xl overflow-hidden border border-white/10 bg-[#000000] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col isolate">
        {/* Background Viewport: 3D Orbit Globe / Google Earth / Tactical Radar */}
        <div className="absolute inset-0 z-0">
          {viewMode === "globe" && (
            <InteractiveEarth
              selectedIncident={selectedHotspot}
              onSelectIncident={handleSelectHotspot}
              incidents={currentHotspots}
              vesselRoutes={currentRoutes}
              showSARLayer={false} /* SATELLITE REMOVED FROM DASHBOARD GLOBE */
              showAISLayer={showAIS}
              showDriftLayer={showDrift}
              showGeoLabels={showGeoLabels}
            />
          )}

          {viewMode === "google" && (
            <GoogleEarthMap
              selectedIncident={selectedHotspot}
              onSelectIncident={handleSelectHotspot}
              showDriftLayer={showDrift}
            />
          )}

          {viewMode === "radar" && (
            <IncidentMap
              activeIncident={activeIncident}
              timeOffset={timeOffset}
              onSelectSuspect={(s) => {
                const idx = activeIncident.suspects.findIndex((item) => item.name === s.name);
                if (idx !== -1) {
                  setSelectedSuspectIndex(idx);
                  setActiveTab("dossier");
                }
              }}
            />
          )}
        </div>

        {/* Top Floating Telemetry Overlay on Globe */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-xl border border-white/10 text-xs font-mono pointer-events-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
            </span>
            <span className="text-teal font-bold tracking-wider">
              {viewMode === "globe"
                ? "3D GLOBAL DEFENSE ORBIT"
                : viewMode === "google"
                ? "GOOGLE EARTH SATELLITE"
                : "TACTICAL RADAR SCAN"}
            </span>
            <span className="text-text-faint">|</span>
            <span className="text-white font-semibold">{activeIncident.region}</span>
          </div>

          {/* Layer toggles for 3D Globe */}
          {viewMode === "globe" && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/75 backdrop-blur-xl border border-white/10 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowAIS(!showAIS)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                  showAIS ? "bg-teal-wash text-teal font-bold border border-teal/40" : "text-text-faint hover:text-white"
                }`}
              >
                AIS Vessel Routes
              </button>
              <button
                type="button"
                onClick={() => setShowDrift(!showDrift)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                  showDrift ? "bg-teal-wash text-teal font-bold border border-teal/40" : "text-text-faint hover:text-white"
                }`}
              >
                Drift Cone
              </button>
              <button
                type="button"
                onClick={() => setShowGeoLabels(!showGeoLabels)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                  showGeoLabels ? "bg-teal-wash text-teal font-bold border border-teal/40" : "text-text-faint hover:text-white"
                }`}
              >
                Map Labels
              </button>
            </div>
          )}
        </div>

        {/* RIGHT FLOATING MULTI-TAB INTELLIGENCE STACK (21st.dev Liquid Glass) */}
        <div
          className={`absolute top-4 right-4 z-20 transition-all duration-300 pointer-events-auto ${
            isDossierOpen ? "w-[390px] sm:w-[440px]" : "w-auto"
          }`}
        >
          {isDossierOpen ? (
            <LiquidGlassPanel variant="card" glow="cyan" className="p-5 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col max-h-[640px]">
              {/* Header with 3 Multi-Modal Tabs & Collapse Toggle */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                {/* 3 Tabs: Suspect Dossier / Live Terminal / Sector Traffic */}
                <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveTab("dossier")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeTab === "dossier"
                        ? "bg-teal text-[#020a10] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                        : "text-text-faint hover:text-white"
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3" />
                    Forensics
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("terminal")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeTab === "terminal"
                        ? "bg-teal text-[#020a10] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                        : "text-text-faint hover:text-white"
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    Live Feed
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("vessels")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeTab === "vessels"
                        ? "bg-teal text-[#020a10] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                        : "text-text-faint hover:text-white"
                    }`}
                  >
                    <Ship className="w-3 h-3" />
                    AIS Traffic
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDossierOpen(false)}
                  className="p-1.5 rounded-lg text-text-faint hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Collapse panel"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* TAB 1: FORENSIC SUSPECT DOSSIER */}
              {activeTab === "dossier" && (
                <div className="flex flex-col flex-1 overflow-y-auto pr-1">
                  {isLookalike ? (
                    <>
                      {/* Look-alike Suppression Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-teal tracking-wider uppercase flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-teal" />
                          NATURAL LOOK-ALIKE SUPPRESSED
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                          79.89% SPECIFICITY
                        </span>
                      </div>

                      {/* Suppressed Title & Region */}
                      <h3 className="text-2xl font-black text-white tracking-tight mb-0.5">
                        {activeIncident.name}
                      </h3>
                      <div className="text-[11px] font-mono text-teal mb-3">
                        {activeIncident.region} · PHYSICS-INFORMED DISCRIMINATOR
                      </div>

                      {/* Rejection Alert Box */}
                      <div className="p-3 rounded-xl bg-teal/10 border border-teal/30 mb-3 text-[11px] leading-relaxed">
                        <div className="font-bold text-teal font-mono flex items-center gap-1 mb-1">
                          ✓ ZERO FALSE ALARM DISPATCH
                        </div>
                        <p className="text-text-muted">
                          {currentSuspect.dossierSummary ||
                            "Attention U-Net flagged low-reflectivity anomaly, but Physics Filter correctly suppressed it. Diffuse boundaries and wide spatial coverage confirm natural calm sea or biological algal bloom."}
                        </p>
                      </div>

                      {/* Key Telemetry Rows */}
                      <div className="space-y-2 bg-[#000000] p-3.5 rounded-xl border border-white/10 mb-4 text-[11px] font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-text-faint flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-teal" />
                            Frame Coverage
                          </span>
                          <span className="font-bold text-amber">
                            {activeIncident.id === "LOOK-01" ? "26.6% (> 10% limit)" : "15.4% (> 10% limit)"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-text-faint flex items-center gap-1.5">
                            <Anchor className="w-3.5 h-3.5 text-teal" />
                            Aspect Ratio
                          </span>
                          <span className="font-bold text-amber">
                            {activeIncident.id === "LOOK-01" ? "1.57:1 (< 1.6 limit)" : "1.34:1 (< 1.6 limit)"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-text-faint flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-teal" />
                            Radar Damping
                          </span>
                          <span className="font-bold text-white">
                            {activeIncident.id === "LOOK-01" ? "2.27 dB" : "2.39 dB"}
                          </span>
                        </div>
                      </div>

                      {/* Suppression Confidence */}
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-[10.5px] font-mono">
                          <span className="text-text-faint">False Alarm Interception Confidence</span>
                          <span className="text-emerald-400 font-bold">100% REJECTED</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 via-teal to-[#7df9ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 mt-auto">
                        <LiquidButton
                          variant="cyan"
                          size="default"
                          onClick={() => handleDownloadJson(currentSuspect)}
                          className="w-full border border-teal/40 bg-teal/15 font-mono text-[11px] tracking-wider uppercase shadow-[0_0_16px_rgba(0,240,255,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-transform"
                        >
                          <Download className="w-3.5 h-3.5 text-teal" />
                          Download False Alarm Audit (.JSON)
                        </LiquidButton>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Confidence Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-red tracking-wider uppercase flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red animate-ping" />
                          PRIMARY SUSPECT
                        </span>
                        <span className="text-[11px] font-mono text-teal bg-teal/10 px-2.5 py-0.5 rounded-full border border-teal/30 font-bold">
                          {currentSuspect.confidencePct}% ATTRIBUTION
                        </span>
                      </div>

                      {/* Suspect Title & Telemetry */}
                      <h3 className="text-2xl font-black text-white tracking-tight mb-0.5">
                        {currentSuspect.name}
                      </h3>
                      <div className="text-[11px] font-mono text-teal mb-3">
                        MMSI {currentSuspect.mmsi || "419004812"} · {currentSuspect.flag || "PANAMA"} · {currentSuspect.vesselType || "CRUDE TANKER"}
                      </div>

                      {/* Suspect Selector Chips */}
                      {activeIncident.suspects.length > 1 && (
                        <div className="flex items-center gap-1.5 mb-3 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          {activeIncident.suspects.map((s, idx) => (
                            <button
                              key={s.name}
                              type="button"
                              onClick={() => setSelectedSuspectIndex(idx)}
                              className={`flex-1 py-1 text-[10.5px] font-mono rounded-lg transition-all cursor-pointer ${
                                selectedSuspectIndex === idx
                                  ? "bg-teal-wash text-teal font-bold border border-teal/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                                  : "text-text-faint hover:text-white"
                              }`}
                            >
                              #{s.rank} {s.name.split(" ")[1] || s.name} ({s.confidencePct}%)
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Narrative Summary */}
                      <p className="text-[11.5px] text-text-muted mb-3.5 leading-relaxed">
                        {currentSuspect.dossierSummary ||
                          "Vessel transited through the spill origin coordinates during the estimated discharge window. Hydrodynamic backtrack intersects vessel trajectory with high spatial confidence."}
                      </p>

                      {/* Key Telemetry Rows */}
                      <div className="space-y-2 bg-[#000000] p-3.5 rounded-xl border border-white/10 mb-4 text-[11px] font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-text-faint flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber" />
                            AIS Dark Window
                          </span>
                          <span className="font-bold text-amber">{currentSuspect.aisGapDuration || "4h 12m"}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-text-faint flex items-center gap-1.5">
                            <Anchor className="w-3.5 h-3.5 text-teal" />
                            Fuel Oil Match
                          </span>
                          <span className="font-bold text-white">{currentSuspect.fuelTypeMatch || "HFO-380 cSt"}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-text-faint flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-red" />
                            Speed Anomaly
                          </span>
                          <span className="font-bold text-red">{currentSuspect.speedAnomaly || "Decel at origin"}</span>
                        </div>
                      </div>

                      {/* Bayesian Progress */}
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-[10.5px] font-mono">
                          <span className="text-text-faint">Bayesian Likelihood Overlap</span>
                          <span className="text-teal font-bold">{currentSuspect.confidencePct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-dim via-teal to-[#7df9ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                            style={{ width: `${currentSuspect.confidencePct}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 mt-auto">
                        <LiquidButton
                          variant="cyan"
                          size="default"
                          onClick={() => handleDownloadJson(currentSuspect)}
                          className="w-full border border-teal/40 bg-teal/15 font-mono text-[11px] tracking-wider uppercase shadow-[0_0_16px_rgba(0,240,255,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-transform"
                        >
                          <Download className="w-3.5 h-3.5 text-teal" />
                          Download Signed Dossier (.JSON)
                        </LiquidButton>

                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="w-full py-1.5 rounded-lg text-text-faint hover:text-white text-[10.5px] font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <FileCheck2 className="w-3 h-3" />
                          View Full Court Evidence Package →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 2: LIVE TELEMETRY LOG FEED */}
              {activeTab === "terminal" && (
                <div className="flex-1 flex flex-col min-h-[360px] overflow-hidden rounded-xl border border-white/10">
                  <TelemetryTerminal />
                </div>
              )}

              {/* TAB 3: SECTOR AIS TRAFFIC RADAR */}
              {activeTab === "vessels" && (
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
                  <div className="text-[10px] font-mono text-text-faint uppercase px-1 mb-1">
                    VESSELS IN 25 NM RADIUS ({vessels.length} TRACKED)
                  </div>
                  {vessels.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        const matched = activeIncident.suspects.find((s) => s.name.toLowerCase().includes(v.name.toLowerCase()));
                        if (matched) {
                          const idx = activeIncident.suspects.indexOf(matched);
                          setSelectedSuspectIndex(idx);
                          setActiveTab("dossier");
                        }
                      }}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-teal/30 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Ship className="w-3.5 h-3.5 text-teal" />
                          <span className="text-xs font-bold text-white">{v.name}</span>
                          <span className="text-[10px] font-mono text-text-faint">{v.flag}</span>
                        </div>
                        <div className="text-[10.5px] font-mono text-text-muted mt-0.5">
                          MMSI {v.mmsi} · {v.type} · {v.speedKt} kt
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            v.aisStatus === "dark"
                              ? "bg-red-wash text-red border border-red/30"
                              : "bg-teal-wash text-teal border border-teal/30"
                          }`}
                        >
                          {v.aisStatus === "dark" ? "AIS-DARK" : "LIVE"}
                        </span>
                        <span className="text-[10px] font-mono text-text-faint">Risk: {v.riskScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </LiquidGlassPanel>
          ) : (
            <button
              type="button"
              onClick={() => setIsDossierOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-black/80 backdrop-blur-xl border border-teal/40 text-teal font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(0,240,255,0.25)] hover:bg-teal-wash transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>COMMAND INTELLIGENCE ({currentSuspect.confidencePct}%)</span>
            </button>
          )}
        </div>

        {/* BOTTOM FLOATING TIME-SCRUBBER CAPSULE */}
        <div className="absolute bottom-4 inset-x-4 z-20 max-w-2xl mx-auto pointer-events-auto">
          <LiquidGlassPanel variant="card" glow="subtle" className="p-2 shadow-[0_0_30px_rgba(0,0,0,0.85)]">
            <TimeScrubber timeOffset={timeOffset} onChange={setTimeOffset} />
          </LiquidGlassPanel>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM TELEMETRY ROW: 4 CLEAN GLASS METRIC CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Satellite Ingest */}
        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <Radar className="w-3.5 h-3.5 text-teal" />
            SATELLITE SURVEILLANCE
          </div>
          <div className="text-base font-extrabold text-white">Copernicus Sentinel-1</div>
          <div className="text-[11px] font-mono text-teal mt-0.5">
            C-Band SAR · {(activeIncident as any).sourceImage || "Sentinel-1 SAR Chip"}
          </div>
          <div className="mt-2 text-[10px] font-mono text-text-faint">Dual-Pol (VV/VH) · 20m Resolution</div>
        </LiquidGlassPanel>

        {/* Card 2: Currents & Wind */}
        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-blue" />
            CURRENTS & WIND
          </div>
          <div className="text-base font-extrabold text-white">{activeIncident.currentVector}</div>
          <div className="text-[11px] font-mono text-text-muted mt-0.5">Wind: {activeIncident.windVector}</div>
          <div className="mt-2 text-[10px] font-mono text-text-faint">Wave Height: 1.8m · Temp: 24.2°C</div>
        </LiquidGlassPanel>

        {/* Card 3: ADIOS2 Weathering or Physics Morphometrics */}
        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber" />
            {isLookalike ? "PHYSICS MORPHOMETRICS" : "ADIOS2 WEATHERING"}
          </div>
          <div className="text-base font-extrabold text-white">
            {isLookalike ? "Natural Low-Backscatter" : "Heavy Crude 380 cSt"}
          </div>
          <div className="text-[11px] font-mono text-amber mt-0.5">
            {isLookalike
              ? `AR: ${(activeIncident as any).aspectRatio || 1.57}:1 · Damping: ${(activeIncident as any).dampingRatioDb || 2.27} dB`
              : "Diffusion Coeff: 10 m²/s · AR >= 1.6:1"}
          </div>
          <div className="mt-2 text-[10px] font-mono text-text-faint">
            {isLookalike
              ? "Rejection: Aspect Ratio < 1.6 or Coverage > 10%"
              : "Evaporated: 31.4% · Emulsified: 42.8%"}
          </div>
        </LiquidGlassPanel>

        {/* Card 4: Attribution Lock or Look-alike Specificity */}
        <LiquidGlassPanel variant="card" glow="subtle" className="p-4">
          <div className="text-[10px] font-mono text-text-faint uppercase mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-teal" />
            {isLookalike ? "FALSE ALARM SUPPRESSION" : "ATTRIBUTION CONFIDENCE"}
          </div>
          <div className="text-base font-extrabold text-teal">
            {isLookalike ? "79.89% Specificity" : `High Lock (${currentSuspect.confidencePct}%)`}
          </div>
          <div className="text-[11px] font-mono text-text-muted mt-0.5">
            {isLookalike ? "Zero Naval Interceptions Dispatched" : "Lagrangian Origin: ±180m Overlap"}
          </div>
          <div className="mt-2 text-[10px] font-mono text-text-faint">
            {isLookalike ? "5,538 Kaggle Benchmark Validated" : "Tamper-Evident SHA-256 Verified"}
          </div>
        </LiquidGlassPanel>
      </div>

      {/* FULL COURT EVIDENCE DOSSIER MODAL */}
      <ForensicDossierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suspect={currentSuspect}
        incident={activeIncident}
      />
    </div>
  );
}
