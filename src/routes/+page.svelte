<script lang='ts'>
    import {onMount} from 'svelte';
    import {fly} from 'svelte/transition';
    import {dev} from '$app/environment';
    import {inject} from '@vercel/analytics';
    import card from "./components/card.svelte";
    import header from "./components/header.svelte";
    import showcase from "./components/showcase.svelte";

    inject({mode: dev ? 'development' : 'production'});
    let showBlurb = false;
    let scrollDistance = 0;
    let headerColor = "rgb(0,0,0,0)"
    let headerTextColor = "FFFCF9"
    function handleScroll(event: any) {
        scrollDistance = event.target.scrollingElement.scrollTop;
        [headerColor, headerTextColor] = (scrollDistance) < 100 ?
            [
                headerColor = "rgb(0,0,0,0)",
                headerTextColor = "#FFFCF9",
            ]
            :
            [
                headerColor = "#FFFCF9",
                headerTextColor = "#2E4057",
            ];
    }

    onMount(() => {
        showBlurb = true;
    });

</script>

<svelte:window on:scroll={handleScroll}/>
<svelte:component
        this={header}
        headerColor={headerColor}
        headerTextColor={headerTextColor}
/>
<div class="landing">
    <svelte:component this={card}/>
    {#if showBlurb}
        <div class="blurb-container">
            <div class="blurb">
                <p in:fly={{y:500, duration: 1750}}> Hi.</p>
            </div>
        </div>
    {/if}
</div>

<div class="about">
    <div class="main">
        <div class="whoami">
            <header class="header-text">about me.</header>
            <p>Hello. 👋 I am a lifelong learner interested in mathematics, as well as building apps.
                I'm currently working at Chatham Financial, building financial SaaS. I am also working
                under Dr. Yao Hu @ the University of Delaware, modeling fertilizer runoff risk in the Great Lakes.
            </p>
            <p>
                Outside of work,
                I am an urban life enthusiast, cycling enjoyer, and weightlifter.
            </p>
        </div>
        <svelte:component this={showcase}/>
    </div>

</div>
<style lang="scss">
  :global(body) {
    background-color: #2E4057;
    color: #FFFCF9;
    //font-family: 'Fira Code', monospace;
    font-family: 'Work Sans';
    margin: 0;
  }

  .landing {
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 1200px) {
      overflow-y: scroll;
      gap: 0px;
    }
    justify-content: space-evenly;
    align-items: center;
    height: 120vh;
    width: 100%;
    background-image: url("../images/landing.gif");
    background-size: cover;
  }

  .blurb {
    font-size: 32px;
    text-align: center;
    padding-right: 50px;
    font-family: 'Fira Code', monospace;
    text-shadow: 2px 2px 4px #000;
  }

  .about {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #FFFCF9;
    padding: 40px 0px;
  }


  .main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 600px;
    padding: 50px;
    width: 100%;
    @media screen and (max-width: 1200px) {
      flex-direction: column;
      gap: 10px;
      height: 800px;
    }
    @media screen and (max-width: 450px) {
      font-size: 18px;
    }
    background-color: #FFFCF9;
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
    width: 40%;
    @media screen and (max-width: 1200px) {
      flex-direction: column;
      width: 85%;
    }
    @media screen and (max-width: 450px) {
      font-size: medium;
    }
  }

  .header-text {
    font-size: xxx-large;
    font-family: 'Noto Serif', serif;
    font-weight: 400;
  }

  .blurb-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
  }
</style>
