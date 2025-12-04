<script lang="ts">
  import header from './components/header.svelte';
  import showcase from './components/showcase.svelte';
</script>

<svelte:component this={header} />
<div class="landing">
  <div class="intro-container">
    <h1>Jonathan Ma</h1>
  </div>
</div>

<div class="about">
  <div class="main">
    <div class="whoami">
      <header class="header-text">About me</header>
      <p>
        I'm a graduate of the University of Delaware. I studied mathematics and computer science,
        with a focus on applied mathematics.
        Broadly I am interested in inverse problems, learning theory, and 
        generative models.

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
    min-height: 100vh;
    width: 100%;
    background-image: url('/images/landing.gif');
    background-size: cover;
    background-attachment: fixed; // Add this line for parallax effect

    @media screen and (max-width: 768px) {
      background-attachment: scroll; // Remove fixed attachment for mobile
      background-position: center center; // Center the GIF for better mobile display
    }
  }

  .intro-container {
    text-align: center;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3); // Soften text shadow
    z-index: 2;

    h1 {
      font-family: 'Noto Serif', serif;
      font-size: 3rem; // Reduced font size
      font-weight: 500; // Reduced font weight;
      margin-bottom: 0.75rem; // Adjusted margin

      @media screen and (max-width: 768px) {
        font-size: 2rem; // Further reduce font size for mobile
      }
      @media screen and (max-width: 480px) {
        font-size: 1.5rem; // Even smaller font size for very small screens
      }
    }
  }

  .about {

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 1000px;
    width: 100%;
    background-color: var(--about-background-color);
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
    background-color: var(--main-background-color);
    color: var(--main-text-color);
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

  .projects {
    h3 {
      font-weight: 400;
      color: var(--projects-h3-color);
    }
  }
</style>
