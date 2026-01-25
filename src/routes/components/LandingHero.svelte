<script lang="ts">
  export let title = 'Jonathan Ma';
</script>

<div class="landing">
  <div class="intro-container">
    <h1>{title}</h1>
  </div>
</div>

<style lang="scss">
  .landing {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    @media screen and (max-width: 1200px) {
      gap: 0;
      min-height: 50vh;
    }
    justify-content: space-evenly;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    background-color: transparent;

    @media screen and (max-width: 768px) {
      min-height: 35vh;
      justify-content: flex-end;
      padding-bottom: 10px;
    }
    @media screen and (max-width: 480px) {
      min-height: 30vh;
      justify-content: flex-end;
      padding-bottom: 10px;
    }
  }

  .intro-container {
    text-align: center;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    z-index: 2;

    h1 {
      font-family: 'Noto Serif', serif;
      font-size: 3rem;
      font-weight: 500;
      margin-bottom: 0.75rem;

      @media screen and (max-width: 768px) {
        font-size: 2.5rem;
      }
      @media screen and (max-width: 480px) {
        font-size: 2rem;
      }
    }
  }

  :global(body.dark) .landing {
    position: relative;
  }

  :global(body.dark) .landing::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  :global(body.dark) .landing > * {
    z-index: 2;
  }
</style>
