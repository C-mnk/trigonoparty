/**
 * Get elements.
 */
const content = document.querySelector(".content");
const canvas = document.querySelector("canvas");

/**
 * Resize handler.
 */
const resize = window.onresize = () => {
  canvas.width = content.clientWidth;
  canvas.height = content.clientHeight;
};

/**
 * Consts
 */
const tPI = 2 * Math.PI; 
const COLORS = {
  gray: '#CCC',
  green: '#00B52A',
  purple: '#8700b5',
  orange: '#f48c42',
  pink: '#f4427a',
  blue: '#4286f4',
  cyan: '#41cdf4',
};

/**
 * Helper utils.
 */
const degToRad = deg => deg / 360 * tPI;

/**
 * Prepare canvas context.
 */
const ctx = canvas.getContext("2d", { alpha: false });
ctx.imageSmoothingQuality = "high"
ctx.imageSmoothingEnabled = true;

/**
 * Drawing helpers.
 */
const $drawText = (text, { x, y, color, size }) => {
  ctx.font = `${size}px sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

const $drawLine = (fromX, fromY, toX, toY, { color }) => {
  ctx.beginPath();
  ctx.lineWidth = 1.5; // Default for now.
  ctx.strokeStyle = color;
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
};

const $drawCircle = (x, y, r, { color, fill }) => {
  ctx.beginPath();
  ctx.lineWidth = 1.5; // Default for now.
  ctx.strokeStyle = color;
  ctx.arc(x, y, r, 0, tPI);
  fill ? ctx.fill() : ctx.stroke();
};

/**
 * FPS Calculate.
 */
const calculateFPS = () => {
  const now = performance.now();

  if (now - lastFPSUpdateTime >= 1000) {
    lastFPSUpdateTime = now;
    FPS = (1000 / (now - lastDrawTime)).toFixed(0);
  }
  
  lastDrawTime = now;

  $drawText(`FPS: ${FPS || '-'}`, {
    x: 5,
    y: 17,
    color: COLORS.gray,
    size: 14,
  });
};

/**
 * State
 */
let degree = 45;

/**
 * FPS Measurement.
 */
let FPS = 0,
    lastDrawTime = performance.now(),
    lastFPSUpdateTime = lastDrawTime;

/**
 * Draw scene.
 */
const draw = () => {
  // Constants
  const w = canvas.width;
  const h = canvas.height;

  // Calculate core values.
  const x = w / 2;
  const y = h / 2;
  const r = Math.min(w, h) / 3;

  // Options.
  const step = 0.5;

  // State values.
  const sin = -Math.sin(degToRad(degree));
  const cos = Math.cos(degToRad(degree));
  const lineX = x + cos * r;
  const lineY = y + sin * r;
  const sinHeight = y - lineY;
  const cosWidth = lineX - x;

  // Findout the quadrant we are in.
  const quadrant = { '01': 1, '00': 2, '10': 3, '11': 4 }[`${+(sin>0)}${+(cos>0)}`];

  // Calculate complementary degree of main angle.
  const coDegree = (quadrant % 2) ? (90 - (degree % 90)) : (degree % 90);

  // Calculate tangent and cotangent distances.
  const tanOfCoDegree = Math.tan(degToRad(coDegree));
  const tanDistance = sinHeight / tanOfCoDegree;
  const cotDistance = cosWidth / (1 / tanOfCoDegree);
  
  // Calculate tangent and cotangent start/end positions.
  const tanX = (quadrant % 2) ? (lineX + tanDistance) : (lineX - tanDistance);
  const cotY = (quadrant % 2) ? (lineY - cotDistance) : (lineY + cotDistance);

  // Clear canvas.
  ctx.clearRect(0, 0, w, h);
  
  // Draw X Axis
  $drawLine(0, y, w, y, { color: COLORS.gray });
  // Draw Y Axis
  $drawLine(x, 0, x, h, { color: COLORS.gray });
  // Draw Radius Line
  $drawLine(x, y, lineX, lineY, { color: COLORS.gray });

  // Draw main circle.
  $drawCircle(x, y, r, { color: COLORS.gray });
  // Draw origin point.
  $drawCircle(x, y, 5, { color: COLORS.gray, fill: true });
  // Draw origin point perimeter circle.
  $drawCircle(x, y, 20, { color: COLORS.gray });
  // Draw radius line end circle.
  $drawCircle(lineX, lineY, 5, { color: COLORS.gray, fill: true });
  // Draw radius line end perimeter circle.
  $drawCircle(lineX, lineY, 10, { color: COLORS.gray });
  
  // Draw Sinus.
  $drawLine(lineX, lineY, lineX, y, { color: COLORS.purple });
  // Draw Cosinus.
  $drawLine(lineX, lineY, x, lineY, { color: COLORS.green });
  // Draw Tangent.
  $drawLine(tanX, y, lineX, lineY, { color: COLORS.orange });
  // Draw Cotangent.
  $drawLine(lineX, lineY, x, cotY, { color: COLORS.pink });
  // Draw Secant.
  $drawLine(tanX, y, x, y, { color: COLORS.blue });
  // Draw Cosecant.
  $drawLine(x, cotY, x, y, { color: COLORS.cyan });
  
  // Calculate FPS.
  calculateFPS();

  // Increase degre.
  degree += step;

  // Reset at the end of circle.
  if (degree === 360) {
    degree = 0;
  }

  // Animate!
  window.requestAnimationFrame(draw);
};

/**
 * Kick start!
 */
resize();
draw();