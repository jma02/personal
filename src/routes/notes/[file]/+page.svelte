<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Header from '../../components/Header.svelte';

  export let data: { fileName: string; content: string };

  const lines = data.content.split('\n');
  const lineCount = lines.length;
  const wordCount = data.content.trim()
    ? data.content.trim().split(/\s+/).length
    : 0;
  const characterCount = data.content.length;
</script>

<Header />

<section class="note-container">
  <div class="note-header" in:fly={{ y: 18, duration: 280 }}>
    <a class="note-back" href="/notes">← Back to notes</a>
    <div class="note-intro">
      <p class="note-kicker">Text note</p>
      <h1 class="note-title">{data.fileName}</h1>
      <div class="note-meta" aria-label="Note statistics">
        <span>{lineCount} lines</span>
        <span>{wordCount} words</span>
        <span>{characterCount} chars</span>
      </div>
    </div>
  </div>

  <div class="note-card" in:fade={{ duration: 260 }}>
    <div class="note-card-bar">
      <span class="note-path">notes/{data.fileName}</span>
    </div>
    <pre class="note-content">{data.content}</pre>
  </div>
</section>

<style lang="scss">
  .note-container {
    padding: 108px 2rem 3.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .note-header {
    width: 100%;
    max-width: 860px;
    margin-bottom: 1.4rem;
  }

  .note-back {
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

  .note-intro {
    color: var(--text-color);
  }

  .note-kicker {
    font-family: 'Fira Code', monospace;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    opacity: 0.68;
    margin: 0 0 0.8rem;
  }

  .note-title {
    font-family: 'Noto Serif', serif;
    font-size: clamp(1.95rem, 4.2vw, 3.1rem);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.04em;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .note-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1rem;
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

  .note-card {
    width: 100%;
    max-width: 860px;
    background-color: var(--post-background-color);
    color: var(--post-text-color);
    border: 1px solid
      color-mix(in srgb, var(--card-border-color) 16%, transparent);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.14);
  }

  .note-card-bar {
    padding: 1rem 1.4rem;
    border-bottom: 1px solid
      color-mix(in srgb, var(--card-border-color) 12%, transparent);
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--background-color) 10%, transparent),
      transparent
    );
  }

  .note-path {
    font-family: 'Fira Code', monospace;
    font-size: 0.8rem;
    opacity: 0.68;
  }

  .note-content {
    font-family: 'Fira Code', monospace;
    font-size: 0.96rem;
    white-space: pre-wrap;
    line-height: 1.72;
    margin: 0;
    padding: 1.6rem 1.4rem 1.9rem;
    overflow-x: auto;
  }

  @media screen and (max-width: 900px) {
    .note-container {
      padding: 90px 1.5rem 2.5rem;
    }
  }

  @media screen and (max-width: 600px) {
    .note-container {
      padding: 80px 1.25rem 2rem;
    }

    .note-card {
      border-radius: 20px;
    }

    .note-card-bar {
      padding: 0.9rem 1.1rem;
    }

    .note-content {
      padding: 1.25rem 1.1rem 1.5rem;
    }
  }
</style>
