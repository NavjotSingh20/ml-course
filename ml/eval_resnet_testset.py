import os
import sys
import json
import time
from pathlib import Path

import numpy as np
import pandas as pd
from PIL import Image

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
import tensorflow as tf

gpus = tf.config.list_physical_devices("GPU")
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print("[✓] GPU Memory Growth Enabled on:", gpus[0].name)
    except Exception as e:
        print("[!] GPU Warning:", e)

ROOT = Path(__file__).resolve().parent.parent
SPLITS_CSV = ROOT / "ml" / "processed" / "dataset_splits.csv"
RESULTS_DIR = ROOT / "ml" / "results"
FINAL_MODEL = ROOT / "ml" / "models" / "final_resnet_attention_unet.keras"
RES_MODEL_2 = ROOT / "ml" / "models" / "best_resnet_attention_unet_2.keras"
RES_MODEL = ROOT / "ml" / "models" / "best_resnet_attention_unet.keras"

if len(sys.argv) > 1 and sys.argv[1].endswith(".keras"):
    MODEL_PATH = Path(sys.argv[1]).resolve()
elif FINAL_MODEL.exists():
    MODEL_PATH = FINAL_MODEL
elif RES_MODEL_2.exists():
    MODEL_PATH = RES_MODEL_2
else:
    MODEL_PATH = RES_MODEL

IMG_SIZE = (256, 256)
BATCH_SIZE = 8
MEAN = np.array([0.4243585, 0.4243585, 0.4243585], dtype=np.float32)
STD  = np.array([0.2139608, 0.2139608, 0.2139608], dtype=np.float32)

def dice_score(y_true, y_pred, smooth=1e-6):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred > 0.5, tf.float32)
    intersection = tf.reduce_sum(y_true * y_pred)
    return (2.0 * intersection + smooth) / (tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) + smooth)

def iou_score(y_true, y_pred, smooth=1e-6):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred > 0.5, tf.float32)
    intersection = tf.reduce_sum(y_true * y_pred)
    union = tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) - intersection
    return (intersection + smooth) / (union + smooth)

def focal_tversky_loss(y_true, y_pred, alpha=0.3, beta=0.7, gamma=0.75, smooth=1e-6):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred, tf.float32)
    tp = tf.reduce_sum(y_true * y_pred)
    fp = tf.reduce_sum((1.0 - y_true) * y_pred)
    fn = tf.reduce_sum(y_true * (1.0 - y_pred))
    tversky = (tp + smooth) / (tp + alpha * fp + beta * fn + smooth)
    return tf.pow(1.0 - tversky, gamma)

class SARDatasetGenerator(tf.keras.utils.Sequence):
    def __init__(self, df, batch_size=BATCH_SIZE):
        self.df = df.reset_index(drop=True)
        self.batch_size = batch_size
        self.indices = np.arange(len(self.df))

    def __len__(self):
        return int(np.ceil(len(self.df) / self.batch_size))

    def __getitem__(self, idx):
        batch_idx = self.indices[idx * self.batch_size : (idx + 1) * self.batch_size]
        batch_images, batch_masks = [], []
        for i in batch_idx:
            row = self.df.iloc[i]
            img = Image.open(ROOT / row["image_path"]).convert("RGB").resize(IMG_SIZE)
            img_arr = (np.array(img, dtype=np.float32) / 255.0 - MEAN) / STD
            mask = Image.open(ROOT / row["mask_path"]).convert("L").resize(IMG_SIZE, Image.Resampling.NEAREST)
            mask_arr = (np.array(mask) > 127).astype(np.float32)
            batch_images.append(img_arr)
            batch_masks.append(np.expand_dims(mask_arr, axis=-1))
        return np.array(batch_images), np.array(batch_masks)

print("[*] Loading test split from:", SPLITS_CSV)
df = pd.read_csv(SPLITS_CSV)
test_df = df[df["split"] == "test"]
print(f"    Total test images: {len(test_df)}")

test_gen = SARDatasetGenerator(test_df, batch_size=BATCH_SIZE)

print("[*] Loading model from:", MODEL_PATH.name)
model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={
        "focal_tversky_loss": focal_tversky_loss,
        "dice_score": dice_score,
        "iou_score": iou_score
    },
    compile=False
)

print("[*] Running evaluation on 808 test images...")
@tf.function(reduce_retracing=True)
def predict_step(batch_tensor):
    return model(batch_tensor, training=False)

all_preds, all_masks = [], []
total_batches = len(test_gen)
for i in range(total_batches):
    x_b, y_b = test_gen[i]
    preds = predict_step(x_b).numpy()
    all_preds.append((preds > 0.5).astype(np.uint8))
    all_masks.append(y_b.astype(np.uint8))
    if (i + 1) % 20 == 0 or (i + 1) == total_batches:
        print(f"    • Evaluated batch {i + 1} / {total_batches} ({((i + 1)/total_batches)*100:.1f}%)...")

flat_preds = np.concatenate(all_preds).reshape(-1)
flat_masks = np.concatenate(all_masks).reshape(-1)

intersection = np.logical_and(flat_masks, flat_preds).sum()
union = np.logical_or(flat_masks, flat_preds).sum()
dice = (2.0 * intersection) / (flat_masks.sum() + flat_preds.sum() + 1e-7)
iou = intersection / (union + 1e-7)
precision = intersection / (flat_preds.sum() + 1e-7)
recall = intersection / (flat_masks.sum() + 1e-7)

results = {
    "Model": f"ResNet50V2 Attention U-Net ({MODEL_PATH.stem})",
    "Dice": round(float(dice), 4),
    "IoU": round(float(iou), 4),
    "Precision": round(float(precision), 4),
    "Recall": round(float(recall), 4)
}

results_df = pd.DataFrame([results])
results_path = RESULTS_DIR / f"{MODEL_PATH.stem}_results.csv"
results_df.to_csv(results_path, index=False)

print("\n" + "="*65)
print("  OFFICIAL 808-IMAGE TEST SET BENCHMARK RESULTS")
print("="*65)
print(results_df.to_string(index=False))
print(f"[✓] Saved results to: {results_path}")
