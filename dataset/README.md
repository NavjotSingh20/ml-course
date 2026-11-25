# MARIS Dataset Documentation

This directory contains metadata, quality audit reports, and curated test samples for the **MARIS** (*Maritime Autonomous Reconnaissance & Attribution System*) satellite pipeline.

---

## 1. Sensor Overview

The full dataset comprises **8,070 high-resolution SAR image-mask pairs** ($256 \times 256$ pixels):
* **Copernicus Sentinel-1 (ESA):** 4,193 images. C-band Synthetic Aperture Radar (SAR) with dual-polarization (VV/VH), optimal for marine pollution detection and roughness damping.
* **ALOS PALSAR (JAXA):** 3,877 images. L-band Synthetic Aperture Radar penetrating sea spray and rain to detect surface capillary wave attenuation.

### Class Balance & Ground Truth:
* **Background sea water / land:** Pixel value `0` (~75% of total scene pixels).
* **Crude oil / hydrocarbon slick:** Pixel value `1` (or `255` before thresholding, ~25% positive ratio).
* **Positive Class Weight Multiplier (`pos_weight`):** `3.009` (configured in `ml/processed/preprocess_config.json`).

---

## 2. Directory Structure

```
dataset/
├── README.md                      # This documentation file
├── samples/                       # Curated test samples (tracked in Git for testing)
│   ├── images/                    # 10 representative SAR tiles (PALSAR & Sentinel-1)
│   └── masks/                     # Ground truth binary masks
├── audit_reports/                 # Data quality reports from 01 & 02 notebooks
│   ├── dataset_inspection.csv     # Sensor breakdown & dimension audits
│   ├── duplicate_images.csv       # Verification of 0 duplicates
│   ├── full_mask_analysis.csv     # Full pixel distribution audit
│   └── non_binary_masks.csv       # Binarization catalog (threshold = 127)
├── maris_dataset_audit_manifest.csv # Master inventory
├── preprocessing_pairs.csv        # Preprocessing pairing manifest
└── Ml_project_dataset/            # [LOCAL ONLY - GITIGNORED] 1.3 GB raw imagery (8,070 pairs)
```

---

## 3. How to Obtain the Full 1.3 GB Dataset

Due to GitHub repository limits, the full 1.3 GB raw imagery directory (`Ml_project_dataset/`) is excluded from Git tracking via `.gitignore`.

To use the full training dataset:
1. Download the dataset archive from the team cloud storage / Kaggle repository:
   * **URL:** `https://drive.google.com/drive/folders/MARIS-SIH2026-DATASET` *(or project release)*
2. Extract the archive directly into `dataset/Ml_project_dataset/`.
3. Verify that the following directory paths exist:
   * `dataset/Ml_project_dataset/images/images/train/`
   * `dataset/Ml_project_dataset/images/images/val/`
   * `dataset/Ml_project_dataset/masks/masks/train/`
   * `dataset/Ml_project_dataset/masks/masks/val/`
4. Run notebook `ml/03_data_preprocessing.ipynb` to regenerate splits.
