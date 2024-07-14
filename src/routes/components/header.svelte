<script>
  export let headerColor, headerTextColor;
</script>

<header
  class="sticky-header"
  style="--headerColor: {headerColor};
           --headerTextColor: {headerTextColor}"
>
  <div class="header-item">Jonathan Ma</div>
  <div class="spacer" />
  <div class="header-item">
    <a href="https://github.com/jma02">
      <i class="devicon-github-original"></i>
    </a>
  </div>
  <div class="header-item">
    <a href="https://linkedin.com/in/ma-jonathan">
      <i class="devicon-linkedin-plain"></i>
    </a>
  </div>
</header>

<style lang="scss">
  .sticky-header {
    position: fixed;
    display: flex;
    top: 0;
    align-items: center;
    width: 100%;
    height: 80px;
    z-index: 100;
    background-color: var(--headerColor);
    transition: background-color 0.55s ease;
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

    &:hover {
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
</style>
