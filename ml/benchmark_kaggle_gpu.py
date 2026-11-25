"""
MARIS (Maritime Autonomous Reconnaissance & Attribution System)
Stage 1, 2, 3 High-Performance GPU Benchmark on Kaggle Sentinel-1 SAR Dataset
--------------------------------------------------------------------------
Stages Executed:
- Stage 1: Batched Preprocessing & ResNet50V2 Attention U-Net Deep Learning Inference on GPU
- Stage 2: SAR Physics Morphometrics (Area, Principal Axis Aspect Ratio, Damping dB)
- Stage 3: Physics Discriminator & Evaluation Metrics (TP, TN, FP, FN, CSV + JSON Export)
"""

import os
import sys
import time
import json
from pathlib import Path

import numpy as np
import pandas as pd
from PIL import Image
from scipy.ndimage import label, center_of_mass

# Suppress verbose TensorFlow logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
import tensorflow as tf

# -------------------------------------------------------------
# GPU Configuration
# -------------------------------------------------------------
gpus = tf.config.list_physical_devices("GPU")
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print(f"[✓] GPU Memory Growth Enabled on: {gpus[0].name}")
    except RuntimeError as e:
        print(f"[!] GPU Config Error: {e}")
else:
    print("[!] No GPU detected, running on CPU.")

# -------------------------------------------------------------
# Paths & Hyperparameters
# -------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
KAGGLE_DIR = ROOT / "kaggle" / "data"
RESULTS_DIR = ROOT / "ml" / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

# Model selection: final_resnet_attention_unet > best_resnet_attention_unet_2 > best_resnet_attention_unet > Attention U-Net (or pass via CLI)
FINAL_MODEL = ROOT / "ml" / "models" / "final_resnet_attention_unet.keras"
RES_MODEL_2 = ROOT / "ml" / "models" / "best_resnet_attention_unet_2.keras"
RES_MODEL = ROOT / "ml" / "models" / "best_resnet_attention_unet.keras"
BASE_MODEL = ROOT / "ml" / "models" / "best_attention_unet.keras"
if len(sys.argv) > 1 and sys.argv[1].endswith(".keras"):
    MODEL_PATH = Path(sys.argv[1]).resolve()
elif FINAL_MODEL.exists():
    MODEL_PATH = FINAL_MODEL
elif RES_MODEL_2.exists():
    MODEL_PATH = RES_MODEL_2
elif RES_MODEL.exists():
    MODEL_PATH = RES_MODEL
else:
    MODEL_PATH = BASE_MODEL

BATCH_SIZE = 32
IMG_SIZE = (256, 256)

MEAN = np.array([0.4243585, 0.4243585, 0.4243585], dtype=np.float32)
STD  = np.array([0.2139608, 0.2139608, 0.2139608], dtype=np.float32)

def load_attention_unet(model_path):
    """Loads the model with registered custom objects."""
    def dice_score(y_true, y_pred):
        y_true = tf.cast(y_true, tf.float32)
        y_pred = tf.cast(y_pred > 0.5, tf.float32)
        intersection = tf.reduce_sum(y_true * y_pred)
        return (2.0 * intersection + 1e-6) / (tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) + 1e-6)

    def iou_score(y_true, y_pred, smooth=1e-6):
        y_true = tf.cast(y_true, tf.float32)
        y_pred = tf.cast(y_pred > 0.5, tf.float32)
        intersection = tf.reduce_sum(y_true * y_pred)
        union = tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) - intersection
        return (intersection + smooth) / (union + smooth)

    def loss_fn(y_true, y_pred):
        bce = tf.reduce_mean(tf.keras.losses.binary_crossentropy(y_true, y_pred))
        return bce + (1.0 - dice_score(y_true, y_pred))

    def focal_tversky_loss(y_true, y_pred, alpha=0.3, beta=0.7, gamma=0.75, smooth=1e-6):
        y_true = tf.cast(y_true, tf.float32)
        y_pred = tf.cast(y_pred, tf.float32)
        tp = tf.reduce_sum(y_true * y_pred)
        fp = tf.reduce_sum((1.0 - y_true) * y_pred)
        fn = tf.reduce_sum(y_true * (1.0 - y_pred))
        tversky = (tp + smooth) / (tp + alpha * fp + beta * fn + smooth)
        return tf.pow(1.0 - tversky, gamma)

    print(f"[*] Loading model from {model_path.name}...")
    model = tf.keras.models.load_model(
        model_path,
        custom_objects={
            "loss_fn": loss_fn,
            "dice_score": dice_score,
            "iou_score": iou_score,
            "focal_tversky_loss": focal_tversky_loss
        },
        compile=False
    )
    print(f"    [✓] {model.name} loaded successfully ({model.count_params():,} parameters).")
    return model

