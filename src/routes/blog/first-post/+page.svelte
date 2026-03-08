<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Header from '../../components/Header.svelte';
  import Math from '../../components/Math.svelte';
  import { firstPost } from '$lib/blog/posts';

  const publishedOn = new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${firstPost.date}T00:00:00`));
</script>

<Header />

<section class="post-page">
  <div class="post-header" in:fly={{ y: 20, duration: 320 }}>
    <a class="post-back" href="/blog">← Back to blog</a>
    <p class="post-kicker">{firstPost.section}</p>
    <h1>{firstPost.title}</h1>
    <p class="post-dek">{firstPost.description}</p>
    <div class="post-meta" aria-label="Article metadata">
      <span>{publishedOn}</span>
      <span>{firstPost.readTime}</span>
      <span>Personal site</span>
    </div>
  </div>

  <article class="post-shell" in:fade={{ duration: 260 }}>
    <div class="post-rail">
      <span>Filed under</span>
      <strong>blog/{firstPost.slug}</strong>
    </div>
    <div class="post-content">
      <p>
        This is an example of a blog post with some mathematical expressions. We
        can write inline math like <Math
          latex={`x_n \\gets x_{n-1} - \\nabla f(x_{n-1})`}
        /> or display equations like this:
      </p>
      <Math
        latex={`\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}`}
        displayMode={true}
      />
      <p>
        When I have some more interesting stuff to share, I'll put it here. Stay
        tuned!
      </p>
    </div>
  </article>
</section>

<style lang="scss">
  .post-page {
    padding: 108px 2rem 3.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .post-header {
    width: 100%;
    max-width: 880px;
    text-align: center;
    margin-bottom: 1.6rem;
  }

  .post-back {
    font-family: 'Work Sans';
    text-decoration: none;
    color: var(--card-href-color);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 1.35rem;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;

    &:hover {
      transform: translateX(-2px);
      opacity: 0.9;
    }
  }

  .post-kicker {
    font-family: 'Fira Code', monospace;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    opacity: 0.68;
    margin: 0 0 0.8rem;
  }

  .post-header h1 {
    font-family: 'Noto Serif', serif;
    font-size: clamp(2.4rem, 5vw, 4.4rem);
    font-weight: 400;
    line-height: 1.02;
    letter-spacing: -0.045em;
    margin: 0;
  }

  .post-dek {
    font-family: 'Work Sans';
    font-size: 1.08rem;
    line-height: 1.72;
    max-width: 40rem;
    margin: 1rem auto 0;
    opacity: 0.8;
  }

  .post-meta {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-top: 1.15rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;

    span {
      padding: 0.38rem 0.6rem;
      border-radius: 999px;
      background-color: color-mix(in srgb, var(--text-color) 12%, transparent);
    }
  }

  .post-shell {
    width: 100%;
    max-width: 880px;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--background-color) 10%, transparent),
        transparent 24%
      ),
      var(--post-background-color);
    color: var(--post-text-color);
    border: 1px solid
      color-mix(in srgb, var(--card-border-color) 16%, transparent);
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.14);
  }

  .post-rail {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.4rem;
    border-bottom: 1px solid
      color-mix(in srgb, var(--card-border-color) 12%, transparent);
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.72;
  }

  .post-content {
    font-family: 'Work Sans';
    font-size: 1.08rem;
    line-height: 1.82;
    max-width: 43rem;
    margin: 0 auto;
    padding: 2rem 1.5rem 2.4rem;

    p {
      margin: 0 0 1.3rem;
    }

    p:first-child::first-letter {
      float: left;
      font-family: 'Noto Serif', serif;
      font-size: 4.2rem;
      line-height: 0.88;
      padding-right: 0.45rem;
      padding-top: 0.16rem;
    }
  }

  .post-content :global(.katex-display) {
    margin: 1.8rem 0;
    padding: 1rem 1.2rem;
    border-radius: 18px;
    background-color: color-mix(
      in srgb,
      var(--background-color) 8%,
      transparent
    );
    overflow-x: auto;
  }

  @media screen and (max-width: 900px) {
    .post-page {
      padding: 90px 1.5rem 2.5rem;
    }
  }

  @media screen and (max-width: 600px) {
    .post-page {
      padding: 80px 1.25rem 2rem;
    }

    .post-shell {
      border-radius: 22px;
    }

    .post-rail {
      flex-direction: column;
      align-items: flex-start;
      padding: 0.9rem 1.1rem;
    }

    .post-content {
      font-size: 1rem;
      padding: 1.35rem 1.1rem 1.7rem;
    }

    .post-content p:first-child::first-letter {
      font-size: 3.2rem;
      padding-right: 0.35rem;
    }
  }
</style>
