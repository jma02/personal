<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import card from './components/card.svelte';
  import header from './components/header.svelte';
  import showcase from './components/showcase.svelte';

  let showBlurb = false;
  let scrollDistance = 0;
  let headerColor = 'rgb(0,0,0,0)';
  let headerTextColor = 'FFFCF9';
  let darkMode = false;
  let isClient = false;

  function updateHeaderColors(scroll: number, dark: boolean) {
    if (scroll < 100) {
      [headerColor, headerTextColor] = dark
              ? ['rgba(0, 0, 0, 0)', '#FFFCF9']
              : ['rgba(0, 0, 0, 0)', '#FFFCF9'];
    } else {
      [headerColor, headerTextColor] = dark
              ? ['#121212', '#FFFCF9']
              : ['#2a3a52', '#FFFCF9'];
    }
  }


  $: {
    if (isClient) {
      if (darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      updateHeaderColors(scrollDistance, darkMode);

    }
  }
  function handleScroll(event: UIEvent & { currentTarget: EventTarget & Window }) {
    scrollDistance = event.currentTarget.scrollY;
    updateHeaderColors(scrollDistance, darkMode);
  }

    onMount(() => {
      isClient = true;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        darkMode = true;
      }
      showBlurb = true;
    });



</script>

<svelte:window on:scroll={handleScroll} />
<svelte:component this={header} {headerColor} {headerTextColor}
                  on:toggleDarkMode={() => (darkMode = !darkMode)}
/>
<div class="landing">
  <svelte:component this={card} />
  {#if showBlurb}
    <div class="blurb-container">
      <div class="blurb">
        <p in:fly={{ y: 500, duration: 1750 }}>Hi.</p>
      </div>
    </div>
  {/if}
</div>

<div class="about">
  <div class="main">
    <div class="whoami">
      <header class="header-text">About me</header>
      <p>
        I'm a graduate of the University of Delaware. I studied mathematics and computer science,
        with a focus on applied mathematics.
        Broadly I am interested in scientific machine learning, diffusion and
        flow matching models, and
        solving PDE inverse problems.

        I'm hoping to populate this page with what I'm working on soon!
        In the meantime, please feel free to reach out to me via email or Linkedin to connect!
      </p>
    </div>
    <div class="projects">
      <h3>Projects</h3>
      <svelte:component this={showcase} />
    </div>
  </div>
</div>

<style lang="scss">
  :global(body),
  :global(body.dark),
  :global(body .about),
  :global(body .main),
  :global(body .projects h3),
  :global(body .blurb) {
    transition: background-color 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
  }

  :global(body) {
    background-color: #2e4057;
    color: #fffcf9;
    //font-family: 'Fira Code', monospace;
    font-family: 'Work Sans';
    margin: 0;
    width: 100%;
  }

  :global(body.dark) {
    background-color: #121212;
    color: #e0e0e0;
  }

  :global(body.dark) .blurb {
    text-shadow: 2px 2px 4px #111;
  }

  :global(body.dark) .about {
    background-color: #1e1e1e;
    color: #f0f0f0;
  }

  :global(body.dark) .main {
    background-color: #1e1e1e;
    color: #f0f0f0;
  }

  :global(body.dark) .projects h3 {
    color: #ddd;
  }


  .landing {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    @media screen and (max-width: 1200px) {
      gap: 0;
      height: 1250px;
    }
    justify-content: space-evenly;
    align-items: center;
    height: 1000px;
    width: 100%;
    background-image: url('/images/landing.gif');
    background-size: cover;
  }

  .blurb {
    font-size: 32px;
    text-align: center;
    margin-right: 50px;
    margin-bottom: 25px;
    font-family: 'Fira Code', monospace;
    text-shadow: 2px 2px 4px #000;
  }

  .about {

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 1000px;
    width: 100%;
    background-color: #fffcf9;
    padding: 40px 0px;
  }

  .main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 600px;
    padding: 50px 200px;
    width: 100%;
    @media screen and (max-width: 1600px) {
      flex-direction: column;
      gap: 10px;
      height: 800px;
      padding: 50px;
    }
    @media screen and (max-width: 450px) {
      font-size: 18px;
      padding: 0;
    }
    background-color: #fffcf9;
    color: black;
    font-family: 'Noto Serif', serif;
    font-size: 24px;
    font-weight: 100;
  }

  .whoami {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-family: 'Work Sans';
    font-size: large;
    font-weight: 300;
    width: 500px;
    @media screen and (max-width: 1600px) {
      flex-direction: column;
      width: 600px;
    }
    @media screen and (max-width: 750px) {
      width: 450px;
    }
    @media screen and (max-width: 600px) {
      width: 300px;
    }
    @media screen and (max-width: 450px) {
      font-size: medium;
    }
  }

  .header-text {
    font-size: xxx-large;
    font-family: 'Noto Serif', serif;
    font-weight: 400;
    @media screen and (max-width: 450px) {
      font-size: xx-large;
    }
  }

  .blurb-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
  }

  .projects {
    h3 {
      font-weight: 400;
    }
  }
</style>
