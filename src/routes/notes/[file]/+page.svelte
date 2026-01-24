<script lang="ts">
  import Header from '../../components/Header.svelte';

  export let data: { fileName: string; content: string };
</script>

<Header />

<div class="note-container">
  <a class="note-back" href="/notes">← Back to notes</a>
  <div class="note-card">
    <div class="note-title">{data.fileName}</div>
    <pre class="note-content">{data.content}</pre>
  </div>
</div>

<style lang="scss">
  .note-container {
    padding: 100px 2rem 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .note-back {
    font-family: 'Work Sans';
    text-decoration: none;
    color: var(--card-href-color);
    margin-bottom: 1.5rem;
  }

  .note-card {
    width: 100%;
    max-width: 800px;
    background-color: var(--post-background-color);
    color: var(--post-text-color);
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }

  .note-title {
    font-family: 'Noto Serif', serif;
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }

  .note-content {
    font-family: 'Fira Code', monospace;
    font-size: 0.95rem;
    white-space: pre-wrap;
    line-height: 1.6;
    margin: 0;
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
      padding: 1.5rem;
    }
  }
</style>
