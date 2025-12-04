<script lang="ts">
  import { darkMode } from '../../stores';
  import { onMount } from 'svelte';

  let scrollDistance = 0;
  let headerColor = 'rgb(0,0,0,0)';
  let headerTextColor = 'FFFCF9';

  onMount(() => {
    function handleScroll() {
      scrollDistance = window.scrollY;
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  $: {
    if ($darkMode) {
      if (scrollDistance < 100) {
        [headerColor, headerTextColor] = ['rgba(0, 0, 0, 0)', '#FFFCF9'];
      } else {
        [headerColor, headerTextColor] = ['#121212', '#FFFCF9'];
      }
    } else {
      if (scrollDistance < 100) {
        [headerColor, headerTextColor] = ['rgba(0, 0, 0, 0)', '#FFFCF9'];
      } else {
        [headerColor, headerTextColor] = ['#2a3a52', '#FFFCF9'];
      }
    }
  }

  function toggleDarkMode() {
    darkMode.update((value: boolean) => !value);
  }
</script>

<header
  class="sticky-header"
  style="
    --headerColor: {headerColor};
    --headerTextColor: {headerTextColor};
  "
>
  <a href="/" class="header-item">Jonathan Ma</a>
  <div class="header-item">
    <a href="/blog">Blog</a>
  </div>
  <div class="spacer" />
  <div class="header-item" on:click={toggleDarkMode}>
    <i  class="material-symbols-outlined">
      dark_mode
    </i>
  </div>
  <div class="header-item">
    <a href="https://github.com/jma02">
      <i class="devicon-github-original" ></i>
    </a>
  </div>
  <div class="header-item">
    <a href="https://linkedin.com/in/ma-jonathan">
      <i class="devicon-linkedin-plain"></i>
    </a>
  </div>
</header>


<style lang="scss">

  .sticky-header {
    position: fixed;
    display: flex;
    top: 0;
    align-items: center;
    width: 100%;
    height: 80px;
    z-index: 100;
    background-color: var(--headerColor);
    transition: background-color 0.55s ease;
    color: var(--headerTextColor);
    //font-family: 'Fira Code', monospace;
    font-family: 'Work Sans';
    font-weight: bold;
  }


  .header-item {
    padding: 10px;
    font-size: 24px;
    white-space: nowrap;
    transition: transform 0.3s ease;
    cursor: pointer;

    a {
      text-decoration: none;
      color: inherit;
    }

    &.header-item { // This targets the <a class="header-item"> specifically
      text-decoration: none;
      color: var(--headerTextColor); // Explicitly set the color
    }

    i {
      font-size: 32px;
    }

    &:hover {
      transform: scale(1.2);
    }

    &:first-of-type {
      padding-left: 20px;
      transform: none;
    }

    &:last-of-type {
      padding-right: 20px;
    }
  }

  .spacer {
    width: 100%;
  }
</style>
