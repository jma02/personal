<div class="about">
  <div class="main">
    <div class="whoami">
      <header class="header-text">Readme</header>
      <p>
        I'm a graduate of the University of Delaware. I studied mathematics and
        computer science, with a focus on applied mathematics. Broadly I am
        interested in inverse problems, learning theory, and generative models.
        I'm hoping to populate this page with what I'm working on soon! In the
        meantime, please feel free to reach out to me via email or Linkedin (the
        link in the header) to connect!
      </p>
    </div>
  </div>
</div>

<style lang="scss">
  .about {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: auto;
    min-height: 92vh;
    width: 100%;
    background-color: transparent;
    padding: 40px 0;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 22% 0;
      background-color: var(--about-band-color);
      z-index: 1;
    }

    > * {
      position: relative;
      z-index: 3;
    }

    @media screen and (max-width: 900px) {
      height: auto;
      min-height: 100vh;
      padding: 50px 0;

      &::before {
        inset: 18% 0;
      }
    }

    @media screen and (max-width: 600px) {
      min-height: 100vh;
      padding: 40px 0;

      &::before {
        inset: 20% 0;
      }
    }

    @media screen and (max-width: 450px) {
      min-height: 100vh;
      padding: 32px 0;

      &::before {
        inset: 22% 0;
      }
    }

    @media screen and (max-width: 1600px) {
      min-height: 88vh;
    }

    @media screen and (max-width: 1400px) {
      min-height: 84vh;

      &::before {
        inset: 20% 0;
      }
    }

    @media screen and (max-width: 1200px) {
      min-height: 82vh;

      &::before {
        inset: 22% 0;
      }
    }
  }

  :global(body.dark) .about::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
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
      height: auto;
      padding: 50px;
    }
    @media screen and (max-width: 1400px) {
      height: auto;
      padding: 48px 100px;
      gap: 24px;
    }
    @media screen and (max-width: 1200px) {
      padding: 40px 72px;
    }
    @media screen and (max-width: 900px) {
      height: auto;
      padding: 40px 48px;
      gap: 24px;
    }
    @media screen and (max-width: 450px) {
      font-size: 18px;
      padding: 28px 24px;
    }
    background-color: rgba(255, 252, 249, 0.78);
    backdrop-filter: blur(8px);
    color: var(--main-text-color);
    font-family: 'Noto Serif', serif;
    font-size: 24px;
    font-weight: 100;
  }

  :global(body.dark) .main {
    background-color: rgba(18, 18, 18, 0.78);
  }

  :global(body:not(.dark)) .main {
    background-color: var(--main-background-color);
    backdrop-filter: none;
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
    @media screen and (max-width: 900px) {
      width: 100%;
      max-width: 520px;
      font-size: 20px;
    }
    @media screen and (max-width: 750px) {
      width: 450px;
    }
    @media screen and (max-width: 600px) {
      width: 100%;
      max-width: 360px;
      font-size: 18px;
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
</style>
