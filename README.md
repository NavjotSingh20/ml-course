<div align="center">

# MARIS — Maritime Autonomous Reconnaissance & Attribution System

[![Live dashboard](https://img.shields.io/badge/live_dashboard-open-0ea5a4?style=flat-square&labelColor=0b1220)](https://sih-2026-xi-lyart.vercel.app)
[![Model weights](https://img.shields.io/badge/weights-v2.0.0--models-6366f1?style=flat-square&labelColor=0b1220)](https://github.com/NavjotSingh20/ml-course/releases/tag/v2.0.0-models)
[![Status](https://img.shields.io/badge/status-research_prototype-f59e0b?style=flat-square&labelColor=0b1220)](#honest-limits)
[![Course](https://img.shields.io/badge/course-UML501-64748b?style=flat-square&labelColor=0b1220)](#honest-limits)

<br/>

<img src="https://skillicons.dev/icons?i=py,tensorflow,sklearn,fastapi,react,ts,vite,tailwind,threejs,jupyter&theme=dark" alt="Python, TensorFlow, scikit-learn, FastAPI, React, TypeScript, Vite, Tailwind, Three.js, Jupyter"/>

<br/><br/>

| Metric | 808-Image Test Set (`best_resnet_attention_unet_2`) | 5,538-Chip Benchmark (`final_resnet_attention_unet`) |
|:--|:--:|:--:|
| **Dice / F1** | **0.8808** | **68.82%** (F1) |
| **IoU / Accuracy** | **0.7871** (IoU) | **75.62%** (Acc.) |
| **Precision** | **0.8786** | **59.91%** |
| **Recall** | **0.8831** | **80.85%** |
| **Specificity** | — | **73.02%** |
| **Throughput** | — | **13.9 img/s** (CPU, NB 12) / **68.3 img/s** (RTX 3050 GPU) |

<br/>

**[Pipeline](#pipeline)** &nbsp;|&nbsp; **[Data](#data)** &nbsp;|&nbsp; **[Results](#results)** &nbsp;|&nbsp; **[Look-alike screening](#look-alike-screening)** &nbsp;|&nbsp; **[From image to ocean](#from-image-to-ocean)** &nbsp;|&nbsp; **[Dashboard](#dashboard)** &nbsp;|&nbsp; **[Quick start](#quick-start)** &nbsp;|&nbsp; **[Honest limits](#honest-limits)**

</div>

<br/>

> Oil damps the ripples that scatter radar back to a satellite, so a slick shows up as a **dark patch** in SAR imagery. So do calm water, algae and rain cells. **MARIS segments the dark patches, decides which ones are credible oil, places them on the map and hindcasts where they came from.**

## Pipeline

1. **SAR Input & Preprocessing** — Resizes SAR patches to `256 x 256` RGB and normalizes with dataset statistics (`mean = 0.4243585`, `std = 0.2139608`).
2. **Segmentation (`Stage 1`)** — ResNet50V2 Attention U-Net predicts per-pixel oil slick probability masks (`threshold > 0.5`).
3. **Physics Screening (`Stage 2`)** — Connected-component morphometrics (pixel count, frame coverage, principal-axis aspect ratio, radar damping contrast) suppress look-alikes.
4. **Geolocation & Backward Hindcast (`Stage 3`)** — Projects slick centroids to WGS84 and runs a 6-hour OpenDrift backward Lagrangian trajectory simulation.
5. **Forensic Dossier & Dashboard (`Stage 4`)** — Emits a SHA-256 hashed JSON dossier and serves incident/telemetry views via FastAPI + React/Three.js.

<details>
<summary><b>Model architecture: ResNet50V2 Attention U-Net (final model)</b></summary>
<br/>

ImageNet ResNet50V2 encoder tapped at five depths, four attention-gated decoder blocks (512, 256, 128, 64 filters), trained with Focal Tversky loss (`alpha = 0.5`, `beta = 0.5`, `gamma = 0.75`; 45,841,669 parameters, ~525 MB checkpoint).

</details>

## Data

| | Dataset 1: Deep-SAR (refined) | Dataset 2: CSIRO Sentinel-1 chips |
|:--|:--|:--|
| **Job** | Train, validate, test | Independent benchmark only |
| **Sensors** | ALOS PALSAR + Sentinel-1 | Sentinel-1 |
| **Size** | 8,070 pairs (6,455 / 807 / 808) | 5,538 chips (1,843 oil, 3,695 non-oil) |
| **Labels** | Pixel masks, 256 x 256 | Image-level, 400 x 400 JPEG |
| **Source** | [Kaggle](https://www.kaggle.com/datasets/bakhtiyar2222/deep-sar-oil-spill-segmentation-refined) | [Kaggle](https://www.kaggle.com/datasets/harikrishnacs/sentinel-1-sar-oil-spill-detection-dataset) |

## Results

### 808-Image Test Set (Deep-SAR)

| Model | Dice | IoU | Precision | Recall | Notes |
|:--|:--:|:--:|:--:|:--:|:--|
| **ResNet50V2 Attention U-Net (`best_resnet_attention_unet_2`)** | **0.8808** | **0.7871** | **0.8786** | **0.8831** | Best checkpoint (`eval_resnet_testset.py`) |
| ResNet50V2 Attention U-Net (`best_resnet_attention_unet`) | 0.8778 | 0.7822 | 0.8643 | 0.8918 | NB 09 checkpoint (`Loss = 0.2067`) |
| SegNet-style Encoder-Decoder | 0.8462 | 0.7334 | 0.8350 | 0.8577 | `ml/results/segnet_results.csv` |
| U-Net | 0.8238 | 0.7005 | 0.7837 | 0.8683 | `ml/results/unet_results.csv` |
| Attention U-Net | 0.8181 | 0.6922 | 0.7354 | 0.9218 | `ml/results/attention_unet_results.csv` |
| CNN | 0.7355 | 0.6252 | 0.7273 | 0.8095 | Per-image macro averages (1,600 train / 200 val) |
| Random Forest | 0.6990 | 0.5372 | — | — | 97,787 sampled pixels (`ml/05_Random_forest.ipynb`) |

### 5,538-Chip Independent Benchmark (CSIRO Sentinel-1)

| Configuration | TP / FN / FP / TN | Recall | Spec. | Prec. | Acc. | F1 |
|:--|:--|:-:|:-:|:-:|:-:|:-:|
| **ResNet50V2 (`final_resnet_attention_unet`, NB 12 live)** | **1,490 / 353 / 997 / 2,698** | **80.85%** | **73.02%** | **59.91%** | **75.62%** | **68.82%** |
| ResNet50V2, coverage <= 10% (`benchmark_kaggle_gpu.py`) | 1,394 / 449 / 1,030 / 2,665 | 75.64% | 72.12% | 57.51% | 73.29% | 65.34% |
| ResNet50V2, coverage <= 20% | 1,548 / 295 / 1,378 / 2,317 | 83.99% | 62.71% | 52.90% | 69.79% | 64.92% |
| Attention U-Net, coverage <= 10% | 1,201 / 642 / 743 / 2,952 | 65.17% | 79.89% | 61.78% | 74.99% | 63.43% |

- Live CPU run (`ml/12_Kaggle_Benchmark_Analysis_and_Visualizations_updated.ipynb`): `397.15 s` total (`13.9 img/s`), false alarm rate `26.98%` (`kaggle_benchmark_summary.json`).
- GPU run (`ml/benchmark_kaggle_gpu.py` on RTX 3050 Laptop GPU): `116 s` total (`81.1 s` segmentation at `68.3 img/s`, `34.9 s` physics filter).

## Look-alike screening

Stage 2 applies four sequential rules to the predicted binary mask (`ml/benchmark_kaggle_gpu.py`, `ml/12_Kaggle_Benchmark_Analysis_and_Visualizations_updated.ipynb`):

| Rule | Condition | Decision |
|:--|:--|:--|
| 1. Minimum area | `slick_pixels < 35` | `NEGATIVE / CLEAN WATER` |
| 2. Spatial coverage | `coverage_pct > 10.0%` | `PROBABLE LOOK-ALIKE (Low-Wind Zone / Calm Sea)` |
| 3. Elongation (aspect ratio) | `AR < 1.60` | `PROBABLE LOOK-ALIKE (Algal Bloom / Biogenic Film)` |
| 4. Radar backscatter contrast | `C_dB < 0.50 dB` | `PROBABLE LOOK-ALIKE (Faint Ambient Contrast)` |

```text
AR   = sqrt(lambda1 / lambda2)                    eigenvalues of the region's coordinate covariance
C_dB = 10 * log10( mu_sea / max(mu_slick, 1) )    surrounding sea vs slick mean intensity
```

## From image to ocean

The scene prototype (`new/final.ipynb`) and 4-stage pipeline (`ml/12_Kaggle_Benchmark_Analysis_and_Visualizations_updated.ipynb`, `ml/run_kaggle_pipeline.py`) calibrate Sentinel-1 backscatter, geolocate candidate slick centroids to WGS84, run a 6-hour backward OpenDrift trajectory hindcast (50 particles), and export SHA-256 hashed forensic dossiers in `ml/results/`.

## Dashboard

<div align="center">

[![Open the live dashboard](https://img.shields.io/badge/OPEN_LIVE_DASHBOARD-sih--2026--xi--lyart.vercel.app-0ea5a4?style=for-the-badge&labelColor=0b1220)](https://sih-2026-xi-lyart.vercel.app)

</div>

<details>
<summary><b>Frontend structure</b></summary>
<br/>

```text
src/
  components/
    layout/      Sidebar, Topbar, AppShell (page frame + routing outlet)
    ui/          Reusable primitives: Panel, StatCard, Badge, ProgressBar,
                 KeyValueRow, ListRow, LineChart, Sparkline
    maps/        IncidentMap, DriftMap (SVG chart-style map panels)
  pages/         One file per route: Incidents, Vessels, DriftModel, Alerts, ModelHealth
  data/          mockData.ts (sample data; swap for real FastAPI calls here)
  types/         Shared TypeScript interfaces for the domain model
```

Design tokens (color, font, spacing) live in `src/index.css` under `@theme`, so utilities such as `bg-panel`, `text-teal` and `border-border-soft` work anywhere.

</details>

<details>
<summary><b>Connecting the real FastAPI backend</b></summary>
<br/>

Everything currently reads from `src/data/mockData.ts`.

1. Add a `src/api/` folder with a small fetch or axios client.
2. Replace page imports (for example `import { incidents } from "../data/mockData"`) with a hook such as `useIncidents()` backed by `fetch('/api/incidents')`.
3. Keep the TypeScript interfaces in `src/types/` as the contract between frontend and backend. Update them first if the API response shape differs.

</details>

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build
```

FastAPI backend (`backend/main.py`):

```bash
python backend/main.py
```

Trained model weights (`final_resnet_attention_unet.keras`, `best_resnet_attention_unet_2.keras`, `random_forest.pkl`, `best_unet.keras`, `best_segnet.keras`, `best_attention_unet.keras`, `best_cnn.keras`) are available in the release [`v2.0.0-models`](https://github.com/NavjotSingh20/ml-course/releases/tag/v2.0.0-models). Download and place them in `ml/models/`.

<details>
<summary><b>Repository layout</b></summary>
<br/>

```text
ml-course/
  backend/            FastAPI backend (main.py): incident records and benchmark results
  dataset/            Dataset metadata, samples, and audit_reports/
  extracted_plots/    Dataset comparison screenshots and training/evaluation plots
  kaggle/             Kaggle-side sample chips and metadata
  ml/                 Notebooks 01-09 and 12, benchmark/eval scripts, processed/, results/
  new/                Sentinel-1 scene prototype (final.ipynb)
  public/             Static assets for the dashboard
  src/                React dashboard source
```

| Step | Location |
|:--|:--|
| Audit, preprocessing, split | `ml/01` to `ml/03`; `dataset/audit_reports/`; `ml/processed/` |
| Baselines | `ml/04_cnn`, `ml/05_Random_forest` |
| U-Net, Attention U-Net, SegNet-style, ResNet50V2 | `ml/06` to `ml/09`; `ml/results/*_results.csv` |
| Benchmark | `ml/benchmark_kaggle_gpu.py`, `ml/12_Kaggle_Benchmark_Analysis_and_Visualizations_updated` |
| Scene prototype | `new/final.ipynb` |

</details>

## Honest limits

| Area | Limitation |
|:--|:--|
| Evaluation | Random (not scene-grouped) split, so neighbouring patches may appear in train and test and inflate segmentation scores |
| Comparison | Only the final model used a pretrained encoder, a different loss and a lower learning rate; CNN and RF used training subsets |
| Look-alikes | About 27% of non-oil chips are still accepted (`26.98%` false alarm rate in NB 12); filter contrast is relative (JPEG), not calibrated |
| Scene prototype | Percentile threshold instead of the network; area calculation understates areas about 100x; hindcast seeded manually |
| Attribution | Vessel names, AIS gaps and scores in the dashboard are demonstration records, not real AIS data |

MARIS is a research prototype. It does not produce legal evidence or identify responsible vessels.

**Roadmap**

- [ ] Scene-grouped re-split and identical-settings retraining of all models
- [ ] Train the screening stage on look-alike-rich data; add wind, calibrated sigma0 contrast and edge features
- [ ] Run the network on calibrated scenes with a sliding window; seed the hindcast automatically from detections
- [ ] Real AIS tracks intersected with the hindcast origin cloud; connect the dashboard to the live backend
- [ ] Distillation or a lighter encoder for on-board hardware

<br/>

Machine Learning Project (UML501), Department of Computer Science and Engineering, Thapar Institute of Engineering and Technology, Patiala.

<details>
<summary><b>References</b></summary>
<br/>

1. C. Brekke and A. H. S. Solberg, "Oil spill detection by satellite remote sensing," *Remote Sens. Environ.*, 2005.
2. Q. Zhu et al., "Oil spill contextual and boundary-supervised detection network based on marine SAR images," *IEEE TGRS*, 2022.
3. D. Blondeau-Patissier et al., "CSIRO Sentinel-1 SAR image dataset of oil- and non-oil features," CSIRO, 2022.
4. O. Ronneberger et al., "U-Net," *MICCAI*, 2015. O. Oktay et al., "Attention U-Net," arXiv:1804.03999, 2018.
5. K. He et al., "Identity mappings in deep residual networks," *ECCV*, 2016.
6. N. Abraham and N. M. Khan, "A novel focal Tversky loss function with improved attention U-Net for lesion segmentation," *ISBI*, 2019.
7. K.-F. Dagestad et al., "OpenDrift v1.0," *Geosci. Model Dev.*, 2018. H. Hersbach et al., "The ERA5 global reanalysis," *QJRMS*, 2020.

</details>
