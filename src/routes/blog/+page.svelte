
<script lang="ts">
  import { fly } from 'svelte/transition';
  import Header from '../components/header.svelte';

  const posts = [
    {
      slug: 'first-post',
      title: 'First Blog Post',
      description: 'Hello world!',
      date: '2025-12-04'
    }
  ];
</script>

<Header />

<div class="blog-container">
  <div class="blog-header">
    <h1>Blog</h1>
  </div>
  <div class="posts-container">
    {#each posts as post}
      <a href="/blog/{post.slug}" class="post-card" in:fly={{ y: 50, duration: 500 }}>
        <div class="post-title">{post.title}</div>
        <div class="post-description">{post.description}</div>
        <div class="post-date">{post.date}</div>
      </a>
    {/each}
  </div>
</div>

<style lang="scss">
  .blog-container {
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
  }

  .blog-header {
    text-align: center;
    margin-bottom: 2rem;
    h1 {
      font-family: 'Noto Serif', serif;
      font-size: 3rem;
      font-weight: 400;
    }
  }

  .posts-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    padding: 0 2rem;
  }

  .post-card {
    background-color: var(--post-card-background-color);
    color: var(--post-card-text-color);
    border-radius: 5px;
    padding: 1.5rem;
    text-decoration: none;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }

  .post-title {
    font-family: 'Noto Serif', serif;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .post-description {
    font-family: 'Work Sans';
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .post-date {
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
