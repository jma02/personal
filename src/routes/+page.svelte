<script lang='ts'>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    import me from '../images/me.png';

    inject({ mode: dev ? 'development' : 'production' });
    let showBlurb = false;
    let scrollDistance = 0;
    let headerColor = "rgb(0,0,0,0)"
    let headerTextColor = "FFFCF9"
    function handleScroll(event: any) {
        scrollDistance = event.srcElement.scrollingElement.scrollTop;
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
    <div class="card">
        <div class="portrait">
        <img
            src={me}
            class="me"
            alt="This is me."
        >
        <p>this is me.</p>
        </div>
        <div class="contact">
            <header><b>Jonathan Ma</b></header>
            <p>currently: @UD, Chatham Financial</p>  
            <p>contact: ma.jonathan02@gmail.com</p>
            <p>location: philly area</p>
        </div>
        <div class="interests">
            <b>interests</b>
            <li>Spectral Graph Theory</li>
            <li>Deep Learning</li>
            <li>Full Stack Development</li>
        </div>
    </div>
    {#if showBlurb}
    <div class="blurb">
       <p in:fly={{y:500, duration: 1750}}> Hi.</p>
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
        <div class="showcase">
            <div class="navbar"></div>
            <div class="showcase-item">
                <header class="header-text-small">what am I working on?</header>
                <p>come back soon to find out...</p>
            </div>
        </div>
    </div>

</div>
<style lang="scss">
    :global(body){
        background-color: #2E4057;
        color: #FFFCF9;
        //font-family: 'Fira Code', monospace;
        font-family: 'Work Sans';
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
        //font-family: 'Fira Code', monospace;
        font-family: 'Work Sans';
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
        display: flex;
        flex-direction: row;
        @media screen and (max-width: 1200px) {
            flex-direction: column;
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
    .portrait {
        display: flex;
        flex-direction: column ;
        text-align: center;
    }
    .me {
        width: 250px;
        @media screen and (max-width: 450px) {
            width: 100px;
        } 
        border-radius: 5%;
    }

    .card {
        display: flex;
        gap: 35px;
        @media screen and (max-width: 1200px) {
            flex-direction: column;
            overflow-y: scroll;
            gap: 10px;
        }
        @media screen and (max-width: 450px) {
            font-size: small;
        }
        flex-direction: row;
        align-items: center;
        justify-content: start;
        width: 60%;
        color:#2E4057;
        padding: 35px;
        height: 400px;
        background-color: #fffcf9fa;
        border-radius: 2.5%;
    }

    .contact {
        header {
            font-family: 'Noto Serif', serif;
            font-size: x-large;
        }
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
    .interests {
        line-height: 35px;
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
            &-small {
                font-size: x-large;
                font-weight: 400;
                color:#2E4057;
            }
            font-family: 'Noto Serif', serif;
            font-weight: 400;
        }
    .showcase {
        display: grid;
        grid-template-columns: repeat(1, 0.25fr 2fr);
        width: 600px;
        height: 400px;
        border-width: 1px;
        border-color: #2E4057;
        border-style: ridge;
        border-radius: 3px;
        @media screen and (max-width: 750px) {
            font-size: medium;
            grid-template-columns: none;
            grid-template-rows: repeat(1, 0.25fr 2fr);
            width: 450px;
        }
        @media screen and (max-width: 600px) {
            width: 95%;
        }
    }
    .showcase-item {
        display: flex;
        flex-direction: column;
        padding: 10px;
        font-family: 'Work Sans';
        align-items: center;
        justify-content: space-evenly;
    }
    .navbar {
        display: grid;
        grid-template-rows: repeat(1, 1fr);
        border-width: 1px;
        border-color: #2E4057;
        border-right-style: ridge;
        @media screen and (max-width: 750px) {
            font-size: medium;
            grid-template-rows: none;
            grid-template-columns: repeat(1, 0.25fr 2fr);
            border-right-style: none;
            border-bottom-style: ridge;;
        }
    }
</style>
