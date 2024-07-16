<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { dev } from '$app/environment';
  import { inject } from '@vercel/analytics';
  import card from './components/card.svelte';
  import header from './components/header.svelte';
  import showcase from './components/showcase.svelte';

  inject({ mode: dev ? 'development' : 'production' });
  let showBlurb = false;
  let scrollDistance = 0;
  let headerColor = 'rgb(0,0,0,0)';
  let headerTextColor = 'FFFCF9';
  function handleScroll(
    event: UIEvent & { currentTarget: EventTarget & Window }
  ) {
    scrollDistance = event.currentTarget!.scrollY;
    [headerColor, headerTextColor] =
      scrollDistance < 100
        ? [(headerColor = 'rgb(0,0,0,0)'), (headerTextColor = '#FFFCF9')]
        : [(headerColor = '#FFFCF9'), (headerTextColor = '#2E4057')];
  }

  onMount(() => {
    showBlurb = true;
  });
</script>

<svelte:window on:scroll={handleScroll} />
<svelte:component this={header} {headerColor} {headerTextColor} />
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
      <header class="header-text">about me.</header>
      <p>
        I currently work for
        <a href={'https://www.chathamfinancial.com/'}>Chatham Financial,</a>
        where I help develop analytic software products for private equity companies
        such as Blackstone. I am graduating from the University of Delaware this
        Spring with degrees in Mathematics and Computer Science. My other interests
        are olympic weightlifting, and cycling.
      </p>
    </div>
    <div class="projects">
      <h3>projects</h3>
      <svelte:component this={showcase} />
    </div>
  </div>
</div>

<style lang="scss">
  :global(body) {
    background-color: #2e4057;
    color: #fffcf9;
    //font-family: 'Fira Code', monospace;
    font-family: 'Work Sans';
    margin: 0;
    width: 100%;
  }

  .landing {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    @media screen and (max-width: 1200px) {
      gap: 0;
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
