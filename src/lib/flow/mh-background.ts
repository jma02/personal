export type MhBackgroundPalette = {
  contourLow: string;
  contourMid: string;
  contourHigh: string;
  line: string;
  path: string;
  point: string;
};

type MhBackgroundOptions = {
  palette: MhBackgroundPalette;
  width: number;
  height: number;
  pixelRatio: number;
};

type GaussianComponent = {
  weight: number;
  meanX: number;
  meanY: number;
  a: number;
  b: number;
  c: number;
  normalizer: number;
};

type WalkerPoint = {
  x: number;
  y: number;
};

const WORLD_Y_RADIUS = 3.15;
const CYCLE_WARMUP_STEPS = 240;
const PROPOSALS_PER_SECOND = 500;
const TRAIL_RECORD_INTERVAL = 1;
const TRAIL_LIMIT = 320;
const DISPLAY_FOLLOW_SPEED = 10;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const smoothstep = (edge0: number, edge1: number, value: number) => {
  if (edge0 === edge1) {
    return value >= edge1 ? 1 : 0;
  }

  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const gaussianNoise = () => {
  let u = 0;
  let v = 0;

  while (u === 0) {
    u = Math.random();
  }
  while (v === 0) {
    v = Math.random();
  }

  return Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * v);
};

export class MhBackgroundRenderer {
  readonly canvas: HTMLCanvasElement;

  private readonly context: CanvasRenderingContext2D;
  private readonly contourCanvas: HTMLCanvasElement;
  private readonly contourContext: CanvasRenderingContext2D;
  private readonly trail: WalkerPoint[] = [];

  private width = 0;
  private height = 0;
  private pixelRatio = 1;
  private xRadius = WORLD_Y_RADIUS;
  private components: GaussianComponent[] = [];
  private currentX = 0;
  private currentY = 0;
  private currentDensity = 0;
  private displayX = 0;
  private displayY = 0;
  private proposalScale = 0.22;
  private proposalAccumulator = 0;
  private recordCounter = 0;
  private levels: number[] = [];
  private palette: MhBackgroundPalette;

  constructor({ palette, width, height, pixelRatio }: MhBackgroundOptions) {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.context = this.canvas.getContext('2d', { alpha: true })!;
    this.contourCanvas = document.createElement('canvas');
    this.contourContext = this.contourCanvas.getContext('2d', { alpha: true })!;
    this.context.imageSmoothingEnabled = true;
    this.contourContext.imageSmoothingEnabled = true;
    this.palette = palette;

    this.resize(width, height, pixelRatio);
    this.reset();
  }

  resize(width: number, height: number, pixelRatio: number) {
    this.width = width;
    this.height = height;
    this.pixelRatio = pixelRatio;
    this.xRadius = WORLD_Y_RADIUS * (width / Math.max(height, 1));

    this.canvas.width = Math.max(1, Math.round(width * pixelRatio));
    this.canvas.height = Math.max(1, Math.round(height * pixelRatio));
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    const contourWidth = Math.max(640, Math.round(width * 0.7));
    const contourHeight = Math.max(420, Math.round(height * 0.7));
    this.contourCanvas.width = contourWidth;
    this.contourCanvas.height = contourHeight;

    if (this.components.length > 0) {
      this.rebuildContours();
    }
  }

  setPalette(palette: MhBackgroundPalette) {
    this.palette = palette;
    this.rebuildContours();
  }

  reset() {
    this.components = this.createComponents();
    const anchor =
      this.components[Math.floor(Math.random() * this.components.length)];
    this.currentX = anchor.meanX + gaussianNoise() * 0.08;
    this.currentY = anchor.meanY + gaussianNoise() * 0.08;
    this.currentDensity = this.densityAt(this.currentX, this.currentY);
    this.displayX = this.currentX;
    this.displayY = this.currentY;
    this.proposalScale = randomBetween(0.14, 0.24);
    this.proposalAccumulator = 0;
    this.recordCounter = 0;
    this.trail.length = 0;
    this.pushPoint(this.currentX, this.currentY);
    this.rebuildContours();

    for (let step = 0; step < CYCLE_WARMUP_STEPS; step += 1) {
      this.metropolisStep();
    }

    this.render();
  }

  step(dt: number) {
    this.proposalAccumulator += dt * PROPOSALS_PER_SECOND;
    const proposals = Math.floor(this.proposalAccumulator);
    this.proposalAccumulator -= proposals;

    for (let step = 0; step < proposals; step += 1) {
      this.metropolisStep();
    }

    const follow = 1 - Math.exp(-dt * DISPLAY_FOLLOW_SPEED);
    this.displayX = this.wrap(
      this.displayX +
        this.shortestDelta(this.displayX, this.currentX, this.xRadius * 2) *
          follow,
      -this.xRadius,
      this.xRadius
    );
    this.displayY = this.wrap(
      this.displayY +
        this.shortestDelta(this.displayY, this.currentY, WORLD_Y_RADIUS * 2) *
          follow,
      -WORLD_Y_RADIUS,
      WORLD_Y_RADIUS
    );
  }

