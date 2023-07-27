<script lang='ts'>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import nicePicture from '../images/landing.gif'
    let showBlurb = false;
    let scrollDistance = 0;
    let headerColor = "rgb(0,0,0,0)"
    let headerTextColor = "FFFCF9"
    function handleScroll(event: any) {
        scrollDistance = event.srcElement.scrollingElement.scrollTop;
        [headerColor, headerTextColor] = (scrollDistance) < 300 ?
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
    export const prerender = true;
</script>

<svelte:window on:scroll={handleScroll} />

<header 
    class="sticky-header" 
    style="--headerColor: {headerColor};
           --headerTextColor: {headerTextColor}"
    >
    <div class="header-item">Jonathan Ma</div>
    <div class="spacer"/>
    <div class="header-item">
        <a href="https://github.com/johnma02">
            <i class="devicon-github-original"></i>
        </a>
    </div>
    <div class="header-item">
        <a href="https://linkedin.com/in/johnma02">
            <i class="devicon-linkedin-plain"></i>
        </a>
    </div>
</header>

<div class="landing">
    <img 
        src={nicePicture}
        alt="The eiffel tower."
        height="100%"
        width="100%"
    >
    {#if showBlurb}
    <div class="blurb">
       <p in:fly={{y:500, duration: 1750}}> Hi.</p>
    </div>
    {/if}
</div>

<div class="about">
    <div class="bio">
        <p>I'm a student at the University of Delaware studying Computer Science and Mathematics.</p>
        <p>My current interests are in front-end development, financial technology, and deep learning.</p>
        <p>
           You can connect with me on <a href="https://linkedin.com/in/johnma02">LinkedIn</a>, 
           or visit my <a href="https://github.com/johnma02">Github</a> via the icons in the header.
        </p>
        <p>Thanks for checking out my slice of the web.</p>
    </div>

</div>
<style lang="scss">
    :global(body){
        background-color: #2E4057;
        color: #FFFCF9;
        font-family: 'Fira Code', monospace;
        margin: 0;
    }
    .sticky-header {
        position: fixed;
        display: flex;
        top: 0;
        align-items: center;
        width: 100%;
        height: 80px;
        z-index: 100;
        background-color: var(--headerColor);
        transition: background-color .55s ease;
        color: var(--headerTextColor);
        font-family: 'Fira Code', monospace;
        font-weight: bold;
    }
    .header-item {
        padding: 10px;
        font-size: 24px;
        white-space: nowrap;
        transition: transform 0.3s ease;
        a {
            text-decoration: none;
            color: inherit;
        }

        i {
            font-size: 32px;
        }

        &:hover{
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
    .landing {
        height: 120vh;
        width: 100%;
        img {
            object-fit: cover
        }
    }
    .blurb {
        position: relative;
        right: 20%;
        bottom: 20%;
        font-size: 32px;
        text-align: right;
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
    .bio {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 600px;
        padding: 50px;
        width: 100%;
        gap: 30px;
        background-color: #FFFCF9;
        color: black;
        font-family: 'Noto Serif', serif;
        font-size: 24px;
        font-weight: 100;
        & header {
            font-size: 32px;
            font-weight: bold;
        }
    }
</style>
