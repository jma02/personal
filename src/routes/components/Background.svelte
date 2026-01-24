<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let container: HTMLDivElement | null = null;

  const createWavePoints = (index: number, count: number) => {
    const points = [] as THREE.Vector3[];
    const startX = -10;
    const endX = 10;
    const span = endX - startX;
    const yOffset = (index - 2.5) * 1.2;
    const zOffset = (index % 2) * -0.6;

    for (let i = 0; i < count; i += 1) {
      const t = i / (count - 1);
      const x = startX + t * span;
      points.push(new THREE.Vector3(x, yOffset, zOffset));
    }

    return points;
  };

  onMount(() => {
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const coreColor = new THREE.Color(0x1b2f6b);
    const haloColor = new THREE.Color(0x0b183b);

    const lines = [] as Array<{
      basePoints: THREE.Vector3[];
      curve: THREE.CatmullRomCurve3;
      core: THREE.Mesh;
      halo: THREE.Mesh;
      phase: number;
    }>;

    for (let i = 0; i < 6; i += 1) {
      const basePoints = createWavePoints(i, 80);
      const curve = new THREE.CatmullRomCurve3(basePoints);
      const coreGeometry = new THREE.TubeGeometry(curve, 120, 0.045, 10, false);
      const haloGeometry = new THREE.TubeGeometry(curve, 120, 0.16, 12, false);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: coreColor,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: haloColor,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      scene.add(halo);
      scene.add(core);
      lines.push({
        basePoints,
        curve,
        core,
        halo,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let parallaxTarget = 0;
    let parallaxOffset = 0;
    let parallaxStrength = 0.08;

    const handleScroll = () => {
      parallaxTarget = window.scrollY * parallaxStrength;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      parallaxStrength = window.matchMedia('(max-width: 768px)').matches
        ? 0.18
        : 0.08;
    };

    handleResize();
    handleScroll();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    let animationFrame = 0;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTime) / 1000;

      lines.forEach((line, index) => {
        line.basePoints.forEach((point, i) => {
          const wave =
            Math.sin(i * 0.35 + elapsed * 0.03 + line.phase + index) * 0.25;
          const ripple =
            Math.cos(i * 0.18 + elapsed * 0.015 + line.phase) * 0.12;
          point.y = (index - 2.5) * 1.2 + wave + ripple;
          point.z =
            (index % 2) * -0.6 + Math.sin(elapsed * 0.01 + i * 0.15) * 0.08;
        });

        line.curve.points = line.basePoints;
        const coreGeometry = new THREE.TubeGeometry(
          line.curve,
          120,
          0.045,
          10,
          false
        );
        const haloGeometry = new THREE.TubeGeometry(
          line.curve,
          120,
          0.16,
          12,
          false
        );
        line.core.geometry.dispose();
        line.halo.geometry.dispose();
        line.core.geometry = coreGeometry;
        line.halo.geometry = haloGeometry;
      });

      if (container) {
        parallaxOffset += (parallaxTarget - parallaxOffset) * 0.08;
        container.style.transform = `translate3d(0, ${-parallaxOffset}px, 0)`;
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(animationFrame);
      lines.forEach((line) => {
        line.core.geometry.dispose();
        line.halo.geometry.dispose();
        if (Array.isArray(line.core.material)) {
          line.core.material.forEach((material: THREE.Material) =>
            material.dispose()
          );
        } else {
          line.core.material.dispose();
        }
        if (Array.isArray(line.halo.material)) {
          line.halo.material.forEach((material: THREE.Material) =>
            material.dispose()
          );
        } else {
          line.halo.material.dispose();
        }
        line.core.removeFromParent();
        line.halo.removeFromParent();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  });
</script>

<div class="background-glow" bind:this={container}></div>

<style lang="scss">
  .background-glow {
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0.9;
    will-change: transform;
  }

  :global(body:not(.dark)) .background-glow {
    mix-blend-mode: multiply;
    opacity: 0.6;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  @media screen and (max-width: 768px) {
    .background-glow {
      opacity: 0.5;
    }
  }
</style>
