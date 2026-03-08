<script>
  import { inject } from '@vercel/analytics';
  import { dev } from '$app/environment';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
  import Background from './components/Background.svelte';
  import '../app.scss';

  inject({ mode: dev ? 'development' : 'production' });
  injectSpeedInsights();
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
