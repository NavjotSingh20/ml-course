import { useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  Check,
  Loader2,
  Eye,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Crosshair,
} from "lucide-react";
import { PIPELINE_SAMPLE_POOL, type PipelineSampleResult } from "../../data/pipelinePool";

/** Interactive 6h OpenDrift Hindcast chart with hoverable time-steps and directional drift vector */
function HindcastMiniChart({ sample }: { sample: PipelineSampleResult }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!sample.isSpill || sample.hindcastTrail.length < 2) {
    return (
      <div className="w-full h-full rounded-lg bg-[#05080f] border border-emerald-500/25 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(circle at center, rgba(16,185,129,0.22), transparent 68%)",
          }}
        />
        <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1.5 relative" />
        <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider relative">
          Hindcast Bypassed
        </span>
        <span className="text-[9px] font-mono text-slate-500 mt-0.5 relative">
          Alert suppressed cleanly
        </span>
      </div>
    );
  }

  const pts = sample.hindcastTrail;
  const lons = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const spanLon = Math.max(maxLon - minLon, 0.005);
  const spanLat = Math.max(maxLat - minLat, 0.005);

  const toX = (lon: number) => 18 + ((lon - minLon) / spanLon) * 84;
  const toY = (lat: number) => 80 - ((lat - minLat) / spanLat) * 60;

  const polylinePoints = pts.map(([lon, lat]) => `${toX(lon).toFixed(1)},${toY(lat).toFixed(1)}`).join(" ");
  const startPt = pts[0];
  const endPt = pts[pts.length - 1];
  const activePtIdx = hoverIdx !== null ? hoverIdx : pts.length - 1;
  const activePt = pts[activePtIdx];
  const hoursAgo = (activePtIdx * 0.5).toFixed(1);

  return (
    <div
      className="relative w-full h-full rounded-lg bg-[#05080f] border border-blue-500/30 hover:border-teal/50 transition-colors overflow-hidden group"
      onMouseLeave={() => setHoverIdx(null)}
    >
      <svg viewBox="0 0 120 100" className="w-full h-full">
        {/* Coordinate grid */}
        <line x1="0" y1="33" x2="120" y2="33" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
        <line x1="0" y1="66" x2="120" y2="66" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
        <line x1="40" y1="0" x2="40" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
        <line x1="80" y1="0" x2="80" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />

        {/* Origin dispersion uncertainty ellipse (T-6h) */}
        <circle
          cx={toX(endPt[0])}
          cy={toY(endPt[1])}
          r="11"
          fill="rgba(245,158,11,0.12)"
          stroke="rgba(245,158,11,0.55)"
          strokeDasharray="2 2"
          strokeWidth="0.9"
        />

        {/* Glow path under trajectory */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="rgba(0,240,255,0.22)"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Crisp 6h Backward Drift Path */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive hover waypoints every 30 min */}
        {pts.map(([lon, lat], i) => {
          const cx = toX(lon);
          const cy = toY(lat);
          const isHovered = hoverIdx === i;
          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIdx(i)}>
              <circle cx={cx} cy={cy} r="5.5" fill="transparent" />
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? "2.6" : "1.1"}
                fill={isHovered ? "#00f0ff" : "rgba(148,163,184,0.45)"}
              />
            </g>
          );
        })}

        {/* T-6h Origin Dot */}
        <circle cx={toX(endPt[0])} cy={toY(endPt[1])} r="3" fill="#f59e0b" className="pointer-events-none" />
        {/* T-0 Observed Slick Dot */}
        <circle
          cx={toX(startPt[0])}
          cy={toY(startPt[1])}
          r="3.2"
          fill="#ef4444"
          stroke="#fff"
          strokeWidth="0.8"
          className="pointer-events-none"
        />
      </svg>

      {/* Top HUD Tag + Live Hover Waypoint Readout */}
      <div className="absolute top-1.5 left-2 right-2 flex items-center justify-between pointer-events-none">
        <span className="text-[8px] font-mono text-sky-400 font-bold tracking-wider uppercase">
          6H HINDCAST
        </span>
        <span className="text-[8px] font-mono text-slate-300 bg-black/70 px-1.5 py-0.5 rounded border border-white/10">
          {hoverIdx !== null ? `T-${hoursAgo}h` : "HOVER TRACE"}
        </span>
      </div>

      {/* Bottom Readout */}
      <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between pointer-events-none text-[8px] font-mono">
        <span className="text-slate-400 truncate">
          {activePt[1].toFixed(3)}°, {activePt[0].toFixed(3)}°
        </span>
        <span className="text-amber-300 shrink-0">±{sample.dispersionRadiusM}m</span>
      </div>
    </div>
  );
}

