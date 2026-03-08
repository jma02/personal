<script lang="ts">
  import { onMount } from 'svelte';
  import {
    FluidBackgroundRenderer,
    type FluidBackgroundPalette,
  } from '$lib/flow/fluid-gpu';
  import type { MhBackgroundPalette } from '$lib/flow/mh-background';

  let container: HTMLDivElement | null = null;
  let isMhActive = false;
  let isCycleLocked = false;
  let isAnimationPaused = false;
  let isBackgroundBlack = false;
  let canToggleAnimations = false;
  let showFluid = async () => {};
  let showMh = async () => {};
  let toggleCycleLock = () => {};
  let togglePause = () => {};
  let toggleBlackout = () => {};

  type BackgroundRenderer = {
    canvas: HTMLCanvasElement;
    resize: (width: number, height: number, pixelRatio: number) => void;
    step: (dt: number) => void;
    render: () => void;
    destroy: () => void;
    reset?: () => void;
  };

  const palette: FluidBackgroundPalette = {
    clear: '#08101c',
    surface: '#10203a',
    glow: '#21456f',
    vignette: '#050913',
    inkA: '#0f2441',
    inkB: '#1d4f7e',
    inkC: '#5b7694',
    fieldAlpha: 0.48,
  };

  const mhPalette: MhBackgroundPalette = {
    contourLow: '#17191d',
    contourMid: '#252b33',
    contourHigh: '#4d5966',
    line: '#6d7a87',
    path: '#c7d2db',
    point: '#f5f7f8',
  };

  const cycleDuration = 20;
  const rendererCount = 2;

  onMount(() => {
    if (!container) {
      return;
    }

    const renderers: Array<BackgroundRenderer | null> = [null, null];
    let animationFrame = 0;
    let previousTime = performance.now();
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let parallaxTarget = 0;
    let parallaxOffset = 0;
    let parallaxStrength = 0.035;
    let activeIndex = 0;
    let cycleElapsed = 0;
    let mhRendererPromise: Promise<BackgroundRenderer> | null = null;

    const syncCanvasClasses = () => {
      renderers.forEach((renderer, index) => {
        if (!renderer) {
          return;
        }

        const active = !isBackgroundBlack && index === activeIndex;
        renderer.canvas.classList.toggle('background-canvas-active', active);
        renderer.canvas.classList.toggle('background-canvas-hidden', !active);
      });

      isMhActive = !isBackgroundBlack && activeIndex === 1;
    };

    const ensureMhRenderer = async () => {
      if (renderers[1]) {
        return renderers[1];
      }

      if (!mhRendererPromise) {
        mhRendererPromise = import('$lib/flow/mh-background').then(
          ({ MhBackgroundRenderer }) => {
            const renderer = new MhBackgroundRenderer({
              palette: mhPalette,
              width,
              height,
              pixelRatio,
            });
            renderer.canvas.classList.add(
              'background-canvas',
              'background-canvas-mh',
              'background-canvas-hidden'
            );
            container?.appendChild(renderer.canvas);
            renderers[1] = renderer;
            renderer.render();
            syncCanvasClasses();
            return renderer;
          }
        );
      }

      return mhRendererPromise;
    };

    const ensureRenderer = async (index: number) => {
      if (index === 1) {
        return ensureMhRenderer();
      }

      return renderers[0];
    };

    const setActiveRenderer = (nextIndex: number) => {
      activeIndex = nextIndex;
      cycleElapsed = 0;
      isBackgroundBlack = false;
      syncCanvasClasses();
      renderers[activeIndex]?.reset?.();
      renderers[activeIndex]?.render();
    };

    const showRenderer = async (nextIndex: number) => {
      const normalizedIndex =
        ((nextIndex % rendererCount) + rendererCount) % rendererCount;
      const renderer = await ensureRenderer(normalizedIndex);

      if (!renderer) {
        return;
      }

      setActiveRenderer(normalizedIndex);
    };

    const cycleRenderer = async (direction: number) => {
      for (let offset = 1; offset <= rendererCount; offset += 1) {
        const nextIndex =
          (((activeIndex + direction * offset) % rendererCount) +
            rendererCount) %
          rendererCount;
        const renderer = await ensureRenderer(nextIndex);

        if (renderer) {
          setActiveRenderer(nextIndex);
          return;
        }
      }
    };

    showFluid = async () => {
      await cycleRenderer(-1);
    };

    showMh = async () => {
      await cycleRenderer(1);
    };

    toggleCycleLock = () => {
      isCycleLocked = !isCycleLocked;
      if (!isCycleLocked) {
        cycleElapsed = 0;
      }
    };

    togglePause = () => {
      isAnimationPaused = !isAnimationPaused;
    };

    toggleBlackout = () => {
      isBackgroundBlack = !isBackgroundBlack;
      if (!isBackgroundBlack) {
        cycleElapsed = 0;
        renderers[activeIndex]?.render();
      }
      syncCanvasClasses();
    };

    const updateCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      parallaxStrength = Math.min(width, height) < 700 ? 0.06 : 0.035;
      renderers.forEach((renderer) => {
        renderer?.resize(width, height, pixelRatio);
        renderer?.render();
      });

      canToggleAnimations = Boolean(
        renderers[0] || renderers[1] || mhRendererPromise
      );
    };

    const handleScroll = () => {
      parallaxTarget = window.scrollY * parallaxStrength;
    };

    const animate = (time: number) => {
      const dt = Math.min((time - previousTime) / 1000, 0.033);
      previousTime = time;
      cycleElapsed += dt;

      if (
        !isCycleLocked &&
        !isBackgroundBlack &&
        cycleElapsed >= cycleDuration
      ) {
        if (activeIndex === 0) {
          cycleElapsed = 0;
          void showRenderer(1);
        } else {
          void showRenderer(0);
        }
      }

      const activeRenderer = renderers[activeIndex];
      if (!activeRenderer) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      if (!isAnimationPaused && !isBackgroundBlack) {
        activeRenderer.step(dt);
        activeRenderer.render();
      }

      parallaxOffset += (parallaxTarget - parallaxOffset) * 0.08;
      if (container) {
        container.style.transform = `translate3d(0, ${-parallaxOffset}px, 0)`;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    updateCanvasSize();

    try {
      const fluidRenderer = new FluidBackgroundRenderer({
        palette,
        width,
        height,
        pixelRatio,
      });
      fluidRenderer.canvas.classList.add(
        'background-canvas',
        'background-canvas-fluid',
        'background-canvas-hidden'
      );
      renderers[0] = fluidRenderer;
    } catch (error) {
      console.warn('GPU fluid renderer unavailable.', error);
    }

    if (!renderers[0]) {
      void showRenderer(1);
    }

    if (!renderers[0] && !mhRendererPromise) {
      return;
    }

    renderers.forEach((renderer) => {
      if (renderer) {
        container?.appendChild(renderer.canvas);
      }
    });

    if (renderers[0]) {
      setActiveRenderer(0);
    }

    canToggleAnimations = Boolean(
      renderers[0] || renderers[1] || mhRendererPromise
    );

    handleScroll();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      showFluid = async () => {};
      showMh = async () => {};
      toggleCycleLock = () => {};
      togglePause = () => {};
      toggleBlackout = () => {};
      isCycleLocked = false;
      isAnimationPaused = false;
      isBackgroundBlack = false;
      canToggleAnimations = false;
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(animationFrame);
      renderers.forEach((renderer) => renderer?.destroy());
    };
  });
