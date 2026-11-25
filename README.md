<div align="center">

<img src="assets/banner.svg" alt="MARIS: Maritime Autonomous Reconnaissance and Attribution System" width="100%"/>

<br/>

[![Live dashboard](https://img.shields.io/badge/live_dashboard-open-0ea5a4?style=flat-square&labelColor=0b1220)](https://sih-2026-xi-lyart.vercel.app)
[![Model weights](https://img.shields.io/badge/weights-v2.0.0--models-6366f1?style=flat-square&labelColor=0b1220)](https://github.com/LavdeepSingh23/Maris/releases/tag/v2.0.0-models)
[![Status](https://img.shields.io/badge/status-research_prototype-f59e0b?style=flat-square&labelColor=0b1220)](#honest-limits)
[![Course](https://img.shields.io/badge/course-UML501-64748b?style=flat-square&labelColor=0b1220)](#team)

<img src="https://skillicons.dev/icons?i=py,tensorflow,sklearn,fastapi,react,ts,vite,tailwind,threejs,jupyter&theme=dark" alt="Python, TensorFlow, scikit-learn, FastAPI, React, TypeScript, Vite, Tailwind, Three.js, Jupyter"/>

<br/><br/>

<img src="assets/kpis.svg" alt="Dice 0.8808, IoU 0.7871, Precision 0.8786, Recall 0.8831, 68.3 images per second" width="100%"/>

<sub>ResNet50V2 Attention U-Net on the 808-image test set. Throughput on an RTX 3050 Laptop GPU.</sub>

<br/>

**[Pipeline](#pipeline)** &nbsp;|&nbsp; **[Data](#data)** &nbsp;|&nbsp; **[Results](#results)** &nbsp;|&nbsp; **[Screening](#look-alike-screening)** &nbsp;|&nbsp; **[Scene](#from-image-to-ocean)** &nbsp;|&nbsp; **[Dashboard](#dashboard)** &nbsp;|&nbsp; **[Start](#quick-start)** &nbsp;|&nbsp; **[Limits](#honest-limits)**

</div>

<br/>

> Oil damps the ripples that scatter radar back to a satellite, so a slick shows up as a **dark patch** in SAR imagery. So do calm water, algae and rain cells. **MARIS segments the dark patches, decides which ones are credible oil, places them on the map and hindcasts where they came from.**

<br/>

<img src="assets/h-pipeline.svg" alt="Pipeline" width="100%"/>

<img src="assets/pipeline.svg" alt="MARIS pipeline: SAR input, segment, screen, geolocate, hindcast, dashboard" width="100%"/>

<details>
<summary><b>Model architecture: ResNet50V2 Attention U-Net (final model)</b></summary>
<br/>

<img src="assets/figures/architecture-resnet50v2-attention-unet.png" alt="ResNet50V2 Attention U-Net architecture" width="100%"/>

ImageNet ResNet50V2 encoder tapped at five depths, four attention-gated decoder blocks (512, 256, 128, 64 filters), trained with Focal Tversky loss (alpha = beta = 0.5, gamma = 0.75). 45.8 M parameters, about 525 MB checkpoint.

</details>

<br/>

<img src="assets/h-data.svg" alt="Data" width="100%"/>

<img src="assets/figures/dataset-composition.png" alt="Dataset composition per split and sensor" width="100%"/>

| | Dataset 1: Deep-SAR (refined) | Dataset 2: CSIRO Sentinel-1 chips |
|:--|:--|:--|
| Job | Train, validate, test | Independent benchmark only |
| Sensors | ALOS PALSAR + Sentinel-1 | Sentinel-1 |
| Size | 8,070 pairs (6,455 / 807 / 808) | 5,538 chips (1,843 oil, 3,695 non-oil) |
| Labels | Pixel masks, 256 x 256 | Image-level, 400 x 400 JPEG |
| Source | [Kaggle](https://www.kaggle.com/datasets/bakhtiyar2222/deep-sar-oil-spill-segmentation-refined) | [Kaggle](https://www.kaggle.com/datasets/harikrishnacs/sentinel-1-sar-oil-spill-detection-dataset) |

<details>
<summary><b>Sample image-mask pairs</b></summary>
<br/>

<img src="assets/figures/dataset-samples.png" alt="Sample SAR patches and binary masks" width="100%"/>

</details>

<br/>

<img src="assets/h-results.svg" alt="Results" width="100%"/>

<img src="assets/models.svg" alt="Dice and IoU for six models" width="100%"/>

<img src="assets/figures/model-comparison.png" alt="Same test image segmented by each model" width="100%"/>

<sub>One test image, every model. White is predicted oil.</sub>

<br/>

<img src="assets/benchmark.svg" alt="Benchmark on 5,538 Sentinel-1 chips: confusion matrix, metrics, recall versus specificity" width="100%"/>

<details>
<summary><b>Benchmark table (all three configurations)</b></summary>
<br/>

| Configuration | TP / FN / FP / TN | Recall | Spec. | Prec. | Acc. | F1 |
|:--|:--|:-:|:-:|:-:|:-:|:-:|
| **ResNet50V2, coverage <= 10% (main)** | 1,394 / 449 / 1,030 / 2,665 | 75.64% | 72.12% | 57.51% | 73.29% | 65.34% |
| ResNet50V2, coverage <= 20% | 1,548 / 295 / 1,378 / 2,317 | 83.99% | 62.71% | 52.90% | 69.79% | 64.92% |
| Attention U-Net, coverage <= 10% | 1,201 / 642 / 743 / 2,952 | 65.17% | 79.89% | 61.78% | 74.99% | 63.43% |

Full run on 5,538 chips: 116 s (81.1 s segmentation at 68.3 images/s, 34.9 s filter).

</details>

<details>
<summary><b>Qualitative results</b></summary>
<br/>

<img src="assets/figures/test-predictions.png" alt="Test images, ground truth and ResNet50V2 prediction" width="70%"/>

<img src="assets/figures/confusion-matrix.png" alt="Confusion matrix and image-level metrics" width="100%"/>

</details>

<br/>

<img src="assets/h-filter.svg" alt="Look-alike screening" width="100%"/>

<img src="assets/filter.svg" alt="Four-rule screening filter" width="100%"/>

<details>
<summary><b>Where the filter accepts and rejects</b></summary>
<br/>

<img src="assets/figures/filter-decisions.png" alt="Filter decisions by rule for oil and non-oil chips" width="100%"/>

<img src="assets/figures/aspect-ratio-contrast.png" alt="Aspect ratio and contrast distributions" width="100%"/>

```text
AR   = sqrt(lambda1 / lambda2)                    eigenvalues of the region's coordinate covariance
C_dB = 10 * log10( mu_sea / max(mu_slick, 1) )    surrounding sea vs slick mean intensity
```

</details>

<br/>

<img src="assets/h-scene.svg" alt="From image to ocean" width="100%"/>

<img src="assets/scene.svg" alt="Scene prototype: calibrate, detect, geolocate, read winds, hindcast" width="100%"/>

<table>
<tr>
<td width="62%"><img src="assets/figures/sentinel1-calibrated-scene.png" alt="Calibrated Sentinel-1 VV backscatter" width="100%"/><br/><sub><b>Calibrated Sentinel-1 VV backscatter</b> (sigma0, dB): full scene and area of interest</sub></td>
<td width="38%"><img src="assets/figures/drift-hindcast.png" alt="Six-hour OpenDrift backward hindcast" width="100%"/><br/><sub><b>6 h backward hindcast</b>: observed point (star) and candidate origins</sub></td>
</tr>
</table>

<img src="assets/figures/pipeline-output.png" alt="End-to-end output for an oil chip and a look-alike chip" width="100%"/>

<sub>End-to-end output: an oil chip passes the filter (top), a look-alike is suppressed as a low-wind area (bottom).</sub>

<br/><br/>

<img src="assets/h-dashboard.svg" alt="Dashboard" width="100%"/>

<div align="center">

[![Open the live dashboard](https://img.shields.io/badge/OPEN_LIVE_DASHBOARD-sih--2026--xi--lyart.vercel.app-0ea5a4?style=for-the-badge&labelColor=0b1220)](https://sih-2026-xi-lyart.vercel.app)

<img src="assets/figures/dashboard-screens.png" alt="Dashboard screens: 3D globe landing page, attribution console, drift simulation, vessel registry" width="100%"/>

<sub>Landing page (3D globe), attribution console, drift simulation, vessel registry. Demonstration data.</sub>

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

<br/>

<img src="assets/h-start.svg" alt="Quick start" width="100%"/>

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build
cp .env.example .env   # optional environment variables
```

<!-- TODO: add the exact command used to start the FastAPI backend (backend/main.py) -->

Model weights (`final_resnet_attention_unet.keras`, about 525 MB) are in the release [`v2.0.0-models`](https://github.com/LavdeepSingh23/Maris/releases/tag/v2.0.0-models). `run_in_wsl.bat` sets up the WSL2 GPU environment and Jupyter kernel.

<details>
<summary><b>Repository layout</b></summary>
<br/>

```text
Maris/
  backend/            FastAPI backend (main.py): incident records and benchmark results
  dataset/            Dataset files and audit_reports/
  extracted_plots/    Dataset comparison screenshots and plots
  kaggle/             Kaggle-side notebooks and files
  ml/                 Notebooks 01-09 and 12, benchmark script, processed/, results/
  new/                Sentinel-1 scene prototype (final.ipynb)
  public/             Static assets for the dashboard
  src/                React dashboard source
  assets/             README visuals
  run_in_wsl.bat      WSL2 GPU environment and Jupyter kernel setup
```

| Step | Location |
|:--|:--|
| Audit, preprocessing, split | `ml/01` to `ml/03`; `dataset/audit_reports/`; `ml/processed/` |
| Baselines | `ml/04_cnn`, `ml/05_Random_forest` |
| U-Net, Attention U-Net, SegNet-style, ResNet50V2 | `ml/06` to `ml/09`; `ml/results/*_results.csv` |
| Benchmark | `ml/benchmark_kaggle_gpu.py`, `ml/12_Kaggle_Benchmark_Analysis_and_Visualizations_updated` |
| Scene prototype | `new/final.ipynb` |

</details>

<br/>

<img src="assets/h-honest.svg" alt="Honest limits" width="100%"/>

| Area | Limitation |
|:--|:--|
| Evaluation | Random (not scene-grouped) split, so neighbouring patches may appear in train and test and inflate segmentation scores |
| Comparison | Only the final model used a pretrained encoder, a different loss and a lower learning rate; CNN and RF used training subsets |
| Look-alikes | About one in four non-oil chips is still accepted; filter contrast is relative (JPEG), not calibrated |
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
