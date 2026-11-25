import * as THREE from "three";
import { WORLD_COASTLINES } from "../../assets/worldCoastlinesData";

export interface IncidentHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: "critical" | "elevated" | "watch";
  spillTonnage: string;
  suspect: string;
  confidence: number;
  region: string;
  description: string;
}

export const GLOBAL_INCIDENTS: IncidentHotspot[] = [
  {
    id: "INC-2601",
    name: "Mumbai High Bilge Discharge",
    lat: 18.9822,
    lng: 72.4510,
    severity: "critical",
    spillTonnage: "3.3 - 33.0 MT",
    suspect: "MT PACIFIC TRADER (Panama)",
    confidence: 95,
    region: "Offshore Mumbai / Arabian Sea Corridor",
    description: "Active crude slick detected by Sentinel-1 SAR. 6h Lagrangian backward hindcast intersects vessel AIS track with ±295.6m dispersion.",
  },
  {
    id: "INC-2602",
    name: "Malacca Strait Tanker Slick",
    lat: 2.4510,
    lng: 101.8840,
    severity: "critical",
    spillTonnage: "2.8 - 28.2 MT",
    suspect: "PACIFIC EXPLORER (Singapore)",
    confidence: 91,
    region: "Southeast Asia / Malacca Choke Point",
    description: "Lagrangian trajectory matches vessel corridor track at T-5.2h within ±420m.",
  },
  {
    id: "INC-2603",
    name: "Gulf of Kutch Refinery Channel",
    lat: 22.5210,
    lng: 69.1840,
    severity: "elevated",
    spillTonnage: "4.2 - 42.0 MT",
    suspect: "OCEAN VOYAGER (Marshall Islands)",
    confidence: 88,
    region: "Gujarat Coast / Jamnagar Terminal",
    description: "Offshore bunkering discharge flagged. Bayesian attribution score: 88.4%.",
  },
  {
    id: "INC-2604",
    name: "Strait of Hormuz Bunkering Leak",
    lat: 26.4820,
    lng: 56.3810,
    severity: "critical",
    spillTonnage: "5.5 - 55.0 MT",
    suspect: "STARLIGHT CARRIER (Liberia)",
    confidence: 83,
    region: "Persian Gulf / Hormuz Corridor",
    description: "Nighttime transponder deactivation detected along inbound shipping lane.",
  },
];

export const SUPPRESSED_HOTSPOTS: IncidentHotspot[] = [
  {
    id: "LOOK-01",
    name: "Bengal Bay Algal Bloom",
    lat: 19.4500,
    lng: 85.8000,
    severity: "watch",
    spillTonnage: "0 MT (Suppressed)",
    suspect: "Natural Phenomenon (No Vessel)",
    confidence: 0,
    region: "Bay of Bengal / Coast of Odisha",
    description: "FALSE ALARM REJECTED: Calm sea zone covering 26.6% of frame. Aspect ratio 1.57 < 1.60.",
  },
  {
    id: "LOOK-02",
    name: "Lakshadweep Low-Wind Shadow",
    lat: 9.2000,
    lng: 72.8500,
    severity: "watch",
    spillTonnage: "0 MT (Suppressed)",
    suspect: "Low-Wind Calm Sea (No Vessel)",
    confidence: 0,
    region: "Lakshadweep Sea / Minicoy Channel",
    description: "FALSE ALARM REJECTED: Wind shadow covering 15.4% of frame. Aspect ratio 1.34 < 1.60.",
  },
];

export interface VesselRoute {
  from: { lat: number; lng: number; name: string };
  to: { lat: number; lng: number; name: string };
  color: string;
}

export const VESSEL_ROUTES: VesselRoute[] = [
  {
    from: { lat: 19.0342, lng: 72.4100, name: "INC-2601 Spill Origin Corridor (T-6h)" },
    to: { lat: 18.9822, lng: 72.4510, name: "Mumbai High Bilge Discharge (Observed Centroid)" },
    color: "#f16456",
  },
  {
    from: { lat: 2.5030, lng: 101.8430, name: "INC-2602 Spill Origin Corridor (T-6h)" },
    to: { lat: 2.4510, lng: 101.8840, name: "Malacca Strait Tanker Slick (Observed Centroid)" },
    color: "#f16456",
  },
  {
    from: { lat: 22.5730, lng: 69.1430, name: "INC-2603 Spill Origin Corridor (T-6h)" },
    to: { lat: 22.5210, lng: 69.1840, name: "Gulf of Kutch Refinery Channel (Observed Centroid)" },
    color: "#e8b23d",
  },
  {
    from: { lat: 26.5340, lng: 56.3400, name: "INC-2604 Spill Origin Corridor (T-6h)" },
    to: { lat: 26.4820, lng: 56.3810, name: "Strait of Hormuz Bunkering Leak (Observed Centroid)" },
    color: "#f16456",
  },
];

export interface GeographicLabel {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "ocean" | "strait" | "incident";
  color?: string;
}

