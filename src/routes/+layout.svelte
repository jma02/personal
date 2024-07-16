<script>
    import { inject } from '@vercel/analytics';
    import { dev } from '$app/environment';
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

    inject({ mode: dev ? 'development' : 'production' });
    injectSpeedInsights();
</script>

<slot></slot>