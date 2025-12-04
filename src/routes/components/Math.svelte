<script lang="ts">
  import { onMount } from 'svelte';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';

  export let latex: string;
  export let displayMode: boolean = false;

  let mathContainer: HTMLElement;

  onMount(() => {
    katex.render(latex, mathContainer, {
      throwOnError: false,
      displayMode: displayMode,
    });
  });

  // Re-render if latex or displayMode changes
  $: if (mathContainer && latex) {
    katex.render(latex, mathContainer, {
      throwOnError: false,
      displayMode: displayMode,
    });
  }
</script>

<span bind:this={mathContainer} />
