<script lang="ts">
  import { fly } from 'svelte/transition';
  import Header from '../components/Header.svelte';

  export let data: { files: string[] };

  const isPdf = (file: string) => file.toLowerCase().endsWith('.pdf');
  const fileIcon = (file: string) =>
    isPdf(file) ? '/icons/file-pdf.svg' : '/icons/file-txt.svg';
</script>

<Header />

<div class="notes-container">
  <div class="notes-header">
    <h1>Notes</h1>
  </div>
  <div class="notes-tree">
    <div class="tree-root">notes/</div>
    {#if data.files.length === 0}
      <div class="tree-empty">(empty)</div>
    {:else}
      {#each data.files as file}
        <a
          href={isPdf(file) ? `/notes/raw/${file}` : `/notes/${file}`}
          class="tree-file"
          target={isPdf(file) ? '_blank' : undefined}
          rel={isPdf(file) ? 'noopener noreferrer' : undefined}
          in:fly={{ y: 24, duration: 350 }}
        >
          <img
            class="tree-icon"
            src={fileIcon(file)}
            alt={isPdf(file) ? 'PDF file' : 'Text file'}
            loading="lazy"
          />
          <span class="tree-name">{file}</span>
        </a>
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  .notes-container {
    padding: 100px 2rem 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .notes-header {
    text-align: center;
    margin-bottom: 2rem;

    h1 {
      font-family: 'Noto Serif', serif;
      font-size: 3rem;
      font-weight: 400;
      margin-bottom: 0.5rem;
    }
  }

  .notes-subtitle {
    font-family: 'Work Sans';
    font-size: 1rem;
    opacity: 0.8;
    margin: 0;
  }

  .notes-tree {
    width: 100%;
    max-width: 720px;
    background-color: var(--post-card-background-color);
    color: var(--post-card-text-color);
    border-radius: 8px;
    padding: 1.75rem 2rem;
    font-family: 'Fira Code', monospace;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }

  .tree-root {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .tree-file {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: inherit;
    padding: 0.35rem 0;
    transition:
      transform 0.2s ease,
      color 0.2s ease;

    &:hover {
      transform: translateX(2px);
      color: var(--card-href-color);
    }
  }

  .tree-branch {
    opacity: 0.6;
  }

  .tree-icon {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
  }

  .tree-empty {
    opacity: 0.6;
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

    .notes-tree {
      padding: 1.5rem;
    }
  }
</style>
