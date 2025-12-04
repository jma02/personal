<script lang="ts">
  import Header from '../../components/header.svelte';
</script>

<Header />

<div class="post-container">
  <article class="post">
    <header class="post-header">
      <h1>My First Blog Post</h1>
      <p class="post-meta">Published on December 4, 2025</p>
    </header>
    <div class="post-content">
      <p>
      When I have some more interesting stuff to share, I'll put it here. Stay tuned!
      </p>
    </div>
  </article>
</div>

<style lang="scss">
  .post-container {
    padding-top: 100px;
    display: flex;
    justify-content: center;
    // Removed padding: 2rem; to avoid conflicting with padding-top and potentially causing overlap
  }

  .post {
    background-color: var(--post-background-color);
    color: var(--post-text-color);
    border-radius: 5px;
    padding: 2rem;
    max-width: 800px;
    width: 100%;
  }

  .post-header {
    text-align: center;
    margin-bottom: 2rem;

    h1 {
      font-family: 'Noto Serif', serif;
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
  }

  .post-meta {
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    opacity: 0.7;
  }

  .post-content {
    font-family: 'Work Sans';
    font-size: 1.125rem;
    line-height: 1.6;

    h2 {
      font-family: 'Noto Serif', serif;
      font-size: 1.8rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 1rem;
    }
  }
</style>