<script lang="ts">
  import Header from './components/Header.svelte';
  import LandingHero from './components/LandingHero.svelte';
  import AboutSection from './components/AboutSection.svelte';
</script>

<Header />
<main class="home-page">
  <LandingHero />
  <AboutSection />
</main>

<style lang="scss">
  .home-page {
    min-height: 100vh;
    padding: 92px 0 36px;
  }

  @media screen and (max-width: 900px) {
    .home-page {
      padding-top: 84px;
    }
  }

  @media screen and (max-width: 600px) {
    .home-page {
      padding-top: 72px;
      padding-bottom: 28px;
    }
  }
</style>
