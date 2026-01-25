<script lang="ts">
  import { darkMode } from '../../stores';
  import { onMount } from 'svelte';

  let scrollDistance = 0;
  let headerColor = 'rgb(0,0,0,0)';
  let headerTextColor = 'FFFCF9';
  let homeButtonColor = 'FFFCF9';
  let menuOpen = false;
  const linkedInUrl = 'https://linkedin.com/in/ma-jonathan';
  const rickrollUrl = 'https://www.youtube.com/watch?v=xvFZjo5PgG0';

  onMount(() => {
    const handleScroll = () => {
      scrollDistance = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  $: {
    if ($darkMode) {
      if (scrollDistance < 100) {
        [headerColor, headerTextColor, homeButtonColor] = ['rgba(0, 0, 0, 0)', '#FFFCF9', '#FFFCF9'];
      } else {
        [headerColor, headerTextColor, homeButtonColor] = ['#121212', '#FFFCF9', '#FFFCF9'];
      }
    } else {
      if (menuOpen && scrollDistance < 100) {
        [headerColor, headerTextColor, homeButtonColor] = ['rgba(0, 0, 0, 0)', '#2a3a52', '#FFFCF9'];
      } else if (scrollDistance < 100) {
        [headerColor, headerTextColor, homeButtonColor] = ['rgba(0, 0, 0, 0)', '#FFFCF9', '#FFFCF9'];
      } else {
        [headerColor, headerTextColor, homeButtonColor] = ['#2a3a52', '#FFFCF9', '#FFFCF9'];
      }
    }
  }

  function toggleDarkMode() {
    darkMode.update((value: boolean) => !value);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  function handleLinkedInClick(event: MouseEvent) {
    event.preventDefault();
    const targetUrl = Math.random() < 0.3 ? rickrollUrl : linkedInUrl;
    window.location.assign(targetUrl);
  }
</script>

<header
  class="sticky-header"
  style="
    --headerColor: {headerColor};
    --headerTextColor: {headerTextColor};
    --homeButtonColor: {homeButtonColor};
  "
>
  <div class="desktop-nav">
    <a href="/" class="header-item">Home</a>
    <div class="header-item">
      <a href="/blog">Blog</a>
    </div>
    <div class="header-item header-item-static">
      <a href="/notes">Notes</a>
    </div>
    <div class="spacer" />
    <div class="header-item" on:click={toggleDarkMode}>
      <i class="material-symbols-outlined"> dark_mode </i>
    </div>
    <div class="header-item">
      <a href="https://github.com/jma02">
        <i class="devicon-github-original"></i>
      </a>
    </div>
    <div class="header-item">
      <a href={linkedInUrl} on:click={handleLinkedInClick}>
        <i class="devicon-linkedin-plain"></i>
      </a>
    </div>
  </div>

  <div class="mobile-nav">
    <a href="/" class="header-item logo">
      <i class="material-symbols-outlined">home</i>
    </a>
    <div class="spacer" />
    <div class="header-item mobile-dark-mode" on:click={toggleDarkMode}>
      <i class="material-symbols-outlined"> dark_mode </i>
    </div>
    <button class="hamburger" on:click={toggleMenu} aria-label="Toggle menu">
      <i class="material-symbols-outlined">
        {menuOpen ? 'close' : 'menu'}
      </i>
    </button>
  </div>
</header>

{#if menuOpen}
  <div class="mobile-menu" class:open={menuOpen}>
    <nav>
      <a href="/" on:click={closeMenu}>Home</a>
      <a href="/blog" on:click={closeMenu}>Blog</a>
      <a href="/notes" on:click={closeMenu}>Notes</a>
      <div class="menu-divider"></div>
      <div class="icon-row">
        <div class="menu-item">
          <a href="https://github.com/jma02">
            <i class="devicon-github-original"></i>
          </a>
        </div>
        <div class="menu-item">
          <a href={linkedInUrl} on:click={handleLinkedInClick}>
            <i class="devicon-linkedin-plain"></i>
          </a>
        </div>
      </div>
    </nav>
  </div>
  <div class="overlay" on:click={closeMenu}></div>
{/if}

<svelte:head>
  <link rel="dns-prefetch" href="https://www.youtube.com" />
  <link rel="dns-prefetch" href="https://i.ytimg.com" />
  <link rel="dns-prefetch" href="https://www.linkedin.com" />
  <link
    rel="preconnect"
    href="https://www.youtube.com"
    crossorigin="anonymous"
  />
  <link rel="preconnect" href="https://i.ytimg.com" crossorigin="anonymous" />
  <link
    rel="preconnect"
    href="https://www.linkedin.com"
    crossorigin="anonymous"
  />
  <link rel="prefetch" href={rickrollUrl} />
  <link rel="prefetch" href={linkedInUrl} />
</svelte:head>

<style lang="scss">
  .sticky-header {
    position: fixed;
    display: flex;
    top: 0;
    align-items: center;
    width: 100%;
    height: 80px;
    z-index: 110;
    background-color: var(--headerColor);
    transition: background-color 0.55s ease;
    color: var(--headerTextColor);
    font-family: 'Work Sans';
    font-weight: bold;
  }

  .desktop-nav {
    display: flex;
    align-items: center;
    width: 100%;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .mobile-nav {
    display: none;
    align-items: center;
    width: 100%;

    @media screen and (max-width: 768px) {
      display: flex;
    }
  }

  .header-item {
    padding: 10px;
    font-size: 24px;
    white-space: nowrap;
    transition: transform 0.3s ease;
    cursor: pointer;

    a {
      text-decoration: none;
      color: inherit;
    }

    &.header-item {
      text-decoration: none;
      color: var(--headerTextColor);
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

    &.logo {
      font-size: 20px;
      font-weight: bold;
      padding-left: 20px;

      i {
        color: var(--homeButtonColor);
      }
    }
  }

  .header-item-static {
    &:hover {
      transform: none;
    }
  }

  .spacer {
    width: 100%;
  }

  .mobile-dark-mode {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 32px;
    }
  }

  .hamburger {
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 111;
    position: relative;

    i {
      font-size: 32px;
      color: var(--headerTextColor);
    }
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 70%;
    max-width: 300px;
    height: 100vh;
    z-index: 105;
    transform: translateX(100%);
    transition: transform 0.3s ease;

    &.open {
      transform: translateX(0);
    }

    nav {
      display: flex;
      flex-direction: column;
      padding-top: 100px;
      padding-left: 24px;
      padding-right: 24px;
      padding-bottom: 20px;
      background-color: #f5f5f5;
      height: 100%;
      box-sizing: border-box;

      a {
        color: #2a3a52;
        text-decoration: none;
        font-size: 22px;
        font-weight: 600;
        padding: 18px 8px;
        border-bottom: 1px solid rgba(42, 58, 82, 0.08);

        &:last-of-type {
          margin-bottom: 8px;
        }
      }

      .menu-divider {
        margin: 16px 0 12px 0;
        border: none;
        border-top: 1px solid rgba(42, 58, 82, 0.15);
      }

      .icon-row {
        display: flex;
        gap: 28px;
        padding: 16px 0 8px 0;
        justify-content: center;

        .menu-item {
          cursor: pointer;

          i {
            font-size: 36px;
            color: #2a3a52;
          }

          a {
            padding: 0;
            border: none;
            margin: 0;
          }
        }
      }
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 104;
  }

  :global(body.dark) .mobile-menu nav {
    background-color: #1a1a1a;

    a {
      color: #FFFCF9;
      border-bottom: 1px solid rgba(255, 252, 249, 0.08);
    }

    .menu-divider {
      border-top: 1px solid rgba(255, 252, 249, 0.15);
    }

    .menu-item i {
      color: #FFFCF9;
    }
  }
</style>
