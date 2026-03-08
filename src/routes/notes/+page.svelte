<script lang="ts">
  import { fly } from 'svelte/transition';
  import Header from '../components/Header.svelte';

  type NoteEntry = {
    name: string;
    title: string;
    type: 'txt' | 'pdf';
    href: string;
  };

  export let data: { files: NoteEntry[] };

  const isPdf = (file: NoteEntry) => file.type === 'pdf';
  const fileIcon = (file: NoteEntry) =>
    isPdf(file) ? '/icons/file-pdf.svg' : '/icons/file-txt.svg';
  const textCount = data.files.filter((file) => file.type === 'txt').length;
  const pdfCount = data.files.length - textCount;
</script>

<Header />

<section class="notes-container">
  <div class="notes-header">
    <h1>Notes</h1>
    <p class="notes-subtitle">Typeset class notes and paper notes.</p>
  </div>

  <div class="notes-tree-shell">
    <div class="notes-tree-toolbar">
      <div class="tree-stats" aria-label="Note counts">
        <span>{data.files.length} total</span>
        <span>{textCount} txt</span>
        <span>{pdfCount} pdf</span>
      </div>
    </div>

    <div class="notes-tree">
      {#if data.files.length === 0}
        <div class="tree-empty">(empty)</div>
      {:else}
        {#each data.files as file, index}
          <a
            href={file.href}
            class="tree-file"
            target={isPdf(file) ? '_blank' : undefined}
            rel={isPdf(file) ? 'noopener noreferrer' : undefined}
            in:fly={{ y: 24, duration: 320, delay: index * 45 }}
          >
            <span class="tree-index">{String(index + 1).padStart(2, '0')}</span>
            <div class="tree-file-main">
              <div class="tree-file-label">
                <img
                  class="tree-icon"
                  src={fileIcon(file)}
                  alt={isPdf(file) ? 'PDF file' : 'Text file'}
                  loading="lazy"
                />
                <span class="tree-name">{file.title}</span>
              </div>
              <div class="tree-file-meta">
                <span class="tree-type">{file.type}</span>
                <span class="tree-action">{isPdf(file) ? 'Open' : 'Read'}</span>
              </div>
            </div>
          </a>
        {/each}
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  .notes-container {
    padding: 108px 2rem 3.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .notes-header {
    text-align: center;
    margin-bottom: 2rem;
    max-width: 42rem;

    h1 {
      font-family: 'Noto Serif', serif;
      font-size: clamp(2.3rem, 4.8vw, 3.7rem);
      font-weight: 400;
      margin: 0;
      letter-spacing: -0.04em;
    }
  }

  .notes-subtitle {
    font-family: 'Work Sans';
    font-size: 1.03rem;
    line-height: 1.65;
    opacity: 0.8;
    margin: 1rem 0 0;
  }

  .notes-tree-shell {
    width: 100%;
    max-width: 860px;
    background-color: var(--post-card-background-color);
    color: var(--post-card-text-color);
    border: 1px solid
      color-mix(in srgb, var(--card-border-color) 16%, transparent);
    border-radius: 24px;
    padding: 1.1rem;
    font-family: 'Fira Code', monospace;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.14);
    overflow: hidden;
    backdrop-filter: blur(8px);
  }

  .notes-tree-toolbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1rem 1.1rem;
    border-bottom: 1px solid
      color-mix(in srgb, var(--card-border-color) 12%, transparent);
  }

  .notes-tree {
    display: flex;
    flex-direction: column;
    padding-top: 0.35rem;
  }

  .tree-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.55rem;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    opacity: 0.7;
  }

  .tree-file {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: inherit;
    padding: 1rem;
    border-radius: 18px;
    transition:
      transform 0.2s ease,
      color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      transform: translateX(2px);
      color: var(--card-href-color);
      background-color: color-mix(
        in srgb,
        var(--background-color) 12%,
        transparent
      );
    }

    &:not(:last-child) {
      border-bottom: 1px solid
        color-mix(in srgb, var(--card-border-color) 10%, transparent);
      border-radius: 0;
    }

    &:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--card-href-color) 65%, white);
      outline-offset: 4px;
    }
  }

  .tree-index {
    font-size: 0.78rem;
    opacity: 0.48;
    min-width: 2ch;
  }

  .tree-file-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-width: 0;
  }

  .tree-file-label {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    min-width: 0;
  }

  .tree-icon {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
  }

  .tree-name {
    font-size: 0.98rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .tree-file-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .tree-type,
  .tree-action {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .tree-type {
    padding: 0.35rem 0.55rem;
    border-radius: 999px;
    background-color: color-mix(
      in srgb,
      var(--background-color) 12%,
      transparent
    );
  }

  .tree-action {
    opacity: 0.58;
  }

  .tree-empty {
    opacity: 0.6;
    padding: 1rem;
  }

  @media screen and (max-width: 900px) {
    .notes-container {
      padding: 90px 1.5rem 2.5rem;
    }
  }

  @media screen and (max-width: 600px) {
    .notes-container {
      padding: 80px 1.25rem 2rem;
    }

    .notes-tree-shell {
      border-radius: 20px;
      padding: 0.85rem;
    }

    .notes-tree-toolbar,
    .tree-file-main {
      align-items: flex-start;
      flex-direction: column;
    }

    .tree-file {
      gap: 0.85rem;
      padding: 0.95rem 0.8rem;
    }

    .tree-file-meta {
      gap: 0.6rem;
    }
  }
</style>