  render() {
    const context = this.context;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.filter = 'blur(0.7px)';
    context.imageSmoothingEnabled = true;
    context.drawImage(
      this.contourCanvas,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    context.filter = 'none';
    context.fillStyle = 'rgba(4, 5, 8, 0.4)';
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.trail.length < 2) {
      return;
    }

    context.lineCap = 'round';
    context.lineJoin = 'round';

    for (let index = 1; index < this.trail.length; index += 1) {
      const alpha = index / this.trail.length;
      const previous = this.trail[index - 1];
      const current = this.trail[index];
      const previousScreen = this.toScreen(previous.x, previous.y);
      const currentScreen = this.toScreen(current.x, current.y);

      context.strokeStyle = this.withAlpha(
        this.palette.path,
        0.03 + alpha * 0.38
      );
      context.lineWidth = this.pixelRatio * (0.45 + alpha * 1.15);
      context.beginPath();
      context.moveTo(previousScreen.x, previousScreen.y);
      context.lineTo(currentScreen.x, currentScreen.y);
      context.stroke();
    }
  }

  destroy() {
    this.canvas.remove();
    this.contourCanvas.remove();
  }

  private metropolisStep() {
    const proposalX = this.currentX + gaussianNoise() * this.proposalScale;
    const proposalY = this.currentY + gaussianNoise() * this.proposalScale;
    const wrappedX = this.wrap(proposalX, -this.xRadius, this.xRadius);
    const wrappedY = this.wrap(proposalY, -WORLD_Y_RADIUS, WORLD_Y_RADIUS);
    const proposalDensity = this.densityAt(wrappedX, wrappedY);

    if (
      proposalDensity >= this.currentDensity ||
      Math.random() < proposalDensity / Math.max(this.currentDensity, 1e-12)
    ) {
      this.currentX = wrappedX;
      this.currentY = wrappedY;
      this.currentDensity = proposalDensity;
    }

    this.recordCounter += 1;
    if (this.recordCounter >= TRAIL_RECORD_INTERVAL) {
      this.recordCounter = 0;
      this.pushPoint(this.currentX, this.currentY);
    }
  }

  private pushPoint(x: number, y: number) {
    this.trail.push({ x, y });
    if (this.trail.length > TRAIL_LIMIT) {
      this.trail.shift();
    }
  }

  private densityAt(x: number, y: number) {
    let density = 0;

    for (const component of this.components) {
      const dx = x - component.meanX;
      const dy = y - component.meanY;
      const exponent =
        -0.5 *
        (component.a * dx * dx +
          2 * component.b * dx * dy +
          component.c * dy * dy);
      density += component.weight * component.normalizer * Math.exp(exponent);
    }

    return density;
  }

  private createComponents() {
    const count = 2 + Math.floor(Math.random() * 3);
    const weights = Array.from({ length: count }, () => Math.random() + 0.4);
    const totalWeight = weights.reduce((sum, value) => sum + value, 0);

    return weights.map((weight) => {
      const meanX = randomBetween(-this.xRadius * 0.58, this.xRadius * 0.58);
      const meanY = randomBetween(
        -WORLD_Y_RADIUS * 0.62,
        WORLD_Y_RADIUS * 0.62
      );
      const sigmaX = randomBetween(0.35, 0.75);
      const sigmaY = randomBetween(0.25, 0.68);
      const angle = randomBetween(-Math.PI, Math.PI);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const invSigmaX = 1 / (sigmaX * sigmaX);
      const invSigmaY = 1 / (sigmaY * sigmaY);

      return {
        weight: weight / totalWeight,
        meanX,
        meanY,
        a: cos * cos * invSigmaX + sin * sin * invSigmaY,
        b: cos * sin * (invSigmaX - invSigmaY),
        c: sin * sin * invSigmaX + cos * cos * invSigmaY,
        normalizer: 1 / (2 * Math.PI * sigmaX * sigmaY),
      };
    });
  }