def get_image_paths():
    """Retrieves all image paths from Class_1 and Class_0."""
    c1_dir = KAGGLE_DIR / "Class_1"
    c0_dir = KAGGLE_DIR / "Class_0"

    c1_images = sorted(list(c1_dir.glob("*.jpg")))
    c0_images = sorted(list(c0_dir.glob("*.jpg")))

    items = []
    for p in c1_images:
        items.append((str(p), p.name, 1))
    for p in c0_images:
        items.append((str(p), p.name, 0))

    print(f"[✓] Discovered {len(c1_images):,} Class_1 (Spills) and {len(c0_images):,} Class_0 (Look-Alikes).")
    print(f"[✓] Total dataset: {len(items):,} images.")
    return items

def tf_data_generator(items, batch_size=BATCH_SIZE):
    """Builds a high-throughput tf.data pipeline."""
    paths = [item[0] for item in items]

    def load_and_preprocess(path_str):
        raw = tf.io.read_file(path_str)
        img = tf.image.decode_jpeg(raw, channels=3)
        img = tf.image.resize(img, IMG_SIZE)
        img = tf.cast(img, tf.float32) / 255.0
        normalized = (img - MEAN) / STD
        return normalized

    ds = tf.data.Dataset.from_tensor_slices(paths)
    ds = ds.map(load_and_preprocess, num_parallel_calls=tf.data.AUTOTUNE)
    ds = ds.batch(batch_size)
    ds = ds.prefetch(tf.data.AUTOTUNE)
    return ds

def compute_morphometrics_and_classify(pred_mask_2d, raw_img_gray, true_class):
    """
    Computes slick morphometrics and applies the physics discriminator:
    - Low-wind zone rejection: coverage > 10%
    - Biogenic slick rejection: aspect ratio < 1.6
    - Weak contrast rejection: damping < 0.5 dB
    - Confirmed spill: AR >= 1.6, Damping >= 0.5 dB, Cov <= 10%
    """
    binary_mask = (pred_mask_2d > 0.5).astype(np.uint8)
    slick_pixels = int(np.sum(binary_mask))
    total_pixels = binary_mask.size
    coverage_pct = (slick_pixels / total_pixels) * 100.0
    area_km2 = slick_pixels * 0.0001 # 10m x 10m ground resolution

    if slick_pixels < 35:
        category = "NEGATIVE / CLEAN WATER"
        aspect_ratio = 0.0
        damping_ratio_db = 0.0
    else:
        # Connected components
        labeled, num_features = label(binary_mask)
        sizes = [np.sum(labeled == i) for i in range(1, num_features + 1)]
        dominant_id = int(np.argmax(sizes)) + 1
        dom_mask = (labeled == dominant_id)
        cy, cx = center_of_mass(dom_mask)

        # Principal axes aspect ratio
        y_coords, x_coords = np.where(dom_mask)
        if len(y_coords) > 5:
            coords = np.vstack([x_coords - cx, y_coords - cy])
            cov = np.cov(coords)
            evals, _ = np.linalg.eig(cov)
            evals = np.sort(evals)[::-1]
            aspect_ratio = float(np.sqrt(max(evals[0], 1e-5) / max(evals[1], 1e-5))) if evals[1] > 0 else 1.0
        else:
            aspect_ratio = 1.0

        # Backscatter contrast (Damping ratio)
        sea_pixels = raw_img_gray[binary_mask == 0]
        slick_vals = raw_img_gray[binary_mask == 1]
        sea_mean = np.mean(sea_pixels) if len(sea_pixels) > 0 else 128.0
        slick_mean = np.mean(slick_vals) if len(slick_vals) > 0 else 1.0
        damping_ratio_db = float(10.0 * np.log10(max(sea_mean, 1.0) / max(slick_mean, 1.0)))

        # Physics Classification
        if coverage_pct > 10.0:
            category = "PROBABLE LOOK-ALIKE (Low-Wind Zone)"
        elif aspect_ratio < 1.60:
            category = "PROBABLE LOOK-ALIKE (Biogenic Film)"
        elif damping_ratio_db < 0.50:
            category = "PROBABLE LOOK-ALIKE (Faint Contrast)"
        else:
            category = "CONFIRMED HYDROCARBON SPILL"

    is_confirmed = (category == "CONFIRMED HYDROCARBON SPILL")

    # Confusion matrix categorization
    if true_class == 1 and is_confirmed:
        confusion = "TP" # True Positive: Confirmed real spill
    elif true_class == 1 and not is_confirmed:
        confusion = "FN" # False Negative: Missed real spill (or rejected as look-alike)
    elif true_class == 0 and not is_confirmed:
        confusion = "TN" # True Negative: Correctly rejected/suppressed look-alike
    else: # true_class == 0 and is_confirmed
        confusion = "FP" # False Positive: False alarm on look-alike

    return {
        "slick_pixels": slick_pixels,
        "coverage_pct": round(coverage_pct, 2),
        "area_km2": round(area_km2, 4),
        "aspect_ratio": round(aspect_ratio, 2),
        "damping_ratio_db": round(damping_ratio_db, 2),
        "classification": category,
        "is_confirmed_spill": is_confirmed,
        "confusion_category": confusion
    }

