<script>
  import { inject } from '@vercel/analytics';
  import { dev } from '$app/environment';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
  import { onMount } from 'svelte';
  import Background from './components/Background.svelte';
  import { darkMode } from '../stores';
  import '../app.scss';

  inject({ mode: dev ? 'development' : 'production' });
  injectSpeedInsights();

  onMount(() => {
    const storedTheme = window.localStorage.getItem('theme');
    const prefersDark = storedTheme ? storedTheme === 'dark' : true;
    darkMode.set(prefersDark);
    if (!storedTheme) {
      window.localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }

    darkMode.subscribe((value) => {
      if (typeof window !== 'undefined') {
        if (value) {
          document.body.classList.add('dark');
          window.localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove('dark');
          window.localStorage.setItem('theme', 'light');
        }
      }
    });
  });
</script>

<Background />
<div class="page-content">
  <slot></slot>
</div>

<style>
  .page-content {
    position: relative;
    z-index: 3;
  }
</style>