/** Pending / Processing overlay shown in the Output Panel while signal travels through stages 0 -> 1 -> 2 */
function PipelineProcessingCard({ stage, filename }: { stage: number; filename: string }) {
  const steps = [
    { idx: 0, label: "SAR Tile Ingestion & Normalization (256×256)" },
    { idx: 1, label: "ResNet50V2 Attention U-Net Segmentation" },
    { idx: 2, label: "Stage 2 Morphometrics & 6h OpenDrift Hindcast" },
  ];

  return (
    <div className="w-full h-full rounded-xl bg-[#090d16] border border-blue-500/35 p-4 flex flex-col justify-between shadow-[0_0_24px_rgba(59,130,246,0.14)]">
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-[11px] font-mono font-bold text-blue-300 tracking-wider uppercase">
            EXECUTING PIPELINE · {filename}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">STAGE {stage + 1} / 3</span>
      </div>

      <div className="flex flex-col gap-3 my-auto py-3">
        {steps.map((s) => {
          const isDone = stage > s.idx;
          const isCurrent = stage === s.idx;
          return (
            <div
              key={s.idx}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border font-mono text-[11px] transition-all duration-300 ${
                isDone
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : isCurrent
                  ? "bg-blue-500/15 border-blue-400/50 text-white shadow-[0_0_12px_rgba(59,130,246,0.18)]"
                  : "bg-black/40 border-white/[0.05] text-slate-600"
              }`}
            >
              <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                )}
              </span>
              <span className="truncate">{s.label}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Awaiting pipeline completion...</span>
        <span className="text-blue-400/80">14.6ms GPU target</span>
      </div>
    </div>
  );
}

/** Interactive Before/After Split-Compare Modal for detailed SAR mask inspection */
function SarSplitCompareModal({
  sample,
  onClose,
}: {
  sample: PipelineSampleResult;
  onClose: () => void;
}) {
  const [splitPct, setSplitPct] = useState(50);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[680px] rounded-xl bg-[#070a10] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#04060a]">
          <div className="flex items-center gap-2.5">
            <Crosshair className="w-4 h-4 text-teal" />
            <span className="font-mono text-[12px] font-bold text-white uppercase tracking-wider">
              SAR SPLIT-MASK INSPECTOR · {sample.filename}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close split inspector"
            className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="relative w-full aspect-square max-h-[420px] mx-auto rounded-xl overflow-hidden border border-white/15 bg-black select-none">
            {/* Base: Segmented Output Mask */}
            <img
              src={sample.outputImage}
              alt="Segmented output"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Clipped Layer: Raw Input SAR */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
            >
              <img
                src={sample.inputImage}
                alt="Raw SAR input"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Vertical Divider Handle */}
            <div
              className="absolute inset-y-0 w-0.5 bg-teal shadow-[0_0_12px_#00f0ff] pointer-events-none"
              style={{ left: `${splitPct}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#070a10] border-2 border-teal flex items-center justify-center text-teal text-[9px] font-mono font-bold">
                &harr;
              </div>
            </div>

            <span className="absolute top-2.5 left-3 px-2 py-0.5 rounded bg-black/80 border border-white/15 text-[10px] font-mono text-slate-200">
              RAW INPUT SAR
            </span>
            <span className="absolute top-2.5 right-3 px-2 py-0.5 rounded bg-black/80 border border-teal/40 text-[10px] font-mono text-teal">
              RESNET50V2 MASK
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span className="shrink-0">RAW SAR</span>
            <input
              type="range"
              min={0}
              max={100}
              value={splitPct}
              onChange={(e) => setSplitPct(Number(e.target.value))}
              aria-label="Compare raw SAR and segmented mask"
              className="w-full accent-[#00f0ff] cursor-pointer"
            />
            <span className="shrink-0 text-teal">MASK ({splitPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MlPipelineVisualizer() {
  const [sample, setSample] = useState<PipelineSampleResult>(PIPELINE_SAMPLE_POOL[0]);
  // stage: 0 = SAR Input, 1 = ResNet50V2 Segmentation, 2 = Physics + Hindcast, 3 = Output Revealed
  const [stage, setStage] = useState<number>(3);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [showRawOutput, setShowRawOutput] = useState<boolean>(false);
  const [compareOpen, setCompareOpen] = useState<boolean>(false);
  const [inspectedNode, setInspectedNode] = useState<number | null>(null);

  const runSampleSequence = useCallback((nextSample: PipelineSampleResult) => {
    setSample(nextSample);
    setStage(0);
    setIsRunning(true);
    setPaused(false);
    setShowRawOutput(false);
    setInspectedNode(null);
  }, []);

  const triggerRandomRun = useCallback(() => {
    const candidates = PIPELINE_SAMPLE_POOL.filter((item) => item.id !== sample.id);
    const pool = candidates.length > 0 ? candidates : PIPELINE_SAMPLE_POOL;
    const next = pool[Math.floor(Math.random() * pool.length)];
    runSampleSequence(next);
  }, [sample.id, runSampleSequence]);

  const stepSample = useCallback(
    (delta: number) => {
      const idx = PIPELINE_SAMPLE_POOL.findIndex((item) => item.id === sample.id);
      const baseIdx = idx === -1 ? 0 : idx;
      const nextIdx = (baseIdx + delta + PIPELINE_SAMPLE_POOL.length) % PIPELINE_SAMPLE_POOL.length;
      runSampleSequence(PIPELINE_SAMPLE_POOL[nextIdx]);
    },
    [sample.id, runSampleSequence]
  );

  // Sequential visual progression: Stage 0 -> Stage 1 -> Stage 2 -> Stage 3
  useEffect(() => {
    if (!isRunning || paused) return;
    if (stage < 3) {
      const durations = [800, 880, 920];
      const timer = setTimeout(() => setStage((s) => s + 1), durations[stage]);
      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
    }
  }, [isRunning, stage, paused]);

  const isOutputReady = stage >= 3;

  const statusText = (() => {
    if (inspectedNode === 0) {
      return `Node 1 Inspector: Sentinel-1 IW GRD chip (${sample.filename}) · Normalized μ=0.424, σ=0.214.`;
    }
    if (inspectedNode === 1) {
      return `Node 2 Inspector: ResNet50V2_Attention_UNet (45,841,669 params) · Balanced Focal Tversky (α=β=0.5).`;
    }
    if (inspectedNode === 2) {
      return `Node 3 Inspector: Stage 2 Morphometrics (AR≥1.60, ΔdB≥0.50) + OpenDrift 6h backward advection.`;
    }
    if (stage === 0) {
      return `Stage 1/3: Ingesting Sentinel-1 SAR tile "${sample.filename}" (${sample.region})...`;
    }
    if (stage === 1) {
      return `Stage 2/3: Running ResNet50V2_Attention_UNet v2 segmentation on "${sample.filename}"...`;
    }
    if (stage === 2) {
      return `Stage 3/3: Computing physics morphometrics & 6h OpenDrift hindcast trajectory...`;
    }
    return sample.isSpill
      ? `Complete: ${sample.prediction} (${sample.confidencePct}% conf · ${sample.modelAccuracyPct}% acc) · Origin ${sample.originLat}°, ${sample.originLon}°`
      : `Complete: ${sample.prediction} (${sample.confidencePct}% conf · ${sample.modelAccuracyPct}% acc) · Alert suppressed cleanly.`;
  })();

  return (
    <>
      <div className="relative w-full rounded-xl bg-[#07090e] border border-white/[0.1] shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden select-none isolate">
        {/* Specular Top Hairline Highlight */}
        <div className="pointer-events-none absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal/40 to-transparent z-20" />

        {/* Top Control Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/[0.07] bg-[#05070b]">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              {!paused && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isRunning ? "bg-blue-400" : "bg-emerald-400"
                  }`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isRunning
                    ? "bg-blue-400 shadow-[0_0_8px_#60a5fa]"
                    : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                }`}
              />
            </span>
            <span className="text-[11px] font-mono tracking-[0.14em] text-slate-300 uppercase font-semibold">
              MARIS ML PIPELINE · {isRunning ? "EXECUTING" : "LIVE"}
            </span>
            <span className="hidden md:inline-block text-[10.5px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-400">
              {sample.filename}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Prev / Next Stepper */}
            <div className="flex items-center bg-black/60 border border-white/[0.08] rounded-md p-0.5">
              <button
                type="button"
                disabled={isRunning}
                onClick={() => stepSample(-1)}
                title="Previous sample"
                aria-label="Previous sample"
                className="p-1 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={isRunning}
                onClick={() => stepSample(1)}
                title="Next sample"
                aria-label="Next sample"
                className="p-1 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary RUN RANDOM SAMPLE Action */}
            <button
              type="button"
              onClick={triggerRandomRun}
              disabled={isRunning}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-mono text-[11px] font-bold tracking-wide transition-all cursor-pointer active:scale-[0.985] ${
                isRunning
                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/40 cursor-wait"
                  : "bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 text-[#00f0ff] border border-[#00f0ff]/45 hover:-translate-y-[1px] shadow-[0_0_16px_rgba(0,240,255,0.18)]"
              }`}
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>RUNNING STAGE {stage + 1}/3</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>RUN RANDOM SAMPLE</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Resume pipeline pulse" : "Pause pipeline pulse"}
              title={paused ? "Resume pulse" : "Pause pulse"}
              className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.1] hover:border-blue-400/50 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              {paused ? <Play className="w-3 h-3 ml-0.5" /> : <Pause className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Main Dot-Grid Pipeline Canvas + Radial Ambient Spotlight */}
        <div
          className="relative w-full px-4 sm:px-6 py-7 md:py-9"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 48% 50%, rgba(0,240,255,0.045), transparent 65%), radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 20px 20px",
          }}
        >
          {/* ================= DESKTOP HORIZONTAL FLOW + OUTPUT INSPECTOR (>= 1024px) ================= */}
          <div className="hidden lg:block relative max-w-[1180px] mx-auto h-[300px]">
            {/* Phase-Locked Optical Telemetry Conduits */}
            {(
              [
                { index: 0 as const, left: "15%", width: "5.4%", color: "#60a5fa", isEnergized: stage >= 0 },
                { index: 1 as const, left: "34.9%", width: "5.4%", color: "#38bdf8", isEnergized: stage >= 1 },
                {
                  index: 2 as const,
                  left: "56%",
                  width: "5.4%",
                  color: stage >= 3 ? (sample.isSpill ? "#00f0ff" : "#34d399") : "#38bdf8",
                  isEnergized: stage >= 2,
                },
              ] as const
            ).map((wire) => {
              const isSyncedLoop = !isRunning && stage === 3 && !paused;
              const isSingleShot = isRunning && stage === wire.index && !paused;
              const startPortIdx = wire.index;
              const endPortIdx = wire.index + 1;

              return (
                <div
                  key={`${wire.index}-${isSyncedLoop ? "loop" : "run"}`}
                  style={{ left: wire.left, width: wire.width }}
                  className="pointer-events-none z-10 absolute top-1/2 -translate-y-1/2 h-8 flex items-center"
                >
                  {/* Precision Base Hairline */}
                  <div className="w-full h-px bg-white/[0.11]" />

                  {/* Energized Glowing Conduit Backbone */}
                  <div
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${wire.color}66, ${wire.color}, ${wire.color}66)`,
                      boxShadow: wire.isEnergized ? `0 0 8px ${wire.color}55` : "none",
                      opacity: isSyncedLoop ? undefined : wire.isEnergized ? 0.85 : 0.12,
                      animation: isSyncedLoop ? `maris-rail-${wire.index} 3.2s linear infinite` : undefined,
                    }}
                  />

                  {/* Subtle Directional Micro-Ticks Along Wire */}
                  <div className="absolute inset-x-2.5 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-35">
                    <span className="w-px h-1.5 bg-white/40" />
                    <span className="w-px h-2 bg-white/55" />
                    <span className="w-px h-1.5 bg-white/40" />
                  </div>

                  {/* Traveling Luminous Comet (GPU translateX only, clipped cleanly at port caps) */}
                  <div className="absolute inset-x-[2px] inset-y-0 overflow-hidden">
                    {(isSyncedLoop || isSingleShot) && (
                      <div
                        className="maris-comet w-full h-full relative"
                        style={{
                          animation: isSyncedLoop
                            ? `maris-relay-${wire.index} 3.2s linear infinite`
                            : `maris-shot 0.78s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                        }}
                      >
                        <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 flex items-center">
                          <span
                            className="block w-8 h-[2px] rounded-full"
                            style={{
                              background: `linear-gradient(90deg, transparent 0%, ${wire.color}66 45%, ${wire.color} 100%)`,
                            }}
                          />
                          <span
                            className="block w-1.5 h-1.5 -ml-1 rounded-full bg-white"
                            style={{
                              boxShadow: `0 0 8px 2px ${wire.color}, 0 0 14px ${wire.color}`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Left Terminal Port */}
                  <div className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 flex items-center justify-center">
                    {isSyncedLoop && wire.index === 0 && (
                      <span
                        className="maris-port-ring absolute inset-0 rounded-full border"
                        style={{
                          borderColor: wire.color,
                          animation: `maris-port-${startPortIdx} 3.2s linear infinite`,
                        }}
                      />
                    )}
                    <span
                      className="w-2 h-2 rounded-full bg-[#060911] border-[1.5px] flex items-center justify-center"
                      style={{ borderColor: wire.isEnergized ? wire.color : "rgba(255,255,255,0.22)" }}
                    >
                      <span
                        className="w-[3px] h-[3px] rounded-full"
                        style={{ backgroundColor: wire.isEnergized ? wire.color : "rgba(255,255,255,0.25)" }}
                      />
                    </span>
                  </div>

                  {/* Right Terminal Port + Arrival Pulse Ring */}
                  <div className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 flex items-center justify-center">
                    {isSyncedLoop && (
                      <span
                        className="maris-port-ring absolute inset-0 rounded-full border"
                        style={{
                          borderColor: wire.color,
                          animation: `maris-port-${endPortIdx} 3.2s linear infinite`,
                        }}
                      />
                    )}
                    <span
                      className="w-2 h-2 rounded-full bg-[#060911] border-[1.5px] flex items-center justify-center"
                      style={{
                        borderColor:
                          stage > wire.index || (wire.index === 2 && stage >= 3)
                            ? wire.color
                            : "rgba(255,255,255,0.22)",
                      }}
                    >
                      <span
                        className="w-[3px] h-[3px] rounded-full"
                        style={{
                          backgroundColor:
                            stage > wire.index || (wire.index === 2 && stage >= 3)
                              ? wire.color
                              : "rgba(255,255,255,0.25)",
                        }}
                      />
                    </span>
                  </div>
                </div>
              );
            })}

            {/* NODE 1: INPUT SAR VIEWPORT (Interactive Click to Inspect) */}
            <div className="absolute left-[0%] top-1/2 -translate-y-1/2 w-[15%] flex flex-col items-center">
              <div
                onClick={() => setInspectedNode((n) => (n === 0 ? null : 0))}
                className={`w-full p-2.5 rounded-xl bg-[#0b0f17] border transition-all duration-200 flex flex-col items-center cursor-pointer hover:-translate-y-0.5 ${
                  stage === 0 || inspectedNode === 0
                    ? "border-blue-400 shadow-[0_0_28px_rgba(59,130,246,0.38)]"
                    : stage > 0
                    ? "border-white/[0.14] hover:border-blue-400/50"
                    : "border-white/[0.1]"
                }`}
              >
                <span className="text-[9px] font-mono tracking-[0.14em] text-slate-400 uppercase mb-2">
                  1. INPUT SAR TILE
                </span>
                {/* Orbital Radar Reticle Viewport */}
                <div className="relative w-[108px] h-[108px] rounded-lg overflow-hidden border border-white/[0.14] bg-black group">
                  <img
                    src={sample.inputImage}
                    alt={`Input SAR ${sample.filename}`}
                    className="w-full h-full object-cover brightness-90 contrast-110 transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* Radar Corner Brackets */}
                  <span className="pointer-events-none absolute top-1 left-1 w-2 h-2 border-t border-l border-teal/70" />
                  <span className="pointer-events-none absolute top-1 right-1 w-2 h-2 border-t border-r border-teal/70" />
                  <span className="pointer-events-none absolute bottom-1 left-1 w-2 h-2 border-b border-l border-teal/70" />
                  <span className="pointer-events-none absolute bottom-1 right-1 w-2 h-2 border-b border-r border-teal/70" />
                </div>
                <span className="mt-2 text-[11px] font-mono font-semibold text-white truncate max-w-full">
                  {sample.filename}
                </span>
              </div>
              <span className="mt-1.5 text-[9.5px] font-mono text-slate-500">
                {isOutputReady ? `True: ${sample.trueClass}` : "256×256 SAR Tile"}
              </span>
            </div>

            {/* NODE 2: SEGMENTATION MODEL (Interactive Click to Inspect) */}
            <div className="absolute left-[20.4%] top-1/2 -translate-y-1/2 w-[14.5%] flex flex-col items-center">
              <div
                onClick={() => setInspectedNode((n) => (n === 1 ? null : 1))}
                className={`w-full py-5 px-3 rounded-xl bg-[#0b0f17] border transition-all duration-200 text-center cursor-pointer hover:-translate-y-0.5 ${
                  stage === 1 || inspectedNode === 1
                    ? "border-blue-400 shadow-[0_0_28px_rgba(59,130,246,0.38)]"
                    : stage > 1
                    ? "border-white/[0.14] hover:border-blue-400/50"
                    : "border-white/[0.1] opacity-60"
                }`}
              >
                <span className="block text-[9px] font-mono tracking-[0.14em] text-slate-500 uppercase">
                  2. ATTENTION U-NET
                </span>
                <span className="block text-[13.5px] font-semibold text-white mt-1.5">
                  ResNet50V2 v2
                </span>
                <span className="inline-block mt-2 text-[9.5px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-teal border border-teal/20">
                  {stage === 1 ? "Segmenting..." : "45.8M Params"}
                </span>
              </div>
              <span className="mt-1.5 text-[9.5px] font-mono text-slate-500">Dice 0.8808</span>
            </div>

            {/* NODE 3: CENTER ACTIVE PROCESSOR (Interactive Click to Inspect) */}
            <div className="absolute left-[40.3%] top-1/2 -translate-y-1/2 w-[15.7%] flex flex-col items-center">
              <div
                onClick={() => setInspectedNode((n) => (n === 2 ? null : 2))}
                className={`relative w-full p-1 rounded-xl border border-dashed transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                  stage === 2 || inspectedNode === 2
                    ? "border-blue-400/80"
                    : stage > 2
                    ? "border-blue-500/40 hover:border-blue-400/70"
                    : "border-white/10 opacity-60"
                }`}
              >
                <div
                  className={`w-full py-5 px-3 rounded-lg bg-[#0c1424] border transition-all duration-300 text-center ${
                    stage === 2 || inspectedNode === 2
                      ? "border-blue-400 shadow-[0_0_34px_rgba(59,130,246,0.42)]"
                      : stage > 2
                      ? "border-blue-500/60 shadow-[0_0_16px_rgba(59,130,246,0.14)]"
                      : "border-white/10"
                  }`}
                >
                  <span className="block text-[9px] font-mono tracking-[0.14em] text-blue-400 uppercase font-semibold">
                    3. PHYSICS + HINDCAST
                  </span>
                  <span className="block text-[14px] font-bold text-white mt-1.5">
                    {stage === 2 ? "Processing..." : "Morpho & Drift"}
                  </span>

                  <div className="mt-2.5 flex items-center justify-center gap-1.5">
                    {[0, 1, 2].map((pip) => (
                      <span
                        key={pip}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          stage === 2
                            ? "bg-blue-400 animate-pulse"
                            : stage > 2
                            ? "bg-teal/80"
                            : "bg-blue-400/35"
                        }`}
                        style={stage === 2 ? { animationDelay: `${pip * 180}ms` } : undefined}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="mt-1.5 text-[9.5px] font-mono text-blue-400/80">
                AR &ge; 1.60 · OpenDrift
              </span>
            </div>

            {/* RIGHT OUTPUT INSPECTION CONSOLE */}
            <div className="absolute left-[61.4%] top-1/2 -translate-y-1/2 w-[38.6%] h-[284px]">
              {!isOutputReady ? (
                <PipelineProcessingCard stage={stage} filename={sample.filename} />
              ) : (
                <div
                  className={`w-full h-full rounded-xl bg-[#0b0f17] border p-3.5 flex flex-col justify-between transition-all duration-500 ${
                    sample.isSpill
                      ? "border-teal/40 shadow-[0_0_28px_rgba(0,240,255,0.12)]"
                      : "border-emerald-400/40 shadow-[0_0_28px_rgba(52,211,153,0.12)]"
                  }`}
                >
                  {/* Output Header: Prediction + Accuracy/Confidence Badges */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.07]">
                    <div className="flex items-center gap-2 min-w-0">
                      {sample.isSpill ? (
                        <ShieldAlert className="w-4 h-4 text-red shrink-0" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span
                        className={`text-[11px] font-mono font-bold truncate ${
                          sample.isSpill ? "text-red" : "text-emerald-400"
                        }`}
                      >
                        {sample.prediction}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                        ACC {sample.modelAccuracyPct}%
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-wash text-teal border border-teal/30 font-bold">
                        CONF {sample.confidencePct}%
                      </span>
                    </div>
                  </div>

                  {/* Output Visuals Grid: Interactive Output Mask + Interactive 6h Hindcast */}
                  <div className="grid grid-cols-2 gap-2.5 my-2 flex-1 min-h-0">
                    <div className="relative rounded-lg overflow-hidden border border-white/[0.14] bg-black group">
                      <img
                        src={showRawOutput ? sample.inputImage : sample.outputImage}
                        alt={`Segmented output ${sample.filename}`}
                        className="w-full h-full object-cover brightness-90 contrast-110 transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {/* Radar Corner Reticles */}
                      <span className="pointer-events-none absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-teal/70" />
                      <span className="pointer-events-none absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-teal/70" />

                      <span className="absolute top-1.5 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-white border border-white/10">
                        {showRawOutput ? "RAW SAR" : "OUTPUT MASK"}
                      </span>

                      {/* Interactive Mask Toggle & Split Compare Controls */}
                      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowRawOutput((r) => !r)}
                          title={showRawOutput ? "Show Segmented Mask" : "Peek Raw SAR"}
                          aria-label="Toggle raw SAR and mask"
                          className="px-1.5 py-0.5 rounded bg-black/80 hover:bg-black text-[8px] font-mono text-slate-300 hover:text-teal border border-white/15 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-2.5 h-2.5" />
                          <span>{showRawOutput ? "MASK" : "RAW"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCompareOpen(true)}
                          title="Open Split-Mask Inspector"
                          aria-label="Open Split-Mask Inspector"
                          className="p-1 rounded bg-black/80 hover:bg-black text-slate-300 hover:text-teal border border-white/15 cursor-pointer transition-colors"
                        >
                          <Maximize2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>

                    <HindcastMiniChart sample={sample} />
                  </div>

                  {/* Output Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.07] font-mono">
                    <div className="bg-black/40 rounded px-2.5 py-1.5 border border-white/[0.05]">
                      <span className="block text-[8px] text-slate-500 uppercase">DETECTED AREA</span>
                      <span className="block text-[11px] font-bold text-white truncate">
                        {sample.areaKm2} km²
                      </span>
                    </div>
                    <div className="bg-black/40 rounded px-2.5 py-1.5 border border-white/[0.05]">
                      <span className="block text-[8px] text-slate-500 uppercase">ASPECT / DAMPING</span>
                      <span className="block text-[11px] font-bold text-teal truncate">
                        {sample.aspectRatio} · {sample.dampingDb} dB
                      </span>
                    </div>
                    <div className="bg-black/40 rounded px-2.5 py-1.5 border border-white/[0.05]">
                      <span className="block text-[8px] text-slate-500 uppercase">BONN VOLUME</span>
                      <span className="block text-[11px] font-bold text-amber-300 truncate">
                        {sample.bonnVolumeMt}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= RESPONSIVE TABLET & MOBILE FLOW (< 1024px) ================= */}
          <div className="flex flex-col items-center gap-2.5 lg:hidden">
            <div className={`w-full p-3 rounded-xl bg-[#0b0f17] border flex items-center gap-3.5 transition-all ${stage === 0 ? "border-blue-400" : "border-white/[0.1]"}`}>
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/[0.1] shrink-0 bg-black">
                <img src={sample.inputImage} alt={sample.filename} className="w-full h-full object-cover brightness-90 contrast-110" />
              </div>
              <div className="min-w-0">
                <span className="block text-[9px] font-mono tracking-wider text-slate-500 uppercase">
                  1. INPUT SAR TILE
                </span>
                <span className="block text-[13px] font-bold text-white truncate">{sample.filename}</span>
                <span className="block text-[10.5px] font-mono text-teal">
                  {isOutputReady ? `True Class: ${sample.trueClass}` : "256×256 SAR Tile"}
                </span>
              </div>
            </div>

            <div className="relative h-6 w-3 flex flex-col items-center justify-between">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
              <span className="flex-1 w-[1.5px] bg-gradient-to-b from-blue-400/80 to-sky-400/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className={`p-3 rounded-xl bg-[#0b0f17] border text-center transition-all ${stage === 1 ? "border-blue-400" : "border-white/[0.1]"}`}>
                <span className="block text-[9px] font-mono tracking-wider text-slate-500 uppercase">
                  2. SEGMENTATION MODEL
                </span>
                <span className="block text-[13px] font-semibold text-white mt-0.5">
                  {stage === 1 ? "Segmenting..." : "ResNet50V2 v2 · Dice 0.88"}
                </span>
              </div>
              <div className={`p-3 rounded-xl bg-[#0c1424] border text-center transition-all ${stage === 2 ? "border-blue-400" : "border-blue-500/60"}`}>
                <span className="block text-[9px] font-mono tracking-wider text-blue-400 uppercase font-semibold">
                  3. PHYSICS + HINDCAST
                </span>
                <span className="block text-[13px] font-bold text-white mt-0.5">
                  {stage === 2 ? "Processing..." : "Morpho & 6h OpenDrift"}
                </span>
              </div>
            </div>

            <div className="relative h-6 w-3 flex flex-col items-center justify-between">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              <span className="flex-1 w-[1.5px] bg-gradient-to-b from-sky-400/75 to-teal/85" />
              <span className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_6px_rgba(0,240,255,0.85)]" />
            </div>

            {!isOutputReady ? (
              <div className="w-full h-[220px]">
                <PipelineProcessingCard stage={stage} filename={sample.filename} />
              </div>
            ) : (
              <div className="w-full rounded-xl bg-[#0b0f17] border border-teal/35 p-3.5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/[0.07]">
                  <span className={`text-[11px] font-mono font-bold ${sample.isSpill ? "text-red" : "text-emerald-400"}`}>
                    {sample.prediction}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      ACC {sample.modelAccuracyPct}%
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-wash text-teal border border-teal/30 font-bold">
                      CONF {sample.confidencePct}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setCompareOpen(true)}
                    className="relative h-36 rounded-lg overflow-hidden border border-white/[0.1] bg-black cursor-pointer"
                  >
                    <img src={sample.outputImage} alt={`Output ${sample.filename}`} className="w-full h-full object-cover brightness-90 contrast-110" />
                    <span className="absolute top-1.5 left-2 px-1.5 py-0.5 rounded bg-black/75 text-[8.5px] font-mono text-white">
                      OUTPUT MASK
                    </span>
                  </div>
                  <div className="h-36">
                    <HindcastMiniChart sample={sample} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[10.5px]">
                  <div className="bg-black/40 rounded p-2 border border-white/[0.06]">
                    <span className="block text-[8px] text-slate-500">AREA</span>
                    <span className="text-white font-bold">{sample.areaKm2} km²</span>
                  </div>
                  <div className="bg-black/40 rounded p-2 border border-white/[0.06]">
                    <span className="block text-[8px] text-slate-500">AR / DAMPING</span>
                    <span className="text-teal font-bold">{sample.aspectRatio} · {sample.dampingDb}dB</span>
                  </div>
                  <div className="bg-black/40 rounded p-2 border border-white/[0.06]">
                    <span className="block text-[8px] text-slate-500">BONN VOL</span>
                    <span className="text-amber-300 font-bold">{sample.bonnVolumeMt}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Execution Console Strip */}
        <div className="px-4 sm:px-5 py-3 border-t border-white/[0.07] bg-[#04060a] font-mono text-[11.5px] sm:text-[12px] text-slate-400 flex items-center justify-between gap-4">
          <span className="text-slate-300 break-words sm:truncate">{statusText}</span>
          <span className="shrink-0 text-[10px] text-slate-500 uppercase tracking-wider hidden sm:inline">
            SHA256: {isOutputReady ? sample.sha256 : "COMPUTING..."}
          </span>
        </div>

        {/* Bottom 4-Column Telemetry Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/[0.07] bg-[#06080d] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
          <div className="px-4 sm:px-5 py-3.5">
            <span className="block text-[10px] font-mono tracking-[0.12em] text-slate-500 uppercase">
              MODEL ACCURACY
            </span>
            <b className="block text-[18px] font-bold text-emerald-400 mt-0.5 font-mono">
              {isOutputReady ? `${sample.modelAccuracyPct}%` : "Computing..."}
            </b>
          </div>
          <div className="px-4 sm:px-5 py-3.5">
            <span className="block text-[10px] font-mono tracking-[0.12em] text-slate-500 uppercase">
              OBSERVED SLICK (T-0)
            </span>
            <b className="block text-[14px] font-bold text-white mt-1 font-mono truncate">
              {isOutputReady ? `${sample.slickLat}°, ${sample.slickLon}°` : "Tracing..."}
            </b>
          </div>
          <div className="px-4 sm:px-5 py-3.5">
            <span className="block text-[10px] font-mono tracking-[0.12em] text-slate-500 uppercase">
              HINDCASTED ORIGIN (T-6H)
            </span>
            <b className="block text-[14px] font-bold text-teal mt-1 font-mono truncate">
              {!isOutputReady
                ? "Simulating drift..."
                : sample.originLat !== null
                ? `${sample.originLat}°, ${sample.originLon}°`
                : "Bypassed (Clean)"}
            </b>
          </div>
          <div className="px-4 sm:px-5 py-3.5">
            <span className="block text-[10px] font-mono tracking-[0.12em] text-slate-500 uppercase">
              DRIFT DISTANCE (6H)
            </span>
            <b className="block text-[15px] font-bold text-blue-400 mt-1 font-mono truncate">
              {!isOutputReady
                ? "Calculating..."
                : sample.originLat !== null && sample.originLon !== null
                ? (() => {
                    const dLat = (sample.originLat - sample.slickLat) * 111.32;
                    const dLon =
                      (sample.originLon - sample.slickLon) *
                      111.32 *
                      Math.cos(((sample.slickLat + sample.originLat) / 2) * (Math.PI / 180));
                    const km = Math.sqrt(dLat * dLat + dLon * dLon);
                    const nm = km / 1.852;
                    return `${km.toFixed(2)} km (${nm.toFixed(1)} nmi)`;
                  })()
                : "0.00 km (Bypassed)"}
            </b>
          </div>
        </div>
      </div>

      {/* Split-Compare Modal */}
      {compareOpen && <SarSplitCompareModal sample={sample} onClose={() => setCompareOpen(false)} />}
    </>
  );
}