  private rebuildContours() {
    const width = this.contourCanvas.width;
    const height = this.contourCanvas.height;
    const context = this.contourContext;
    const image = context.createImageData(width, height);
    const values = new Float32Array(width * height);
    let maxDensity = 0;

    for (let y = 0; y < height; y += 1) {
      const worldY = this.screenYToWorld(y / Math.max(height - 1, 1));

      for (let x = 0; x < width; x += 1) {
        const worldX = this.screenXToWorld(x / Math.max(width - 1, 1));
        const density = this.densityAt(worldX, worldY);
        values[x + y * width] = density;
        if (density > maxDensity) {
          maxDensity = density;
        }
      }
    }

    this.levels = [0.05, 0.11, 0.19, 0.32, 0.48, 0.68].map(
      (scale) => maxDensity * scale
    );

    const low = this.toRgb(this.palette.contourLow);
    const mid = this.toRgb(this.palette.contourMid);
    const high = this.toRgb(this.palette.contourHigh);
    const line = this.toRgb(this.palette.line);
    const firstLevel = this.levels[0] ?? maxDensity * 0.05;
    const lastLevel = this.levels[this.levels.length - 1] ?? maxDensity;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const density = values[x + y * width];
        const base = (x + y * width) * 4;

        if (density < firstLevel) {
          image.data[base + 3] = 0;
          continue;
        }

        const blend = smoothstep(firstLevel, lastLevel, density);
        const color =
          blend < 0.55
            ? this.mixRgb(low, mid, blend / 0.55)
            : this.mixRgb(mid, high, (blend - 0.55) / 0.45);
        const alpha = Math.round(18 + blend * 68);

        image.data[base] = color.r;
        image.data[base + 1] = color.g;
        image.data[base + 2] = color.b;
        image.data[base + 3] = alpha;
      }
    }

    context.clearRect(0, 0, width, height);
    context.putImageData(image, 0, 0);

    context.save();
    context.lineWidth = 1.05;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = `rgba(${line.r}, ${line.g}, ${line.b}, 0.42)`;

    for (const level of this.levels) {
      context.beginPath();
      this.traceContourLevel(context, values, width, height, level);
      context.stroke();
    }

    context.restore();
  }

  private traceContourLevel(
    context: CanvasRenderingContext2D,
    values: Float32Array,
    width: number,
    height: number,
    level: number
  ) {
    for (let y = 0; y < height - 1; y += 1) {
      for (let x = 0; x < width - 1; x += 1) {
        const topLeft = values[x + y * width];
        const topRight = values[x + 1 + y * width];
        const bottomRight = values[x + 1 + (y + 1) * width];
        const bottomLeft = values[x + (y + 1) * width];

        const points: Array<{ x: number; y: number }> = [];

        const top = this.getContourPoint(
          x,
          y,
          x + 1,
          y,
          topLeft,
          topRight,
          level
        );
        if (top) {
          points.push(top);
        }

        const right = this.getContourPoint(
          x + 1,
          y,
          x + 1,
          y + 1,
          topRight,
          bottomRight,
          level
        );
        if (right) {
          points.push(right);
        }

        const bottom = this.getContourPoint(
          x + 1,
          y + 1,
          x,
          y + 1,
          bottomRight,
          bottomLeft,
          level
        );
        if (bottom) {
          points.push(bottom);
        }

        const left = this.getContourPoint(
          x,
          y + 1,
          x,
          y,
          bottomLeft,
          topLeft,
          level
        );
        if (left) {
          points.push(left);
        }

        if (points.length === 2) {
          context.moveTo(points[0].x, points[0].y);
          context.lineTo(points[1].x, points[1].y);
        } else if (points.length === 4) {
          context.moveTo(points[0].x, points[0].y);
          context.lineTo(points[1].x, points[1].y);
          context.moveTo(points[2].x, points[2].y);
          context.lineTo(points[3].x, points[3].y);
        }
      }
    }
  }

  private getContourPoint(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    value0: number,
    value1: number,
    level: number
  ) {
    const crosses =
      (value0 < level && value1 >= level) ||
      (value1 < level && value0 >= level);

    if (!crosses || value0 === value1) {
      return null;
    }

    const t = clamp((level - value0) / (value1 - value0), 0, 1);
    return {
      x: lerp(x0, x1, t),
      y: lerp(y0, y1, t),
    };
  }

  private mixRgb(
    a: { r: number; g: number; b: number },
    b: { r: number; g: number; b: number },
    t: number
  ) {
    return {
      r: Math.round(a.r + (b.r - a.r) * clamp(t, 0, 1)),
      g: Math.round(a.g + (b.g - a.g) * clamp(t, 0, 1)),
      b: Math.round(a.b + (b.b - a.b) * clamp(t, 0, 1)),
    };
  }

  private toRgb(value: string) {
    const hex = value.replace('#', '');
    const normalized =
      hex.length === 3
        ? hex
            .split('')
            .map((part) => `${part}${part}`)
            .join('')
        : hex;

    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    };
  }

  private withAlpha(hex: string, alpha: number) {
    const { r, g, b } = this.toRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
  }

  private toScreen(x: number, y: number) {
    return {
      x: ((x + this.xRadius) / (2 * this.xRadius)) * this.canvas.width,
      y: ((WORLD_Y_RADIUS - y) / (2 * WORLD_Y_RADIUS)) * this.canvas.height,
    };
  }

  private screenXToWorld(t: number) {
    return -this.xRadius + t * this.xRadius * 2;
  }

  private screenYToWorld(t: number) {
    return WORLD_Y_RADIUS - t * WORLD_Y_RADIUS * 2;
  }

  private wrap(value: number, min: number, max: number) {
    const span = max - min;
    let wrapped = value;

    while (wrapped < min) {
      wrapped += span;
    }
    while (wrapped > max) {
      wrapped -= span;
    }

    return wrapped;
  }

  private shortestDelta(from: number, to: number, span: number) {
    let delta = to - from;

    if (delta > span / 2) {
      delta -= span;
    } else if (delta < -span / 2) {
      delta += span;
    }

    return delta;
  }
}
