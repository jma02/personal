<script lang="ts">
  export let title = 'Jonathan Ma';
</script>

<section class="landing">
  <div class="hero-copy">
    <h1>{title}</h1>
    <p class="dek">
      Inverse problems, machine learning (generative models, distillation, and
      one-shot inference), learning theory, and MCMC.
    </p>
    <nav class="hero-links" aria-label="Primary">
      <a href="/notes">Notes</a>
      <span>/</span>
      <a href="/blog">Blog</a>
    </nav>
  </div>
</section>

<style lang="scss">
  .landing {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0 2rem;
    box-sizing: border-box;
  }

  .hero-copy {
    width: min(760px, 100%);
    padding: 0;
    color: var(--post-card-text-color);

    h1 {
      margin: 0;
      font-family: 'Noto Serif', serif;
      font-size: clamp(2.7rem, 6vw, 4rem);
      line-height: 1;
      letter-spacing: -0.04em;
      font-weight: 400;
    }
  }

  .dek {
    margin: 0;
    font-family: 'Work Sans';
    margin-top: 0.85rem;
    font-size: clamp(1rem, 1.3vw, 1.08rem);
    line-height: 1.7;
    max-width: 36rem;
    color: var(--post-card-text-color);
    opacity: 0.84;
  }

  .hero-links {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-top: 0.9rem;
    font-family: 'Work Sans';
    font-size: 0.92rem;

    span {
      opacity: 0.38;
    }

    a {
      color: inherit;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      padding-bottom: 0.12rem;
      transition:
        border-color 0.18s ease,
        color 0.18s ease;

      &:hover {
        border-bottom-color: color-mix(in srgb, currentColor 42%, transparent);
      }

      &:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--card-href-color) 60%, white);
        outline-offset: 4px;
      }
    }
  }

  @media screen and (max-width: 900px) {
    .landing {
      padding: 0 1.5rem;
    }
  }

  @media screen and (max-width: 640px) {
    .landing {
      padding: 0 1.25rem;
    }
  }
</style>
