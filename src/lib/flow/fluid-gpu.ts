import {
  Color,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';

export type FluidBackgroundPalette = {
  clear: string;
  surface: string;
  glow: string;
  vignette: string;
  inkA: string;
  inkB: string;
  inkC: string;
  fieldAlpha: number;
};

type FluidRendererOptions = {
  palette: FluidBackgroundPalette;
  width: number;
  height: number;
  pixelRatio: number;
};

type DoubleTarget = {
  read: WebGLRenderTarget;
  write: WebGLRenderTarget;
  swap: () => void;
  dispose: () => void;
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const splatShader = `
  uniform sampler2D target;
  uniform vec2 point;
  uniform vec3 color;
  uniform float radius;
  uniform float aspect;
  varying vec2 vUv;

  void main() {
    vec2 delta = abs(vUv - point);
    delta = min(delta, 1.0 - delta);
    delta.x *= aspect;
    float influence = exp(-dot(delta, delta) / radius);
    vec4 base = texture2D(target, vUv);
    gl_FragColor = vec4(base.rgb + color * influence, 1.0);
  }
`;

const advectionShader = `
  uniform sampler2D velocity;
  uniform sampler2D source;
  uniform float dt;
  uniform float dissipation;
  varying vec2 vUv;

  vec4 samplePeriodic(sampler2D field, vec2 uv) {
    return texture2D(field, fract(uv));
  }

  void main() {
    vec2 flow = samplePeriodic(velocity, vUv).xy;
    vec2 coord = fract(vUv - dt * flow);
    gl_FragColor = dissipation * samplePeriodic(source, coord);
  }
`;

const curlShader = `
  uniform sampler2D velocity;
  uniform vec2 texelSize;
  varying vec2 vUv;

  vec2 samplePeriodic(vec2 uv) {
    return texture2D(velocity, fract(uv)).xy;
  }

  void main() {
    float left = samplePeriodic(vUv - vec2(texelSize.x, 0.0)).y;
    float right = samplePeriodic(vUv + vec2(texelSize.x, 0.0)).y;
    float bottom = samplePeriodic(vUv - vec2(0.0, texelSize.y)).x;
    float top = samplePeriodic(vUv + vec2(0.0, texelSize.y)).x;
    float curl = right - left - top + bottom;
    gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
  }
`;

const vorticityShader = `
  uniform sampler2D velocity;
  uniform sampler2D curl;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float curlStrength;
  varying vec2 vUv;

  float sampleCurl(vec2 uv) {
    return texture2D(curl, fract(uv)).x;
  }

  vec2 sampleVelocity(vec2 uv) {
    return texture2D(velocity, fract(uv)).xy;
  }

  void main() {
    float left = abs(sampleCurl(vUv - vec2(texelSize.x, 0.0)));
    float right = abs(sampleCurl(vUv + vec2(texelSize.x, 0.0)));
    float bottom = abs(sampleCurl(vUv - vec2(0.0, texelSize.y)));
    float top = abs(sampleCurl(vUv + vec2(0.0, texelSize.y)));
    float center = sampleCurl(vUv);

    vec2 force = 0.5 * vec2(top - bottom, left - right);
    force /= length(force) + 0.0001;
    force *= curlStrength * center;

    vec2 velocityValue = sampleVelocity(vUv);
    gl_FragColor = vec4(velocityValue + force * dt, 0.0, 1.0);
  }
`;

const divergenceShader = `
  uniform sampler2D velocity;
  uniform vec2 texelSize;
  varying vec2 vUv;

  vec2 samplePeriodic(vec2 uv) {
    return texture2D(velocity, fract(uv)).xy;
  }

  void main() {
    float left = samplePeriodic(vUv - vec2(texelSize.x, 0.0)).x;
    float right = samplePeriodic(vUv + vec2(texelSize.x, 0.0)).x;
    float bottom = samplePeriodic(vUv - vec2(0.0, texelSize.y)).y;
    float top = samplePeriodic(vUv + vec2(0.0, texelSize.y)).y;
    float divergence = 0.5 * (right - left + top - bottom);
    gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
  }
`;

const pressureShader = `
  uniform sampler2D pressure;
  uniform sampler2D divergence;
  uniform vec2 texelSize;
  varying vec2 vUv;

  float samplePressure(vec2 uv) {
    return texture2D(pressure, fract(uv)).x;
  }

  float sampleDivergence(vec2 uv) {
    return texture2D(divergence, fract(uv)).x;
  }

  void main() {
    float left = samplePressure(vUv - vec2(texelSize.x, 0.0));
    float right = samplePressure(vUv + vec2(texelSize.x, 0.0));
    float bottom = samplePressure(vUv - vec2(0.0, texelSize.y));
    float top = samplePressure(vUv + vec2(0.0, texelSize.y));
    float divergenceValue = sampleDivergence(vUv);
    float pressureValue = (left + right + bottom + top - divergenceValue) * 0.25;
    gl_FragColor = vec4(pressureValue, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShader = `
  uniform sampler2D pressure;
  uniform sampler2D velocity;
  uniform vec2 texelSize;
  varying vec2 vUv;

  float samplePressure(vec2 uv) {
    return texture2D(pressure, fract(uv)).x;
  }

  vec2 sampleVelocity(vec2 uv) {
    return texture2D(velocity, fract(uv)).xy;
  }

  void main() {
    float left = samplePressure(vUv - vec2(texelSize.x, 0.0));
    float right = samplePressure(vUv + vec2(texelSize.x, 0.0));
    float bottom = samplePressure(vUv - vec2(0.0, texelSize.y));
    float top = samplePressure(vUv + vec2(0.0, texelSize.y));
    vec2 velocityValue = sampleVelocity(vUv);
    velocityValue -= 0.5 * vec2(right - left, top - bottom);
    gl_FragColor = vec4(velocityValue, 0.0, 1.0);
  }
`;

const displayShader = `
  uniform sampler2D dye;
  uniform vec3 clearColor;
  uniform vec3 surfaceColor;
  uniform vec3 glowColor;
  uniform vec3 vignetteColor;
  uniform float fieldAlpha;
  varying vec2 vUv;

  void main() {
    vec3 background = mix(clearColor, surfaceColor, clamp(vUv.y * 0.86 + vUv.x * 0.22, 0.0, 1.0));
    float glow = 1.0 - smoothstep(0.0, 0.88, distance(vUv, vec2(0.48, 0.28)));
    background += glowColor * glow * 0.22;
    float vignette = smoothstep(0.16, 0.98, distance(vUv, vec2(0.5, 0.42)));
    background = mix(background, vignetteColor, vignette * 0.72);

    vec3 dyeValue = texture2D(dye, vUv).rgb;
    float density = clamp(max(dyeValue.r, max(dyeValue.g, dyeValue.b)) * 1.8, 0.0, 1.0);
    vec3 mixed = min(background + dyeValue, vec3(1.0));
    vec3 color = mix(background, mixed, density * fieldAlpha);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const createTarget = (
  width: number,
  height: number,
  filter: typeof LinearFilter | typeof NearestFilter
) => {
  const target = new WebGLRenderTarget(width, height, {
    type: HalfFloatType,
    format: RGBAFormat,
    minFilter: filter,
    magFilter: filter,
    depthBuffer: false,
    stencilBuffer: false,
  });

  target.texture.wrapS = RepeatWrapping;
  target.texture.wrapT = RepeatWrapping;
  return target;
};

const createDoubleTarget = (
  width: number,
  height: number,
  filter: typeof LinearFilter | typeof NearestFilter
): DoubleTarget => {
  const first = createTarget(width, height, filter);
  const second = createTarget(width, height, filter);

  return {
    read: first,
    write: second,
    swap() {
      [this.read, this.write] = [this.write, this.read];
    },
    dispose() {
      first.dispose();
      second.dispose();
    },
  };
};

export class FluidBackgroundRenderer {
  readonly canvas: HTMLCanvasElement;

  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly quad = new Mesh(new PlaneGeometry(2, 2));
  private readonly simTexel = new Vector2(1, 1);
  private readonly splatPoint = new Vector2();

  private velocity!: DoubleTarget;
  private dye!: DoubleTarget;
  private pressure!: DoubleTarget;
  private divergence!: WebGLRenderTarget;
  private curl!: WebGLRenderTarget;

  private simWidth = 0;
  private simHeight = 0;
  private dyeWidth = 0;
  private dyeHeight = 0;
  private width = 0;
  private height = 0;
  private time = 0;

  private readonly splatMaterial: ShaderMaterial;
  private readonly advectionMaterial: ShaderMaterial;
  private readonly curlMaterial: ShaderMaterial;
  private readonly vorticityMaterial: ShaderMaterial;
  private readonly divergenceMaterial: ShaderMaterial;
  private readonly pressureMaterial: ShaderMaterial;
  private readonly gradientSubtractMaterial: ShaderMaterial;
  private readonly displayMaterial: ShaderMaterial;

  private readonly inkColors = [new Color(), new Color(), new Color()];

  constructor({ palette, width, height, pixelRatio }: FluidRendererOptions) {
    this.renderer = new WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.canvas = this.renderer.domElement;
    this.canvas.setAttribute('aria-hidden', 'true');

    const gl = this.renderer.getContext();
    if (
      !this.renderer.capabilities.isWebGL2 ||
      !gl.getExtension('EXT_color_buffer_float')
    ) {
      this.renderer.dispose();
      throw new Error('WebGL2 float render targets are unavailable.');
    }

    this.splatMaterial = new ShaderMaterial({
      uniforms: {
        target: { value: null },
        point: { value: this.splatPoint },
        color: { value: new Vector3() },
        radius: { value: 0.01 },
        aspect: { value: 1 },
      },
      vertexShader,
      fragmentShader: splatShader,
      depthTest: false,
      depthWrite: false,
    });

    this.advectionMaterial = new ShaderMaterial({
      uniforms: {
        velocity: { value: null },
        source: { value: null },
        dt: { value: 0 },
        dissipation: { value: 1 },
      },
      vertexShader,
      fragmentShader: advectionShader,
      depthTest: false,
      depthWrite: false,
    });

    this.curlMaterial = new ShaderMaterial({
      uniforms: {
        velocity: { value: null },
        texelSize: { value: this.simTexel },
      },
      vertexShader,
      fragmentShader: curlShader,
      depthTest: false,
      depthWrite: false,
    });

    this.vorticityMaterial = new ShaderMaterial({
      uniforms: {
        velocity: { value: null },
        curl: { value: null },
        texelSize: { value: this.simTexel },
        dt: { value: 0 },
        curlStrength: { value: 24 },
      },
      vertexShader,
      fragmentShader: vorticityShader,
      depthTest: false,
      depthWrite: false,
    });

    this.divergenceMaterial = new ShaderMaterial({
      uniforms: {
        velocity: { value: null },
        texelSize: { value: this.simTexel },
      },
      vertexShader,
      fragmentShader: divergenceShader,
      depthTest: false,
      depthWrite: false,
    });

    this.pressureMaterial = new ShaderMaterial({
      uniforms: {
        pressure: { value: null },
        divergence: { value: null },
        texelSize: { value: this.simTexel },
      },
      vertexShader,
      fragmentShader: pressureShader,
      depthTest: false,
      depthWrite: false,
    });

    this.gradientSubtractMaterial = new ShaderMaterial({
      uniforms: {
        pressure: { value: null },
        velocity: { value: null },
        texelSize: { value: this.simTexel },
      },
      vertexShader,
      fragmentShader: gradientSubtractShader,
      depthTest: false,
      depthWrite: false,
    });

    this.displayMaterial = new ShaderMaterial({
      uniforms: {
        dye: { value: null },
        clearColor: { value: new Color() },
        surfaceColor: { value: new Color() },
        glowColor: { value: new Color() },
        vignetteColor: { value: new Color() },
        fieldAlpha: { value: 0.44 },
      },
      vertexShader,
      fragmentShader: displayShader,
      depthTest: false,
      depthWrite: false,
    });

    this.scene.add(this.quad);
    this.setPalette(palette);
    this.resize(width, height, pixelRatio);
  }

  setPalette(palette: FluidBackgroundPalette) {
    this.displayMaterial.uniforms.clearColor.value = new Color(palette.clear);
    this.displayMaterial.uniforms.surfaceColor.value = new Color(
      palette.surface
    );
    this.displayMaterial.uniforms.glowColor.value = new Color(palette.glow);
    this.displayMaterial.uniforms.vignetteColor.value = new Color(
      palette.vignette
    );
    this.displayMaterial.uniforms.fieldAlpha.value = palette.fieldAlpha;

    this.inkColors[0].set(palette.inkA);
    this.inkColors[1].set(palette.inkB);
    this.inkColors[2].set(palette.inkC);
  }

  resize(width: number, height: number, pixelRatio: number) {
    this.width = width;
    this.height = height;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);

    const mobile = Math.min(width, height) < 700;
    const nextSimWidth = Math.max(
      Math.round(width / (mobile ? 3.2 : 4.1)),
      mobile ? 144 : 192
    );
    const nextSimHeight = Math.max(
      Math.round(height / (mobile ? 3.2 : 4.1)),
      mobile ? 96 : 128
    );
    const nextDyeWidth = Math.max(
      Math.round(width / (mobile ? 1.65 : 1.45)),
      mobile ? 288 : 416
    );
    const nextDyeHeight = Math.max(
      Math.round(height / (mobile ? 1.65 : 1.45)),
      mobile ? 192 : 288
    );

    if (
      nextSimWidth === this.simWidth &&
      nextSimHeight === this.simHeight &&
      nextDyeWidth === this.dyeWidth &&
      nextDyeHeight === this.dyeHeight
    ) {
      return;
    }

    this.disposeTargets();

    this.simWidth = nextSimWidth;
    this.simHeight = nextSimHeight;
    this.dyeWidth = nextDyeWidth;
    this.dyeHeight = nextDyeHeight;

    this.simTexel.set(1 / this.simWidth, 1 / this.simHeight);
    this.vorticityMaterial.uniforms.curlStrength.value = mobile ? 18 : 24;

    this.velocity = createDoubleTarget(
      this.simWidth,
      this.simHeight,
      LinearFilter
    );
    this.dye = createDoubleTarget(this.dyeWidth, this.dyeHeight, LinearFilter);
    this.pressure = createDoubleTarget(
      this.simWidth,
      this.simHeight,
      NearestFilter
    );
    this.divergence = createTarget(
      this.simWidth,
      this.simHeight,
      NearestFilter
    );
    this.curl = createTarget(this.simWidth, this.simHeight, NearestFilter);

    this.clearAllTargets();
    this.seed();
  }

  step(dt: number) {
    const stepDt = Math.min(Math.max(dt, 0.001), 0.016);
    this.time += stepDt;

    this.advect(
      this.velocity,
      this.velocity.read.texture,
      this.velocity.read.texture,
      stepDt,
      0.985
    );
    this.injectEmitters(stepDt);
    this.computeCurl();
    this.applyVorticity(stepDt);
    this.computeDivergence();
    this.clearPressure();

    for (let iteration = 0; iteration < 18; iteration += 1) {
      this.solvePressure();
    }

    this.subtractPressureGradient();
    this.advect(
      this.dye,
      this.velocity.read.texture,
      this.dye.read.texture,
      stepDt,
      0.992
    );
  }

  render() {
    this.displayMaterial.uniforms.dye.value = this.dye.read.texture;
    this.renderMaterial(this.displayMaterial, null);
  }

  destroy() {
    this.disposeTargets();
    this.quad.geometry.dispose();
    this.splatMaterial.dispose();
    this.advectionMaterial.dispose();
    this.curlMaterial.dispose();
    this.vorticityMaterial.dispose();
    this.divergenceMaterial.dispose();
    this.pressureMaterial.dispose();
    this.gradientSubtractMaterial.dispose();
    this.displayMaterial.dispose();
    this.renderer.dispose();
    this.canvas.remove();
  }

  private disposeTargets() {
    this.velocity?.dispose();
    this.dye?.dispose();
    this.pressure?.dispose();
    this.divergence?.dispose();
    this.curl?.dispose();
  }

  private clearAllTargets() {
    this.clearTarget(this.velocity.read);
    this.clearTarget(this.velocity.write);
    this.clearTarget(this.dye.read);
    this.clearTarget(this.dye.write);
    this.clearTarget(this.pressure.read);
    this.clearTarget(this.pressure.write);
    this.clearTarget(this.divergence);
    this.clearTarget(this.curl);
  }

  private clearTarget(target: WebGLRenderTarget) {
    this.renderer.setRenderTarget(target);
    this.renderer.clear();
  }

  private renderMaterial(
    material: ShaderMaterial,
    target: WebGLRenderTarget | null
  ) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  private advect(
    target: DoubleTarget,
    velocityTexture: WebGLRenderTarget['texture'],
    sourceTexture: WebGLRenderTarget['texture'],
    dt: number,
    dissipation: number
  ) {
    this.advectionMaterial.uniforms.velocity.value = velocityTexture;
    this.advectionMaterial.uniforms.source.value = sourceTexture;
    this.advectionMaterial.uniforms.dt.value = dt;
    this.advectionMaterial.uniforms.dissipation.value = dissipation;
    this.renderMaterial(this.advectionMaterial, target.write);
    target.swap();
  }

  private computeCurl() {
    this.curlMaterial.uniforms.velocity.value = this.velocity.read.texture;
    this.renderMaterial(this.curlMaterial, this.curl);
  }

  private applyVorticity(dt: number) {
    this.vorticityMaterial.uniforms.velocity.value = this.velocity.read.texture;
    this.vorticityMaterial.uniforms.curl.value = this.curl.texture;
    this.vorticityMaterial.uniforms.dt.value = dt;
    this.renderMaterial(this.vorticityMaterial, this.velocity.write);
    this.velocity.swap();
  }

  private computeDivergence() {
    this.divergenceMaterial.uniforms.velocity.value =
      this.velocity.read.texture;
    this.renderMaterial(this.divergenceMaterial, this.divergence);
  }

  private clearPressure() {
    this.clearTarget(this.pressure.read);
    this.clearTarget(this.pressure.write);
  }

  private solvePressure() {
    this.pressureMaterial.uniforms.pressure.value = this.pressure.read.texture;
    this.pressureMaterial.uniforms.divergence.value = this.divergence.texture;
    this.renderMaterial(this.pressureMaterial, this.pressure.write);
    this.pressure.swap();
  }

  private subtractPressureGradient() {
    this.gradientSubtractMaterial.uniforms.pressure.value =
      this.pressure.read.texture;
    this.gradientSubtractMaterial.uniforms.velocity.value =
      this.velocity.read.texture;
    this.renderMaterial(this.gradientSubtractMaterial, this.velocity.write);
    this.velocity.swap();
  }

  private injectEmitters(dt: number) {
    const forceRadius =
      Math.min(this.width, this.height) < 700 ? 0.012 : 0.0085;
    const dyeRadius = Math.min(this.width, this.height) < 700 ? 0.028 : 0.018;
    const forceScale = Math.min(this.width, this.height) < 700 ? 18 : 24;

    for (let index = 0; index < 4; index += 1) {
      const previous = this.emitterPosition(index, this.time - dt);
      const current = this.emitterPosition(index, this.time);
      const forceX = (current.x - previous.x) * forceScale;
      const forceY = (current.y - previous.y) * forceScale;
      const color = this.inkColors[index % this.inkColors.length];

      this.splat(
        this.velocity,
        current.x,
        current.y,
        forceX,
        forceY,
        0,
        forceRadius
      );
      this.splat(
        this.dye,
        current.x,
        current.y,
        color.r * 0.18,
        color.g * 0.18,
        color.b * 0.18,
        dyeRadius
      );
    }
  }

  private seed() {
    for (let index = 0; index < 12; index += 1) {
      const current = this.emitterPosition(index % 4, index * 0.7);
      const next = this.emitterPosition(index % 4, index * 0.7 + 0.04);
      const color = this.inkColors[index % this.inkColors.length];

      this.splat(
        this.velocity,
        current.x,
        current.y,
        (next.x - current.x) * 32,
        (next.y - current.y) * 32,
        0,
        0.012
      );
      this.splat(
        this.dye,
        current.x,
        current.y,
        color.r * 0.22,
        color.g * 0.22,
        color.b * 0.22,
        0.024
      );
    }
  }

  private splat(
    target: DoubleTarget,
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    radius: number
  ) {
    this.splatPoint.set(x, y);
    this.splatMaterial.uniforms.target.value = target.read.texture;
    (this.splatMaterial.uniforms.color.value as Vector3).set(r, g, b);
    this.splatMaterial.uniforms.radius.value = radius;
    this.splatMaterial.uniforms.aspect.value =
      this.width / Math.max(this.height, 1);
    this.renderMaterial(this.splatMaterial, target.write);
    target.swap();
  }

  private emitterPosition(index: number, time: number) {
    const phase = index * 1.57;
    const orbit = time * (0.24 + index * 0.03) + phase;

    return {
      x:
        0.5 +
        0.23 * Math.sin(orbit * 1.1 + phase * 0.7) +
        0.08 * Math.cos(orbit * 2.2 - phase * 0.45),
      y:
        0.48 +
        0.19 * Math.cos(orbit * 0.92 - phase * 0.8) +
        0.07 * Math.sin(orbit * 1.7 + phase * 0.55),
    };
  }
}
