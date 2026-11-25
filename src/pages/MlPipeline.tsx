import { useState } from "react";
import { Panel } from "../components/ui/Panel";
import { KeyValueRow } from "../components/ui/KeyValueRow";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { MlPipelineVisualizer } from "../components/ml/MlPipelineVisualizer";

type MetricKey = "dice" | "iou" | "precision" | "recall";

interface ModelRow {
  name: string;
  dice: number;
  iou: number;
  precision: number;
  recall: number;
  tag: string;
  tone: "teal" | "amber";
  note: string;
}

const modelBenchmarks: ModelRow[] = [
  {
    name: "ResNet50V2 Attention U-Net (v2)",
    dice: 88.08,
    iou: 78.71,
    precision: 87.86,
    recall: 88.31,
    tag: "Production",
    tone: "teal",
    note: "Balanced Focal Tversky (α=0.5, β=0.5) · Peak precision & boundary clarity",
  },
  {
    name: "ResNet50V2 Attention U-Net (v1)",
    dice: 87.40,
    iou: 77.62,
    precision: 82.12,
    recall: 93.41,
    tag: "Recall-Heavy",
    tone: "teal",
    note: "Asymmetric Focal Tversky (β=0.7) · Ultra-high sensitivity, lower precision",
  },
  {
    name: "SegNet (Pooling Indices)",
    dice: 84.62,
    iou: 73.34,
    precision: 83.50,
    recall: 85.77,
    tag: "Encoder-Decoder",
    tone: "teal",
    note: "Max-pooling index upsampling · Clean edge preservation without skip noise",
  },
  {
    name: "Standard U-Net",
    dice: 82.38,
    iou: 70.05,
    precision: 78.37,
    recall: 86.83,
    tag: "Baseline",
    tone: "teal",
    note: "Classic encoder-decoder with direct skip concatenations",
  },
  {
    name: "Attention U-Net (503K)",
    dice: 81.81,
    iou: 69.22,
    precision: 73.54,
    recall: 92.18,
    tag: "Lightweight",
    tone: "amber",
    note: "Fast 503K parameter baseline · High recall, prone to calm-sea false positives",
  },
  {
    name: "CNN Patch Classifier",
    dice: 71.56,
    iou: 55.72,
    precision: 74.10,
    recall: 69.20,
    tag: "Early DL",
    tone: "amber",
    note: "No skip connections · Coarse patch detection, misses thin trailing tails",
  },
];

const METRIC_LABELS: Record<MetricKey, string> = {
  dice: "Dice",
  iou: "IoU",
  precision: "Precision",
  recall: "Recall",
};

export default function MlPipeline() {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("dice");
  const [selectedModel, setSelectedModel] = useState<string>(modelBenchmarks[0].name);

  const selectedObj = modelBenchmarks.find((m) => m.name === selectedModel) ?? modelBenchmarks[0];

  return (
    <>
      {/* Centerpiece Interactive Animated ML & Pipeline Architecture Visualizer */}
      <MlPipelineVisualizer />

      {/* Detailed Model Progression & Stage 2/3 Physics Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel
          title="Model Progression Matrix"
          meta={
            <div className="flex items-center gap-1 bg-black/60 border border-white/[0.08] rounded-md p-0.5 font-mono text-[10px]">
              {(["dice", "iou", "precision", "recall"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setActiveMetric(k)}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    activeMetric === k
                      ? "bg-[#00f0ff]/15 text-teal border border-teal/35 font-bold"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  {METRIC_LABELS[k]}
                </button>
              ))}
            </div>
          }
        >
          <div className="p-4 flex flex-col gap-2.5">
            {modelBenchmarks.map((m) => {
              const val = m[activeMetric];
              const isSelected = m.name === selectedModel;
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setSelectedModel(m.name)}
                  className={`w-full text-left flex flex-col gap-1.5 p-2 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/[0.03] border-teal/35 shadow-[0_0_16px_rgba(0,240,255,0.06)]"
                      : "bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-semibold truncate ${isSelected ? "text-teal" : "text-white"}`}>
                        {m.name}
                      </span>
                      <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-text-muted">
                        {m.tag}
                      </span>
                    </div>
                    <div className="shrink-0 font-mono text-[11.5px] flex items-center gap-3">
                      <span className="text-teal font-bold">
                        {val.toFixed(2)}% {METRIC_LABELS[activeMetric]}
                      </span>
                    </div>
                  </div>
                  <ProgressBar percent={val} color={m.tone} />
                </button>
              );
            })}

            <div className="mt-1 px-3 py-2 rounded-lg bg-[#05080f] border border-white/[0.06] font-mono text-[10.5px] text-slate-400 flex items-center justify-between gap-2">
              <span className="truncate text-slate-300">{selectedObj.note}</span>
              <span className="shrink-0 text-teal">808 Test Images</span>
            </div>
          </div>
        </Panel>

        <Panel title="Stage 2 Physics & Stage 3 Hindcast Rules" meta="Operational thresholds">
          <KeyValueRow
            label="Stage 1 Input Tensor"
            value={<span className="font-mono text-white">256 × 256 × 3 (VV Normalized)</span>}
          />
          <KeyValueRow
            label="Loss Function (v2)"
            value={<Badge tone="live">Focal Tversky (α=0.5, β=0.5, γ=0.75)</Badge>}
          />
          <KeyValueRow
            label="Minimum Slick Area"
            value={<span className="font-mono text-white">&ge; 35 pixels (0.0035 km²)</span>}
          />
          <KeyValueRow
            label="Low-Wind Zone Cutoff"
            value={<span className="font-mono text-amber">Frame Coverage &le; 10.0%</span>}
          />
          <KeyValueRow
            label="Elongation (Aspect Ratio)"
            value={<span className="font-mono text-teal">AR &ge; 1.60 (Principal Covariance)</span>}
          />
          <KeyValueRow
            label="Radar Backscatter Damping"
            value={<span className="font-mono text-teal">&Delta;dB &ge; 0.50 dB</span>}
          />
          <KeyValueRow
            label="Lagrangian Drift Hindcast"
            value={<span className="font-mono text-white">OpenDrift 6h Backward · 50 Particles</span>}
          />
          <KeyValueRow
            label="Forensic Integrity"
            value={<Badge tone="synced">SHA-256 Signed Dossier</Badge>}
          />
        </Panel>
      </div>
    </>
  );
}