def main():
    print("=" * 75)
    print("  MARIS GPU PIPELINE BENCHMARK: STAGES 1, 2, 3")
    print(f"  Model: {MODEL_PATH.name}")
    print("  Dataset: Kaggle Sentinel-1 SAR (5,538 Images)")
    print("=" * 75)

    # 1. Load Items
    items = get_image_paths()
    total_count = len(items)
    if total_count == 0:
        print("[!] No images found in kaggle/data/.")
        sys.exit(1)

    # 2. Load Model
    model = load_attention_unet(MODEL_PATH)

    # 3. Streamed Batched GPU Inference & Morphometrics (OOM-Safe)
    print(f"\n[*] Launching Streamed GPU Inference + Morphometrics (Batch size = {BATCH_SIZE})...")
    ds = tf_data_generator(items, batch_size=BATCH_SIZE)

    @tf.function(reduce_retracing=True)
    def predict_batch_gpu(batch_tensor):
        return model(batch_tensor, training=False)

    t_inf_total = 0.0
    t_morph_total = 0.0
    results = []
    item_idx = 0
    print_interval = max(1, total_count // 10)

    for batch_idx, batch_x in enumerate(ds):
        t0 = time.time()
        batch_preds = predict_batch_gpu(batch_x).numpy() # Stream predictions directly to CPU
        t_inf_total += time.time() - t0

        t1 = time.time()
        for b in range(batch_preds.shape[0]):
            if item_idx >= total_count:
                break
            path_str, name, true_class = items[item_idx]
            pred_2d = batch_preds[b, :, :, 0]

            try:
                raw_img = Image.open(path_str).convert("L").resize(IMG_SIZE)
                raw_arr = np.array(raw_img, dtype=np.float32)
            except Exception:
                raw_arr = np.zeros(IMG_SIZE, dtype=np.float32)

            res = compute_morphometrics_and_classify(pred_2d, raw_arr, true_class)

            results.append({
                "image_name": name,
                "ground_truth_class": true_class,
                "classification": res["classification"],
                "is_confirmed_spill": int(res["is_confirmed_spill"]),
                "confusion_category": res["confusion_category"],
                "slick_pixels": res["slick_pixels"],
                "area_km2": res["area_km2"],
                "coverage_pct": res["coverage_pct"],
                "aspect_ratio": res["aspect_ratio"],
                "damping_ratio_db": res["damping_ratio_db"]
            })

            item_idx += 1
            if item_idx % print_interval == 0 or item_idx == total_count:
                pct = (item_idx / total_count) * 100.0
                print(f"    • Processed {item_idx:,} / {total_count:,} ({pct:.1f}%)...")
        t_morph_total += time.time() - t1

    throughput = total_count / max(t_inf_total, 0.001)
    t_grand_total = t_inf_total + t_morph_total

    print(f"\n[✓] Inference Completed in {t_inf_total:.2f}s ({throughput:.1f} images/sec)!")
    print(f"[✓] Morphometrics Completed in {t_morph_total:.2f}s!")

    # 5. Export Per-Image CSV
    df = pd.DataFrame(results)
    csv_path = RESULTS_DIR / "kaggle_dataset_benchmark.csv"
    df.to_csv(csv_path, index=False)
    print(f"\n[✓] Detailed per-image benchmark exported to: {csv_path}")

    # 6. Compute Global Metrics
    tp = int(np.sum(df["confusion_category"] == "TP"))
    tn = int(np.sum(df["confusion_category"] == "TN"))
    fp = int(np.sum(df["confusion_category"] == "FP"))
    fn = int(np.sum(df["confusion_category"] == "FN"))

    total = tp + tn + fp + fn
    accuracy = (tp + tn) / total if total > 0 else 0.0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0
    f1 = (2.0 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    c1_total = int(np.sum(df["ground_truth_class"] == 1))
    c0_total = int(np.sum(df["ground_truth_class"] == 0))

    summary = {
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "model_evaluated": f"{model.name} ({MODEL_PATH.name})",
        "hardware_accelerator": "NVIDIA GeForce RTX 3050 Laptop GPU (WSL2)",
        "total_images": total,
        "class_1_spills_total": c1_total,
        "class_0_lookalikes_total": c0_total,
        "confusion_matrix": {
            "true_positives_tp": tp,
            "true_negatives_tn": tn,
            "false_positives_fp": fp,
            "false_negatives_fn": fn
        },
        "performance_metrics": {
            "accuracy": round(accuracy * 100.0, 2),
            "spill_recall_sensitivity": round(recall * 100.0, 2),
            "precision": round(precision * 100.0, 2),
            "lookalike_rejection_specificity": round(specificity * 100.0, 2),
            "f1_score": round(f1 * 100.0, 2),
            "false_alarm_rate": round((1.0 - specificity) * 100.0, 2)
        },
        "timing_and_throughput": {
            "gpu_inference_time_sec": round(t_inf_total, 2),
            "morphometrics_time_sec": round(t_morph_total, 2),
            "total_benchmark_time_sec": round(t_grand_total, 2),
            "throughput_images_per_sec": round(throughput, 1)
        }
    }

    json_path = RESULTS_DIR / "kaggle_benchmark_summary.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print(f"[✓] Summary statistics JSON exported to: {json_path}")

    # 7. Print Final Table
    print("\n" + "=" * 75)
    print("       MARIS KAGGLE DATASET BENCHMARK RESULTS (GPU ACCELERATED)")
    print("=" * 75)
    print(f"Total Images Evaluated        : {total:,} ({c1_total:,} Spills, {c0_total:,} Look-Alikes)")
    print(f"Total Processing Time         : {t_grand_total:.1f}s ({throughput:.1f} images/sec on RTX 3050)")
    print("-" * 75)
    print("CONFUSION MATRIX:")
    print(f"  • True Positives  (TP - Real Spills Caught)       : {tp:,} / {c1_total:,} ({recall*100.0:.1f}%)")
    print(f"  • True Negatives  (TN - Look-Alikes Suppressed)   : {tn:,} / {c0_total:,} ({specificity*100.0:.1f}%)")
    print(f"  • False Positives (FP - False Alarms)             : {fp:,} / {c0_total:,} ({(1.0-specificity)*100.0:.1f}%)")
    print(f"  • False Negatives (FN - Slicks Missed / Dispersed): {fn:,} / {c1_total:,} ({(1.0-recall)*100.0:.1f}%)")
    print("-" * 75)
    print("KEY PERFORMANCE INDICATORS (KPIs):")
    print(f"  ★ Look-Alike Rejection (Specificity) : {specificity*100.0:.2f}%  (Suppresses false alarms)")
    print(f"  ★ Spill Detection Recall (Sensitivity): {recall*100.0:.2f}%  (Operational coverage)")
    print(f"  ★ Precision                          : {precision*100.0:.2f}%")
    print(f"  ★ Overall Accuracy                   : {accuracy*100.0:.2f}%")
    print(f"  ★ F1 Score                           : {f1*100.0:.2f}%")
    print("=" * 75)

if __name__ == "__main__":
    main()