</script>

<div
  class="background-field"
  class:background-field-blackout={isBackgroundBlack}
  class:background-field-mh={isMhActive}
  bind:this={container}
></div>

{#if canToggleAnimations}
  <div class="background-controls">
    <button
      type="button"
      class="background-toggle"
      class:background-toggle-active={isCycleLocked}
      aria-pressed={isCycleLocked}
      title={isCycleLocked
        ? 'Unlock current animation'
        : 'Lock current animation'}
      aria-label={isCycleLocked
        ? 'Unlock current background animation'
        : 'Lock current background animation'}
      on:click={toggleCycleLock}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 10V7.75a3.5 3.5 0 1 1 7 0V10" />
        <rect x="6.5" y="10" width="11" height="9" rx="2.25" />
      </svg>
    </button>
    <button
      type="button"
      class="background-toggle"
      class:background-toggle-active={isAnimationPaused}
      aria-pressed={isAnimationPaused}
      title={isAnimationPaused ? 'Resume animation' : 'Pause animation'}
      aria-label={isAnimationPaused
        ? 'Resume background animation'
        : 'Pause background animation'}
      on:click={togglePause}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 6.75v10.5" />
        <path d="M15 6.75v10.5" />
      </svg>
    </button>
    <button
      type="button"
      class="background-toggle"
      class:background-toggle-active={isBackgroundBlack}
      class:background-toggle-blackout={isBackgroundBlack}
      aria-pressed={isBackgroundBlack}
      title={isBackgroundBlack ? 'Restore background' : 'Turn background black'}
      aria-label={isBackgroundBlack
        ? 'Restore background animation'
        : 'Turn background black'}
      on:click={toggleBlackout}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7l10 10" />
        <path d="M17 7 7 17" />
      </svg>
    </button>
    <button
      type="button"
      class="background-toggle"
      title="Previous animation"
      aria-label="Show previous background animation"
      on:click={() => void showFluid()}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.75 5.75 8.5 12l6.25 6.25" />
      </svg>
    </button>
    <button
      type="button"
      class="background-toggle"
      title="Next animation"
      aria-label="Show next background animation"
      on:click={() => void showMh()}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.25 5.75 15.5 12l-6.25 6.25" />
      </svg>
    </button>
  </div>
{/if}

<style lang="scss">
  .background-field {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.98;
    will-change: transform;
    transition: background 2.4s ease;
    background:
      radial-gradient(
        circle at 48% 28%,
        rgba(255, 255, 255, 0.08),
        transparent 42%
      ),
      linear-gradient(180deg, #09101c 0%, #10203a 100%);
  }

  .background-field.background-field-mh {
    background:
      radial-gradient(
        circle at 48% 28%,
        rgba(255, 255, 255, 0.03),
        transparent 44%
      ),
      linear-gradient(180deg, #06080c 0%, #0a0c10 100%);
  }

  .background-field.background-field-blackout {
    transition: none;
    background: #000;
  }

  .background-field.background-field-blackout :global(.background-canvas) {
    transition: none;
  }

  .background-field :global(canvas) {
    width: 100%;
    height: 100%;
    display: block;
    filter: saturate(0.88) brightness(0.92);
  }

  .background-field :global(.background-canvas-mh) {
    filter: saturate(0.4) brightness(0.58) contrast(0.92);
  }

  .background-field :global(.background-canvas) {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 2.6s ease;
  }

  .background-field :global(.background-canvas-hidden) {
    opacity: 0;
  }

  .background-field :global(.background-canvas-active) {
    opacity: 1;
  }

  .background-controls {
    position: fixed;
    right: 1.35rem;
    bottom: 1.25rem;
    z-index: 4;
    display: flex;
    gap: 0.55rem;
    pointer-events: auto;
  }

  .background-toggle {
    min-width: 3.5rem;
    height: 3.1rem;
    display: grid;
    place-items: center;
    border: 1px solid rgba(226, 232, 240, 0.16);
    border-radius: 999px;
    background: rgba(8, 11, 16, 0.72);
    color: rgba(241, 245, 249, 0.9);
    font: inherit;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      background 160ms ease,
      color 160ms ease;
  }

  .background-toggle:hover {
    transform: translateY(-1px);
    border-color: rgba(226, 232, 240, 0.3);
    background: rgba(13, 17, 24, 0.88);
    color: #f8fafc;
  }

  .background-toggle.background-toggle-active {
    border-color: rgba(226, 232, 240, 0.34);
    background: rgba(18, 23, 31, 0.92);
    color: #f8fafc;
  }

  .background-toggle.background-toggle-blackout {
    background: rgba(0, 0, 0, 0.96);
  }

  .background-toggle:focus-visible {
    outline: 2px solid rgba(226, 232, 240, 0.5);
    outline-offset: 2px;
  }

  .background-toggle svg {
    width: 1.15rem;
    height: 1.15rem;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }

  @media screen and (max-width: 768px) {
    .background-field {
      opacity: 0.94;
    }

    .background-controls {
      right: 1rem;
      bottom: 1rem;
    }

    .background-toggle {
      min-width: 3.15rem;
      height: 2.85rem;
    }
  }
</style>
