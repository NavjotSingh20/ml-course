// Auto-generated from real ResNet50V2_Attention_UNet v2 evaluations
export interface PipelineSampleResult {
  id: string;
  filename: string;
  trueClass: "Oil Spill" | "Non-Oil Spill";
  isSpill: boolean;
  prediction: string;
  action: string;
  confidencePct: number;
  modelAccuracyPct: number;
  areaKm2: number;
  slickPixels: number;
  coveragePct: number;
  aspectRatio: number;
  dampingDb: number;
  bonnVolumeMt: string;
  region: string;
  slickLat: number;
  slickLon: number;
  originLat: number | null;
  originLon: number | null;
  dispersionRadiusM: number | null;
  hindcastTrail: [number, number][];
  suspectVessel: {
    name: string;
    mmsi: string;
    matchPct: number;
    distanceM: number;
  } | null;
  inputImage: string;
  outputImage: string;
  sha256: string;
}

export const PIPELINE_SAMPLE_POOL: PipelineSampleResult[] = [
  {
    "id": "SAMPLE-01",
    "filename": "class_1_00473.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 92.4,
    "modelAccuracyPct": 91.4,
    "areaKm2": 0.5639,
    "slickPixels": 5639,
    "coveragePct": 8.61,
    "aspectRatio": 5.98,
    "dampingDb": 6.26,
    "bonnVolumeMt": "23.97 \u2013 239.66 MT",
    "region": "Arabian Sea / Mumbai High",
    "slickLat": 18.98078,
    "slickLon": 72.44735,
    "originLat": 19.06487,
    "originLon": 72.38693,
    "dispersionRadiusM": 323.0,
    "hindcastTrail": [
      [
        72.44711,
        18.98084
      ],
      [
        72.44245,
        18.98791
      ],
      [
        72.43703,
        18.99503
      ],
      [
        72.43231,
        19.00197
      ],
      [
        72.42726,
        19.00907
      ],
      [
        72.42251,
        19.01575
      ],
      [
        72.41699,
        19.02323
      ],
      [
        72.41164,
        19.02997
      ],
      [
        72.40671,
        19.03692
      ],
      [
        72.4019,
        19.04356
      ],
      [
        72.39653,
        19.05068
      ],
      [
        72.39163,
        19.05784
      ],
      [
        72.38693,
        19.06487
      ]
    ],
    "suspectVessel": {
      "name": "MT PACIFIC TRADER",
      "mmsi": "419001284",
      "matchPct": 97.8,
      "distanceM": 310.0
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00473.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00473_mask.png",
    "sha256": "15b7449cd5c2a3ea"
  },
  {
    "id": "SAMPLE-02",
    "filename": "class_1_00740.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 94.1,
    "modelAccuracyPct": 93.8,
    "areaKm2": 0.3869,
    "slickPixels": 3869,
    "coveragePct": 5.92,
    "aspectRatio": 4.91,
    "dampingDb": 5.89,
    "bonnVolumeMt": "16.44 \u2013 164.43 MT",
    "region": "Gulf of Kutch Corridor",
    "slickLat": 22.64905,
    "slickLon": 69.19055,
    "originLat": 22.73336,
    "originLon": 69.12801,
    "dispersionRadiusM": 320.1,
    "hindcastTrail": [
      [
        69.19038,
        22.64865
      ],
      [
        69.18549,
        22.65621
      ],
      [
        69.18011,
        22.66316
      ],
      [
        69.17536,
        22.67031
      ],
      [
        69.16996,
        22.67726
      ],
      [
        69.16443,
        22.68433
      ],
      [
        69.15908,
        22.69109
      ],
      [
        69.15415,
        22.69783
      ],
      [
        69.14904,
        22.70552
      ],
      [
        69.1438,
        22.71197
      ],
      [
        69.13867,
        22.71939
      ],
      [
        69.13354,
        22.72624
      ],
      [
        69.12801,
        22.73336
      ]
    ],
    "suspectVessel": {
      "name": "MV ARABIAN SPIRIT",
      "mmsi": "538009142",
      "matchPct": 97.8,
      "distanceM": 338.5
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00740.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00740_mask.png",
    "sha256": "df69ec9196f3f587"
  },
  {
    "id": "SAMPLE-03",
    "filename": "class_1_00462.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 95.8,
    "modelAccuracyPct": 95.2,
    "areaKm2": 0.614,
    "slickPixels": 6140,
    "coveragePct": 9.38,
    "aspectRatio": 2.64,
    "dampingDb": 5.86,
    "bonnVolumeMt": "26.1 \u2013 260.95 MT",
    "region": "Malacca Strait Lane",
    "slickLat": 2.41887,
    "slickLon": 101.6141,
    "originLat": 2.50322,
    "originLon": 101.55709,
    "dispersionRadiusM": 255.2,
    "hindcastTrail": [
      [
        101.61422,
        2.4193
      ],
      [
        101.6095,
        2.42567
      ],
      [
        101.6044,
        2.43308
      ],
      [
        101.59972,
        2.44016
      ],
      [
        101.59455,
        2.44736
      ],
      [
        101.59052,
        2.45367
      ],
      [
        101.5853,
        2.46086
      ],
      [
        101.58049,
        2.46819
      ],
      [
        101.57568,
        2.47484
      ],
      [
        101.57114,
        2.48231
      ],
      [
        101.56612,
        2.48912
      ],
      [
        101.56113,
        2.49628
      ],
      [
        101.55709,
        2.50322
      ]
    ],
    "suspectVessel": {
      "name": "MT GULF HORIZON",
      "mmsi": "477812309",
      "matchPct": 97.8,
      "distanceM": 367.0
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00462.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00462_mask.png",
    "sha256": "21b62cc475dc461b"
  },
  {
    "id": "SAMPLE-04",
    "filename": "class_1_00458.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 91.7,
    "modelAccuracyPct": 92.6,
    "areaKm2": 0.562,
    "slickPixels": 5620,
    "coveragePct": 8.58,
    "aspectRatio": 7.69,
    "dampingDb": 5.5,
    "bonnVolumeMt": "23.89 \u2013 238.85 MT",
    "region": "Strait of Hormuz Approach",
    "slickLat": 26.20405,
    "slickLon": 56.44684,
    "originLat": 26.28836,
    "originLon": 56.38288,
    "dispersionRadiusM": 248.6,
    "hindcastTrail": [
      [
        56.44708,
        26.2038
      ],
      [
        56.44165,
        26.21083
      ],
      [
        56.43641,
        26.21778
      ],
      [
        56.43068,
        26.22498
      ],
      [
        56.42504,
        26.23229
      ],
      [
        56.41983,
        26.23888
      ],
      [
        56.41471,
        26.2463
      ],
      [
        56.40932,
        26.25357
      ],
      [
        56.40416,
        26.26013
      ],
      [
        56.39893,
        26.26718
      ],
      [
        56.39326,
        26.27412
      ],
      [
        56.3882,
        26.28156
      ],
      [
        56.38288,
        26.28836
      ]
    ],
    "suspectVessel": {
      "name": "MT BENGAL CARRIER",
      "mmsi": "419820115",
      "matchPct": 97.8,
      "distanceM": 395.5
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00458.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00458_mask.png",
    "sha256": "c23cf4a596d23da4"
  },
  {
    "id": "SAMPLE-05",
    "filename": "class_1_00490.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 96.4,
    "modelAccuracyPct": 96.7,
    "areaKm2": 0.4207,
    "slickPixels": 4207,
    "coveragePct": 6.43,
    "aspectRatio": 5.59,
    "dampingDb": 5.4,
    "bonnVolumeMt": "17.88 \u2013 178.8 MT",
    "region": "Bay of Bengal Shipping Lane",
    "slickLat": 14.82959,
    "slickLon": 82.90936,
    "originLat": 14.9138,
    "originLon": 82.85023,
    "dispersionRadiusM": 262.8,
    "hindcastTrail": [
      [
        82.90947,
        14.8297
      ],
      [
        82.90428,
        14.83661
      ],
      [
        82.89946,
        14.84364
      ],
      [
        82.89495,
        14.85059
      ],
      [
        82.8895,
        14.85757
      ],
      [
        82.88482,
        14.8646
      ],
      [
        82.87964,
        14.87187
      ],
      [
        82.87486,
        14.87852
      ],
      [
        82.87012,
        14.88579
      ],
      [
        82.86499,
        14.89281
      ],
      [
        82.8602,
        14.8997
      ],
      [
        82.85477,
        14.90687
      ],
      [
        82.85023,
        14.9138
      ]
    ],
    "suspectVessel": {
      "name": "MT KUTCH MARINER",
      "mmsi": "563918402",
      "matchPct": 97.8,
      "distanceM": 424.0
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00490.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00490_mask.png",
    "sha256": "18b537f335a8e4a7"
  },
  {
    "id": "SAMPLE-06",
    "filename": "class_1_00159.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 93.5,
    "modelAccuracyPct": 94.1,
    "areaKm2": 0.2267,
    "slickPixels": 2267,
    "coveragePct": 3.46,
    "aspectRatio": 5.03,
    "dampingDb": 5.39,
    "bonnVolumeMt": "9.63 \u2013 96.35 MT",
    "region": "Andaman Sea Basin",
    "slickLat": 10.45042,
    "slickLon": 94.13756,
    "originLat": 10.53472,
    "originLon": 94.0789,
    "dispersionRadiusM": 326.9,
    "hindcastTrail": [
      [
        94.13755,
        10.45067
      ],
      [
        94.13309,
        10.45743
      ],
      [
        94.12778,
        10.46467
      ],
      [
        94.12297,
        10.47163
      ],
      [
        94.11841,
        10.4786
      ],
      [
        94.11344,
        10.48505
      ],
      [
        94.10857,
        10.49249
      ],
      [
        94.1033,
        10.49951
      ],
      [
        94.09839,
        10.50633
      ],
      [
        94.09335,
        10.51345
      ],
      [
        94.08862,
        10.52044
      ],
      [
        94.08419,
        10.52763
      ],
      [
        94.0789,
        10.53472
      ]
    ],
    "suspectVessel": {
      "name": "MT CORAL EXPLORER",
      "mmsi": "352008411",
      "matchPct": 97.8,
      "distanceM": 452.5
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00159.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00159_mask.png",
    "sha256": "0b2ee1d5bf9a7fdb"
  },
  {
    "id": "SAMPLE-07",
    "filename": "class_1_00491.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 96.8,
    "modelAccuracyPct": 97.3,
    "areaKm2": 0.3937,
    "slickPixels": 3937,
    "coveragePct": 6.02,
    "aspectRatio": 7.19,
    "dampingDb": 5.33,
    "bonnVolumeMt": "16.73 \u2013 167.32 MT",
    "region": "Arabian Sea / Mumbai High",
    "slickLat": 18.98945,
    "slickLon": 72.45603,
    "originLat": 19.07384,
    "originLon": 72.3954,
    "dispersionRadiusM": 346.3,
    "hindcastTrail": [
      [
        72.45621,
        18.98951
      ],
      [
        72.45107,
        18.99643
      ],
      [
        72.44611,
        19.00318
      ],
      [
        72.44108,
        19.01045
      ],
      [
        72.43574,
        19.01731
      ],
      [
        72.43038,
        19.02445
      ],
      [
        72.42581,
        19.03161
      ],
      [
        72.42078,
        19.03853
      ],
      [
        72.41558,
        19.04556
      ],
      [
        72.41025,
        19.05259
      ],
      [
        72.40532,
        19.05978
      ],
      [
        72.40031,
        19.06663
      ],
      [
        72.3954,
        19.07384
      ]
    ],
    "suspectVessel": {
      "name": "MT PACIFIC TRADER",
      "mmsi": "419001284",
      "matchPct": 97.8,
      "distanceM": 481.0
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00491.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00491_mask.png",
    "sha256": "7d35d577c35271e9"
  },
  {
    "id": "SAMPLE-08",
    "filename": "class_1_00460.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 90.9,
    "modelAccuracyPct": 91.9,
    "areaKm2": 0.3918,
    "slickPixels": 3918,
    "coveragePct": 5.99,
    "aspectRatio": 5.33,
    "dampingDb": 5.23,
    "bonnVolumeMt": "16.65 \u2013 166.51 MT",
    "region": "Gulf of Kutch Corridor",
    "slickLat": 22.63453,
    "slickLon": 69.17629,
    "originLat": 22.71871,
    "originLon": 69.11422,
    "dispersionRadiusM": 345.9,
    "hindcastTrail": [
      [
        69.17637,
        22.63416
      ],
      [
        69.17109,
        22.6419
      ],
      [
        69.1656,
        22.64868
      ],
      [
        69.16061,
        22.6559
      ],
      [
        69.15545,
        22.66248
      ],
      [
        69.15073,
        22.66988
      ],
      [
        69.14511,
        22.67624
      ],
      [
        69.13963,
        22.68375
      ],
      [
        69.13491,
        22.69039
      ],
      [
        69.1299,
        22.6978
      ],
      [
        69.12432,
        22.70468
      ],
      [
        69.11929,
        22.71161
      ],
      [
        69.11422,
        22.71871
      ]
    ],
    "suspectVessel": {
      "name": "MV ARABIAN SPIRIT",
      "mmsi": "538009142",
      "matchPct": 97.8,
      "distanceM": 509.5
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00460.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00460_mask.png",
    "sha256": "0d7430c5197e83f1"
  },
  {
    "id": "SAMPLE-09",
    "filename": "class_1_00492.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 95.2,
    "modelAccuracyPct": 95.8,
    "areaKm2": 0.6457,
    "slickPixels": 6457,
    "coveragePct": 9.87,
    "aspectRatio": 5.93,
    "dampingDb": 5.2,
    "bonnVolumeMt": "27.44 \u2013 274.42 MT",
    "region": "Malacca Strait Lane",
    "slickLat": 2.42033,
    "slickLon": 101.62168,
    "originLat": 2.50459,
    "originLon": 101.56421,
    "dispersionRadiusM": 346.7,
    "hindcastTrail": [
      [
        101.62226,
        2.42034
      ],
      [
        101.61729,
        2.42711
      ],
      [
        101.61223,
        2.43458
      ],
      [
        101.60693,
        2.44134
      ],
      [
        101.60266,
        2.4489
      ],
      [
        101.59766,
        2.4556
      ],
      [
        101.59282,
        2.46264
      ],
      [
        101.58865,
        2.46976
      ],
      [
        101.58305,
        2.47623
      ],
      [
        101.57827,
        2.4834
      ],
      [
        101.57349,
        2.49094
      ],
      [
        101.56904,
        2.49801
      ],
      [
        101.56421,
        2.50459
      ]
    ],
    "suspectVessel": {
      "name": "MT GULF HORIZON",
      "mmsi": "477812309",
      "matchPct": 97.8,
      "distanceM": 538.0
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00492.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00492_mask.png",
    "sha256": "d0cb9e75df17041d"
  },
  {
    "id": "SAMPLE-10",
    "filename": "class_1_00475.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 92.8,
    "modelAccuracyPct": 93.2,
    "areaKm2": 0.6174,
    "slickPixels": 6174,
    "coveragePct": 9.42,
    "aspectRatio": 5.97,
    "dampingDb": 5.09,
    "bonnVolumeMt": "26.24 \u2013 262.39 MT",
    "region": "Strait of Hormuz Approach",
    "slickLat": 26.20378,
    "slickLon": 56.44979,
    "originLat": 26.28792,
    "originLon": 56.38569,
    "dispersionRadiusM": 322.7,
    "hindcastTrail": [
      [
        56.44997,
        26.204
      ],
      [
        56.44446,
        26.21055
      ],
      [
        56.43929,
        26.21789
      ],
      [
        56.43373,
        26.22482
      ],
      [
        56.4284,
        26.23191
      ],
      [
        56.42317,
        26.23869
      ],
      [
        56.4178,
        26.24576
      ],
      [
        56.41218,
        26.25289
      ],
      [
        56.40732,
        26.25999
      ],
      [
        56.40187,
        26.26722
      ],
      [
        56.39658,
        26.27398
      ],
      [
        56.39109,
        26.28126
      ],
      [
        56.38569,
        26.28792
      ]
    ],
    "suspectVessel": {
      "name": "MT BENGAL CARRIER",
      "mmsi": "419820115",
      "matchPct": 97.8,
      "distanceM": 566.5
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00475.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00475_mask.png",
    "sha256": "075d0a4eb1221561"
  },
  {
    "id": "SAMPLE-11",
    "filename": "class_1_00999.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 96.9,
    "modelAccuracyPct": 98.1,
    "areaKm2": 0.6227,
    "slickPixels": 6227,
    "coveragePct": 9.49,
    "aspectRatio": 5.32,
    "dampingDb": 4.9,
    "bonnVolumeMt": "26.46 \u2013 264.65 MT",
    "region": "Bay of Bengal Shipping Lane",
    "slickLat": 14.82219,
    "slickLon": 82.91907,
    "originLat": 14.90636,
    "originLon": 82.85964,
    "dispersionRadiusM": 326.1,
    "hindcastTrail": [
      [
        82.91912,
        14.82222
      ],
      [
        82.91437,
        14.8292
      ],
      [
        82.9089,
        14.83622
      ],
      [
        82.90432,
        14.84348
      ],
      [
        82.89965,
        14.84999
      ],
      [
        82.8942,
        14.85725
      ],
      [
        82.88955,
        14.86426
      ],
      [
        82.88429,
        14.87127
      ],
      [
        82.87922,
        14.87821
      ],
      [
        82.87459,
        14.88533
      ],
      [
        82.86928,
        14.89202
      ],
      [
        82.86487,
        14.89965
      ],
      [
        82.85964,
        14.90636
      ]
    ],
    "suspectVessel": {
      "name": "MT KUTCH MARINER",
      "mmsi": "563918402",
      "matchPct": 97.8,
      "distanceM": 595.0
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00999.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00999_mask.png",
    "sha256": "b77e5e0b64971602"
  },
  {
    "id": "SAMPLE-12",
    "filename": "class_1_00128.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 94.6,
    "modelAccuracyPct": 94.7,
    "areaKm2": 0.2323,
    "slickPixels": 2323,
    "coveragePct": 3.53,
    "aspectRatio": 8.41,
    "dampingDb": 4.84,
    "bonnVolumeMt": "9.87 \u2013 98.73 MT",
    "region": "Andaman Sea Basin",
    "slickLat": 10.45647,
    "slickLon": 94.13854,
    "originLat": 10.54087,
    "originLon": 94.07994,
    "dispersionRadiusM": 270.2,
    "hindcastTrail": [
      [
        94.13848,
        10.4563
      ],
      [
        94.1337,
        10.46336
      ],
      [
        94.12884,
        10.47099
      ],
      [
        94.12403,
        10.47768
      ],
      [
        94.11891,
        10.48436
      ],
      [
        94.11436,
        10.49137
      ],
      [
        94.10915,
        10.49866
      ],
      [
        94.10438,
        10.50572
      ],
      [
        94.09942,
        10.51279
      ],
      [
        94.09428,
        10.51945
      ],
      [
        94.0896,
        10.52668
      ],
      [
        94.0847,
        10.53386
      ],
      [
        94.07994,
        10.54087
      ]
    ],
    "suspectVessel": {
      "name": "MT CORAL EXPLORER",
      "mmsi": "352008411",
      "matchPct": 97.8,
      "distanceM": 623.5
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00128.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00128_mask.png",
    "sha256": "09f9285691fcc0d6"
  },
  {
    "id": "SAMPLE-13",
    "filename": "class_1_00518.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 91.3,
    "modelAccuracyPct": 92.3,
    "areaKm2": 0.5646,
    "slickPixels": 5646,
    "coveragePct": 8.62,
    "aspectRatio": 4.87,
    "dampingDb": 4.74,
    "bonnVolumeMt": "24.0 \u2013 239.96 MT",
    "region": "Arabian Sea / Mumbai High",
    "slickLat": 18.97834,
    "slickLon": 72.45979,
    "originLat": 19.06244,
    "originLon": 72.39928,
    "dispersionRadiusM": 298.2,
    "hindcastTrail": [
      [
        72.45951,
        18.97853
      ],
      [
        72.45461,
        18.9854
      ],
      [
        72.44947,
        18.99281
      ],
      [
        72.4444,
        18.99943
      ],
      [
        72.43948,
        19.00684
      ],
      [
        72.43455,
        19.01323
      ],
      [
        72.42934,
        19.02028
      ],
      [
        72.42417,
        19.02744
      ],
      [
        72.419,
        19.03463
      ],
      [
        72.41386,
        19.04152
      ],
      [
        72.40934,
        19.04862
      ],
      [
        72.4045,
        19.05558
      ],
      [
        72.39928,
        19.06244
      ]
    ],
    "suspectVessel": {
      "name": "MT PACIFIC TRADER",
      "mmsi": "419001284",
      "matchPct": 97.8,
      "distanceM": 652.0
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00518.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00518_mask.png",
    "sha256": "39cc6aa23ee334b2"
  },
  {
    "id": "SAMPLE-14",
    "filename": "class_1_00182.jpg",
    "trueClass": "Oil Spill",
    "isSpill": true,
    "prediction": "CONFIRMED HYDROCARBON SPILL",
    "action": "DISPATCH INTERCEPTION",
    "confidencePct": 95.5,
    "modelAccuracyPct": 96.4,
    "areaKm2": 0.2253,
    "slickPixels": 2253,
    "coveragePct": 3.45,
    "aspectRatio": 3.07,
    "dampingDb": 4.7,
    "bonnVolumeMt": "9.58 \u2013 95.75 MT",
    "region": "Gulf of Kutch Corridor",
    "slickLat": 22.64956,
    "slickLon": 69.19362,
    "originLat": 22.73416,
    "originLon": 69.13119,
    "dispersionRadiusM": 298.9,
    "hindcastTrail": [
      [
        69.19396,
        22.64966
      ],
      [
        69.18842,
        22.65614
      ],
      [
        69.18346,
        22.66408
      ],
      [
        69.17859,
        22.67071
      ],
      [
        69.17274,
        22.67781
      ],
      [
        69.16726,
        22.68455
      ],
      [
        69.16264,
        22.69176
      ],
      [
        69.1574,
        22.69839
      ],
      [
        69.15172,
        22.70576
      ],
      [
        69.14715,
        22.71265
      ],
      [
        69.14151,
        22.71981
      ],
      [
        69.13685,
        22.72677
      ],
      [
        69.13119,
        22.73416
      ]
    ],
    "suspectVessel": {
      "name": "MV ARABIAN SPIRIT",
      "mmsi": "538009142",
      "matchPct": 97.8,
      "distanceM": 680.5
    },
    "inputImage": "/pipeline_samples/inputs/class_1_00182.png",
    "outputImage": "/pipeline_samples/outputs/class_1_00182_mask.png",
    "sha256": "fb1018f45e984cfb"
  },
  {
    "id": "SAMPLE-15",
    "filename": "class_0_00001.jpg",
    "trueClass": "Non-Oil Spill",
    "isSpill": false,
    "prediction": "LOOK-ALIKE SUPPRESSED",
    "action": "SUPPRESS ALERT (LOW-WIND ZONE)",
    "confidencePct": 93.1,
    "modelAccuracyPct": 94.9,
    "areaKm2": 1.3857,
    "slickPixels": 13857,
    "coveragePct": 21.14,
    "aspectRatio": 1.47,
    "dampingDb": 2.71,
    "bonnVolumeMt": "0.00 MT",
    "region": "Bay of Bengal Shipping Lane",
    "slickLat": 14.821,
    "slickLon": 82.91,
    "originLat": null,
    "originLon": null,
    "dispersionRadiusM": null,
    "hindcastTrail": [],
    "suspectVessel": null,
    "inputImage": "/pipeline_samples/inputs/class_0_00001.png",
    "outputImage": "/pipeline_samples/outputs/class_0_00001_mask.png",
    "sha256": "b94ffa062f8f6d92"
  },
  {
    "id": "SAMPLE-16",
    "filename": "class_0_00003.jpg",
    "trueClass": "Non-Oil Spill",
    "isSpill": false,
    "prediction": "CLEAN WATER (NEGATIVE)",
    "action": "NO SLICK DETECTED",
    "confidencePct": 94.8,
    "modelAccuracyPct": 95.6,
    "areaKm2": 0.0,
    "slickPixels": 0,
    "coveragePct": 0.0,
    "aspectRatio": 0.0,
    "dampingDb": 0.0,
    "bonnVolumeMt": "0.00 MT",
    "region": "Andaman Sea Basin",
    "slickLat": 10.452,
    "slickLon": 94.128,
    "originLat": null,
    "originLon": null,
    "dispersionRadiusM": null,
    "hindcastTrail": [],
    "suspectVessel": null,
    "inputImage": "/pipeline_samples/inputs/class_0_00003.png",
    "outputImage": "/pipeline_samples/outputs/class_0_00003_mask.png",
    "sha256": "dcdad53964adfa39"
  }
];
