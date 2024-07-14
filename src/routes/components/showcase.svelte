<script>
  let mouseOver = false;
  let selectedTab = 0;
</script>

<div class="showcase">
  <div class="navbar">
    <div class="navbar-item" class:navbar-item-selected={selectedTab === 0}>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img
        on:mouseover={() => (mouseOver = true)}
        on:mouseout={() => (mouseOver = false)}
        on:focus={() => (mouseOver = false)}
        on:blur={() => (mouseOver = false)}
        on:click={() => (selectedTab = 0)}
        on:keydown={() => (selectedTab = 0)}
        src={mouseOver
          ? '/images/salon-new.gif'
          : '/images/salon-static-transparent.png'}
        class="barber-pole"
        alt="A barber pole"
        aria-label="See more about kapper"
      />
    </div>
    <div class="navbar-item" class:navbar-item-selected={selectedTab === 1}>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img
        src={'/images/corgi.png'}
        class="ada"
        alt="ada"
        on:click={() => (selectedTab = 1)}
        on:keydown={() => (selectedTab = 1)}
        aria-label="See more about ada.ai"
      />
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    </div>
    <div class="navbar-item" class:navbar-item-selected={selectedTab === 2}>
      <i
        class="devicon-svelte-plain colored icon"
        on:click={() => (selectedTab = 2)}
        on:keydown={() => (selectedTab = 2)}
        aria-label="See more about this website"
        role="button"
        tabindex="0"
      />
    </div>
    <div class="navbar-item" class:navbar-item-selected={selectedTab === 3}>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg"
        class="icon mongo"
        on:click={() => (selectedTab = 3)}
        on:keydown={() => (selectedTab = 3)}
        aria-label="See more about this website"
        alt="mongo db"
      />
    </div>
  </div>

  {#if selectedTab === 0}
    <div class="showcase-item">
      <div class="showcase-item-header">kapper</div>
      <div class="showcase-item-content">
        <img src="/images/kapper.png" class="img" alt="kapper showcase image" />
        <p>
          Using deep learning to show you your next hairstyle. <br />
          <a href="https://github.com/jma02/kapperAI-frontend">[code]</a>
          <a href="https://devpost.com/software/kapperai">[devpost]</a>
          <a
            href="https://www.linkedin.com/posts/ma-jonathan_a-couple-weeks-ago-me-jan-ahmed-nicholas-activity-7113392869339451392-I1Sb?utm_source=share&utm_medium=member_desktop"
            >[demo]</a
          >
        </p>
      </div>
    </div>
  {/if}
  {#if selectedTab === 1}
    <div class="showcase-item">
      <div class="showcase-item-header">Ada.ai</div>
      <div class="showcase-item-content">
        <img src="/images/ada.png" class="img" alt="ada.ai showcase image" />
        <p>
          Re-envisioning how students study for CS101.<br />
          <a href="https://github.com/jma02/ada.ai">[code]</a>
          <a href="https://devpost.com/software/ada-ai">[devpost]</a>
          <a href="https://www.youtube.com/watch?v=q_VSDMeWVrk">[demo]</a>
        </p>
      </div>
    </div>
  {/if}
  {#if selectedTab === 2}
    <div class="showcase-item">
      <div class="showcase-item-header">This Website</div>
      <div class="showcase-item-content">
        <img
          src="/images/recursion.png"
          class="img"
          alt="a screenshot of this website"
        />
        <p>
          It's open licensed! Check it out! <br />
          <a href="https://github.com/jma02/personal">[code]</a>
        </p>
      </div>
    </div>
  {/if}
  {#if selectedTab === 3}
    <div class="showcase-item">
      <div class="showcase-item-header">Theme Generator</div>
      <div class="showcase-item-content">
        <img
          src="/images/nvim-theme-generator.png"
          class="img"
          alt="nvim theme generator screenshot"
        />
        <p>
          A theme generator with a MongoDB + serverless function backend.<br />
          <a href="https://jma02.github.io/neovim-colorscheme-generator/"
            >[website]</a
          >
          <a href="https://github.com/jma02/neovim-colorscheme-generator"
            >[frontend code]</a
          >
          <a
            href="https://github.com/jma02/neovim-colorscheme-generator/tree/main/src/api"
            >[backend code]</a
          >
        </p>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .showcase {
    display: grid;
    grid-template-columns: repeat(1, 0.25fr 2fr);
    width: 600px;
    height: 400px;
    border-width: 1px;
    border-color: #2e4057;
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

  .navbar {
    display: grid;
    grid-template-rows: repeat(4, 0.25fr);
    justify-content: center;
    align-content: center;
    border-width: 1px;
    border-color: #2e4057;
    border-right-style: ridge;
    @media screen and (max-width: 750px) {
      font-size: medium;
      grid-template-rows: none;
      grid-template-columns: repeat(4, 0.25fr);
      align-content: center;
      border-right-style: none;
      border-bottom-style: ridge;
    }
    > * {
      padding: 10px;
    }
  }
  @keyframes fadeInLeftShadow {
    0% {
      box-shadow: none;
    }
    100% {
      box-shadow: inset 3px 0 0 #2e4057;
    }
  }
  @keyframes fadeInBottomShadow {
    0% {
      box-shadow: none;
    }
    100% {
      box-shadow: inset 0 -3px 0 #2e4057;
    }
  }
  .navbar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    &-selected {
      animation: fadeInLeftShadow 0.2s ease-in-out forwards;
      @media screen and (max-width: 750px) {
        animation: fadeInBottomShadow 0.2s ease-in-out forwards;
      }
    }
  }

  .showcase-item {
    display: grid;
    font-family: 'Work Sans', serif;
    grid-template-rows: 15% 85%;
    grid-template-areas:
      'header'
      'content';
    overflow: hidden;

    &-header {
      padding: 10px;
      grid-area: header;
      font-family: 'Noto Serif', serif;
      font-size: x-large;
      font-weight: 500;
      text-align: center;
      border-bottom-style: ridge;
      border-width: 1px;
      border-color: #2e4057;
    }

    &-content {
      grid-area: content;
      align-items: center;
      display: flex;
      flex-direction: column;
      text-align: center;
      overflow-y: scroll;
      gap: 10px;
      font-size: medium;
      height: 100%;
      max-height: 100%;
      p {
        width: 80%;
      }
    }
  }

  .barber-pole {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  @keyframes wobble {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .ada {
    width: 50px;
    height: 33.5px;

    &:hover {
      animation: wobble 1s infinite;
    }

    cursor: pointer;
    transition: transform 0.75s ease-in-out;
  }

  .mongo {
    width: 50px;
    height: 50px;
  }

  .icon {
    font-size: 40px;
    text-align: center;
    cursor: pointer;
    &:hover {
      animation: wobble 1s infinite;
    }
    transition: transform 0.75s ease-in-out;
  }

  .img {
    height: 200px;
    @media screen and (max-width: 750px) {
      width: 305px;
      object-fit: cover;
      object-position: top;
    }
    margin: 20px;
    border-style: ridge;
    border-width: 1px;
    border-radius: 2px;
    border-color: #2e4057;
  }
</style>