export const GEOGRAPHIC_MAP_LABELS: GeographicLabel[] = [
  // Major Oceans & Basins (Large, graceful, atmospheric)
  { id: "geo-io", name: "INDIAN OCEAN", lat: -16.0, lng: 76.0, type: "ocean" },
  { id: "geo-as", name: "ARABIAN SEA", lat: 14.0, lng: 64.0, type: "ocean" },
  { id: "geo-bob", name: "BAY OF BENGAL", lat: 13.5, lng: 88.0, type: "ocean" },
  { id: "geo-pg", name: "PERSIAN GULF", lat: 26.5, lng: 51.5, type: "ocean" },
  { id: "geo-rs", name: "RED SEA", lat: 20.5, lng: 38.0, type: "ocean" },
  { id: "geo-scs", name: "SOUTH CHINA SEA", lat: 12.0, lng: 113.5, type: "ocean" },
  { id: "geo-med", name: "MEDITERRANEAN", lat: 35.0, lng: 18.0, type: "ocean" },
  { id: "geo-atl", name: "NORTH ATLANTIC", lat: 32.0, lng: -40.0, type: "ocean" },

  // Key Strategic Choke Points & Passages
  { id: "geo-malacca", name: "STRAIT OF MALACCA", lat: 3.2, lng: 101.4, type: "strait" },
  { id: "geo-hormuz", name: "STRAIT OF HORMUZ", lat: 26.9, lng: 56.5, type: "strait" },
  { id: "geo-mandeb", name: "BAB-EL-MANDEB", lat: 12.6, lng: 43.3, type: "strait" },
  { id: "geo-suez", name: "SUEZ CANAL", lat: 30.2, lng: 32.5, type: "strait" },
  { id: "geo-gib", name: "GIBRALTAR STRAIT", lat: 35.95, lng: -5.6, type: "strait" },
  { id: "geo-cape", name: "CAPE OF GOOD HOPE", lat: -34.4, lng: 18.5, type: "strait" },
  { id: "geo-sunda", name: "SUNDA STRAIT", lat: -6.0, lng: 105.8, type: "strait" },
];

/**
 * Creates an ultra-crisp, high-DPI text billboard sprite for Three.js.
 * Utilizes 4x supersampling and bespoke typographic styling for oceans and tactical callouts.
 */
