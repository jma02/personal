<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Header from '../components/Header.svelte';
  import { blogPosts } from '$lib/blog/posts';

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('en', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(`${date}T00:00:00`));

  const [featuredPost, ...archivePosts] = blogPosts;
</script>

<Header />

<section class="blog-page">
  <div class="blog-hero" in:fly={{ y: 24, duration: 360 }}>
    <h1>Blog</h1>
    <p class="blog-intro">
      Posts about things I'm learning, building, or thinking about.
    </p>
  </div>

  <div class="blog-ledger" in:fade={{ duration: 260 }}>
    <div class="ledger-bar">
      <span>page/{String(blogPosts.length).padStart(2, '0')}</span>
      <span
        >{blogPosts.length === 1
          ? '1 blog post'
          : `${blogPosts.length} blog posts`}</span
      >
    </div>

    {#if featuredPost}
      <a
        href="/blog/{featuredPost.slug}"
        class="feature-post"
        in:fly={{ y: 30, duration: 380, delay: 70 }}
      >
        <div class="feature-meta">
          <span>{featuredPost.section}</span>
          <span>{formatDate(featuredPost.date)}</span>
        </div>
        <div class="feature-body">
          <div>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.description}</p>
          </div>
          <div class="feature-trailing">
            <span>{featuredPost.readTime}</span>
            <span class="feature-cta">Read article</span>
          </div>
        </div>
      </a>
    {/if}

    {#if archivePosts.length > 0}
      <div class="archive-list">
        {#each archivePosts as post, index}
          <a
            href="/blog/{post.slug}"
            class="archive-row"
            in:fly={{ y: 22, duration: 320, delay: 120 + index * 50 }}
          >
            <span class="archive-index"
              >{String(index + 2).padStart(2, '0')}</span
            >
            <div class="archive-copy">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
            <div class="archive-meta">
              <span>{formatDate(post.date)}</span>
              <span>{post.readTime}</span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  .blog-page {
    padding: 108px 2rem 3.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .blog-hero {
    text-align: center;
    margin-bottom: 2.2rem;
    max-width: 46rem;

    h1 {
      font-family: 'Noto Serif', serif;
      font-size: clamp(2.9rem, 6vw, 4.75rem);
      font-weight: 400;
      letter-spacing: -0.04em;
      margin: 0;
    }
  }

  .blog-intro {
    font-family: 'Work Sans';
    font-size: 1.04rem;
    line-height: 1.7;
    opacity: 0.8;
    margin: 1rem 0 0;
  }

  .blog-ledger {
    width: 100%;
    max-width: 980px;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--background-color) 8%, transparent),
        transparent 30%
      ),
      var(--post-card-background-color);
    color: var(--post-card-text-color);
    border: 1px solid
      color-mix(in srgb, var(--card-border-color) 16%, transparent);
    border-radius: 28px;
    padding: 1.15rem;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.14);
    backdrop-filter: blur(8px);
  }

  .ledger-bar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.95rem 1rem 1.15rem;
    border-bottom: 1px solid
      color-mix(in srgb, var(--card-border-color) 12%, transparent);
    font-family: 'Fira Code', monospace;
    font-size: 0.74rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  .feature-post,
  .archive-row {
    color: inherit;
    text-decoration: none;
  }

  .feature-post {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    padding: 1.5rem 1rem 1.2rem;
    border-bottom: 1px solid
      color-mix(in srgb, var(--card-border-color) 10%, transparent);
    transition:
      transform 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      color: var(--card-href-color);
      background-color: color-mix(
        in srgb,
        var(--background-color) 10%,
        transparent
      );
    }

    &:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--card-href-color) 65%, white);
      outline-offset: 4px;
    }
  }

  .feature-meta,
  .archive-meta,
  .feature-trailing {
    font-family: 'Fira Code', monospace;
    font-size: 0.76rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .feature-meta {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    opacity: 0.68;
  }

  .feature-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1.5rem;
    align-items: end;

    h2 {
      font-family: 'Noto Serif', serif;
      font-size: clamp(2rem, 3.2vw, 3rem);
      line-height: 1.04;
      letter-spacing: -0.035em;
      margin: 0;
    }

    p {
      font-family: 'Work Sans';
      font-size: 1.02rem;
      line-height: 1.7;
      margin: 0.9rem 0 0;
      max-width: 40rem;
      opacity: 0.82;
    }
  }

  .feature-trailing {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.6rem;
    white-space: nowrap;
    opacity: 0.72;
  }

  .feature-cta {
    opacity: 1;
  }

  .archive-list {
    display: flex;
    flex-direction: column;
  }

  .archive-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 1rem;
    align-items: start;
    padding: 1rem;
    transition:
      transform 0.2s ease,
      color 0.2s ease,
      background-color 0.2s ease;

    &:not(:last-child) {
      border-bottom: 1px solid
        color-mix(in srgb, var(--card-border-color) 10%, transparent);
    }

    &:hover {
      transform: translateX(2px);
      color: var(--card-href-color);
      background-color: color-mix(
        in srgb,
        var(--background-color) 9%,
        transparent
      );
    }

    &:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--card-href-color) 65%, white);
      outline-offset: 4px;
    }
  }

  .archive-index {
    font-family: 'Fira Code', monospace;
    font-size: 0.78rem;
    opacity: 0.5;
    padding-top: 0.3rem;
  }

  .archive-copy {
    h3 {
      font-family: 'Noto Serif', serif;
      font-size: 1.42rem;
      font-weight: 500;
      margin: 0;
    }

    p {
      font-family: 'Work Sans';
      font-size: 0.98rem;
      line-height: 1.65;
      margin: 0.5rem 0 0;
      opacity: 0.78;
    }
  }

  .archive-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.55rem;
    opacity: 0.66;
    padding-top: 0.25rem;
  }

  @media screen and (max-width: 900px) {
    .blog-page {
      padding: 90px 1.5rem 2.5rem;
    }

    .feature-body,
    .archive-row {
      grid-template-columns: 1fr;
    }

    .feature-trailing,
    .archive-meta {
      align-items: flex-start;
    }
  }

  @media screen and (max-width: 600px) {
    .blog-page {
      padding: 80px 1.25rem 2rem;
    }

    .blog-ledger {
      border-radius: 22px;
      padding: 0.85rem;
    }

    .ledger-bar,
    .feature-meta {
      flex-direction: column;
      align-items: flex-start;
    }

    .feature-post,
    .archive-row {
      padding-left: 0.85rem;
      padding-right: 0.85rem;
    }
  }
</style>
