<script lang="ts">
  import { onMount } from 'svelte';
  import {
    FluidBackgroundRenderer,
    type FluidBackgroundPalette,
  } from '$lib/flow/fluid-gpu';

  let container: HTMLDivElement | null = null;

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

  onMount(() => {
    if (!container) {
      return;
    }

    let renderer: FluidBackgroundRenderer | null = null;
    let animationFrame = 0;
    let previousTime = performance.now();
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let parallaxTarget = 0;
    let parallaxOffset = 0;
    let parallaxStrength = 0.035;

    const updateCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      parallaxStrength = Math.min(width, height) < 700 ? 0.06 : 0.035;
      renderer?.resize(width, height, pixelRatio);
    };

    const handleScroll = () => {
      parallaxTarget = window.scrollY * parallaxStrength;
    };

    const animate = (time: number) => {
      if (!renderer) {
        return;
      }

      const dt = Math.min((time - previousTime) / 1000, 0.033);
      previousTime = time;

      renderer.step(dt);
      renderer.render();

      parallaxOffset += (parallaxTarget - parallaxOffset) * 0.08;
      if (container) {
        container.style.transform = `translate3d(0, ${-parallaxOffset}px, 0)`;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    updateCanvasSize();

    try {
      renderer = new FluidBackgroundRenderer({
        palette,
        width,
        height,
        pixelRatio,
      });
      container?.appendChild(renderer.canvas);
      renderer.render();
    } catch (error) {
      console.warn(
        'GPU background renderer unavailable; using static fallback.',
        error
      );
      return;
    }

    handleScroll();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(animationFrame);
      renderer?.destroy();
    };
  });
</script>

<div class="background-field" bind:this={container}></div>

<style lang="scss">
  .background-field {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.98;
    will-change: transform;
    background:
      radial-gradient(
        circle at 48% 28%,
        rgba(255, 255, 255, 0.08),
        transparent 42%
      ),
      linear-gradient(180deg, #09101c 0%, #10203a 100%);
  }

  .background-field :global(canvas) {
    width: 100%;
    height: 100%;
    display: block;
    filter: saturate(0.88) brightness(0.92);
  }

  @media screen and (max-width: 768px) {
    .background-field {
      opacity: 0.94;
    }
  }
</style>