export function createMapLabelSprite(
  text: string,
  type: "ocean" | "strait" | "incident",
  customColor?: string
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Sprite();

  const isOcean = type === "ocean";
  const isIncident = type === "incident";

  // 4x Supersampling for razor-sharp Retina/4K rendering
  const DPR = 4;

  if (isOcean) {
    // Elegant spaced cartographic water typography (like luxury navigation charts)
    const spacedText = text.split("").join(" ");
    const fontSize = 15 * DPR;
    const fontStr = `300 ${fontSize}px "Inter", "Geist", system-ui, -apple-system, sans-serif`;

    ctx.font = fontStr;
    const metrics = ctx.measureText(spacedText);
    const textWidth = Math.ceil(metrics.width);
    const textHeight = Math.ceil(fontSize * 1.4);

    const padX = 24 * DPR;
    const padY = 12 * DPR;

    canvas.width = textWidth + padX * 2;
    canvas.height = textHeight + padY * 2;

    ctx.font = fontStr;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Soft atmospheric ocean glow - NO clunky background box
    ctx.shadowColor = "rgba(0, 240, 255, 0.45)";
    ctx.shadowBlur = 9 * DPR;
    ctx.fillStyle = "rgba(105, 220, 248, 0.65)";
    ctx.fillText(spacedText, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      opacity: 0.85,
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    const aspect = canvas.width / canvas.height;
    const baseHeight = 0.095;
    sprite.scale.set(baseHeight * aspect, baseHeight, 1);
    return sprite;
  }

  // Tactical Capsule Badges (for Strategic Straits & Active Incidents)
  const isLookalike = customColor === "#35d6c4";
  const fontSize = (isIncident ? 12 : 10.5) * DPR;
  const fontStr = `600 ${fontSize}px "Geist Mono", "SF Mono", monospace`;

  ctx.font = fontStr;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(fontSize * 1.5);

  const dotRadius = (isIncident ? 3.2 : 2.4) * DPR;
  const dotGap = 6 * DPR;
  const padX = 12 * DPR;
  const padY = 6 * DPR;

  const totalContentWidth = dotRadius * 2 + dotGap + textWidth;
  canvas.width = totalContentWidth + padX * 2;
  canvas.height = textHeight + padY * 2;

  ctx.font = fontStr;
  ctx.textBaseline = "middle";

  const pillRadius = canvas.height / 2;

  // Background glass capsule with subtle dark tint
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(1.5 * DPR, 1.5 * DPR, canvas.width - 3 * DPR, canvas.height - 3 * DPR, pillRadius);
  } else {
    ctx.rect(1.5 * DPR, 1.5 * DPR, canvas.width - 3 * DPR, canvas.height - 3 * DPR);
  }

  if (isIncident) {
    ctx.fillStyle = isLookalike ? "rgba(1, 24, 18, 0.88)" : "rgba(30, 4, 7, 0.90)";
  } else {
    ctx.fillStyle = "rgba(2, 9, 18, 0.82)";
  }
  ctx.fill();

  // Sleek hairline border
  ctx.lineWidth = 1 * DPR;
  const strokeColor = isIncident
    ? isLookalike
      ? "rgba(0, 240, 255, 0.65)"
      : "rgba(241, 100, 86, 0.75)"
    : "rgba(0, 240, 255, 0.40)";
  ctx.strokeStyle = strokeColor;
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = 4 * DPR;
  ctx.stroke();

  // Glowing status beacon dot
  const dotX = padX + dotRadius;
  const dotY = canvas.height / 2;
  ctx.beginPath();
  ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  const dotColor = isIncident
    ? isLookalike
      ? "#00f0ff"
      : "#ff4d4d"
    : "#00f0ff";
  ctx.fillStyle = dotColor;
  ctx.shadowColor = dotColor;
  ctx.shadowBlur = 5 * DPR;
  ctx.fill();

  // Crisp text label
  ctx.shadowBlur = 0;
  ctx.fillStyle = isIncident ? "#ffffff" : "#d8f5fc";
  ctx.fillText(text, dotX + dotRadius + dotGap, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    opacity: 0.95,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  const aspect = canvas.width / canvas.height;
  const baseHeight = isIncident ? 0.058 : 0.046;
  sprite.scale.set(baseHeight * aspect, baseHeight, 1);
  return sprite;
}

/**
 * Converts Geographic (lat, lng) in degrees to 3D Cartesian coordinates (x, y, z) on a sphere of radius R.
 */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Generates an elevated 3D great circle arc between two lat/lng coordinates.
 */
export function createCurvedArc(
  startVec: THREE.Vector3,
  endVec: THREE.Vector3,
  altitude: number = 0.25,
  segments: number = 50
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
  const dist = startVec.distanceTo(endVec);
  const midLength = mid.length();

  mid.normalize().multiplyScalar(midLength + dist * altitude);

  const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
  for (let i = 0; i <= segments; i++) {
    points.push(curve.getPoint(i / segments));
  }
  return points;
}

/**
 * Generates an ultra-deep obsidian & oceanic void texture for the underlying globe sphere.
 */
export function generateTacticalEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Deep oceanic void background
  ctx.fillStyle = "#010408";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#01050a");
  grad.addColorStop(0.5, "#020a14");
  grad.addColorStop(1, "#01050a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Builds high-precision 3D vector LineSegments from real Natural Earth coastline data.
 * Rendered directly by the GPU as vector lines — NEVER PIXELATES at any zoom level.
 */
export function createWorldCoastlineGeometry(radius: number): THREE.BufferGeometry {
  const positions: number[] = [];

  for (let l = 0; l < WORLD_COASTLINES.length; l++) {
    const line = WORLD_COASTLINES[l];
    for (let i = 0; i < line.length - 1; i++) {
      const [lng1, lat1] = line[i];
      const [lng2, lat2] = line[i + 1];

      const p1 = latLngToVector3(lat1, lng1, radius);
      const p2 = latLngToVector3(lat2, lng2, radius);

      positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

/**
 * Creates true 3D vector nautical graticule (parallels and meridians).
 */
export function createVectorGraticule(radius: number): THREE.Group {
  const group = new THREE.Group();

  // Parallels (Latitude circles)
  for (let lat = -80; lat <= 80; lat += 20) {
    const pts: THREE.Vector3[] = [];
    const segments = 72;
    for (let s = 0; s <= segments; s++) {
      const lng = (s / segments) * 360 - 180;
      pts.push(latLngToVector3(lat, lng, radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const isEquator = lat === 0;
    const mat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: isEquator ? 0.35 : 0.09,
      linewidth: 1,
    });
    group.add(new THREE.Line(geo, mat));
  }

  // Meridians (Longitude lines)
  for (let lng = -180; lng < 180; lng += 30) {
    const pts: THREE.Vector3[] = [];
    const segments = 48;
    for (let s = 0; s <= segments; s++) {
      const lat = (s / segments) * 160 - 80;
      pts.push(latLngToVector3(lat, lng, radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const isPrime = lng === 0;
    const mat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: isPrime ? 0.3 : 0.09,
      linewidth: 1,
    });
    group.add(new THREE.Line(geo, mat));
  }

  return group;
}

/**
 * Generates an ethereal, semi-transparent cloud / atmospheric weather swirl texture.
 */
export function generateAtmosphereCloudsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Soft atmospheric cloud wisps
  for (let i = 0; i < 45; i++) {
    const cx = Math.random() * canvas.width;
    const cy = 60 + Math.random() * (canvas.height - 120);
    const radius = 35 + Math.random() * 85;

    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, radius);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    grad.addColorStop(0.4, "rgba(0, 240, 255, 0.08)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 1.8, radius * 0.65, Math.random() * 0.5 - 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

