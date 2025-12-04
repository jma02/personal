<script>
    import { inject } from '@vercel/analytics';
    import { dev } from '$app/environment';
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
    import { onMount } from 'svelte';
    import { darkMode } from '../stores';
    import '../app.scss';

    inject({ mode: dev ? 'development' : 'production' });
    injectSpeedInsights();

    onMount(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            darkMode.set(true);
        }

        darkMode.subscribe(value => {
            if (typeof window !== 'undefined') {
                if (value) {
                    document.body.classList.add('dark');
                } else {
                    document.body.classList.remove('dark');
                }
            }
        });
    });
</script>

<slot></slot>