<script lang="ts">
  import { onMount } from 'svelte';

  let scrollDistance = 0;
  let headerColor = 'rgba(0, 0, 0, 0)';
  let headerTextColor = '#FFFCF9';
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
    if (menuOpen) {
      [headerColor, headerTextColor] = ['rgba(8, 12, 18, 0.82)', '#FFFCF9'];
    } else if (scrollDistance < 100) {
      [headerColor, headerTextColor] = ['rgba(0, 0, 0, 0)', '#FFFCF9'];
    } else {
      [headerColor, headerTextColor] = ['#121212', '#FFFCF9'];
    }
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  function handleLinkedInClick(event: MouseEvent) {
    event.preventDefault();
    const targetUrl = Math.random() < 0.005 ? rickrollUrl : linkedInUrl;
    window.location.assign(targetUrl);
  }
</script>

<header
  class="sticky-header"
  style="
    --headerColor: {headerColor};
    --headerTextColor: {headerTextColor};
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
    <div class="header-item">
      <a href="https://github.com/jma02" aria-label="GitHub">
        <i class="devicon-github-original"></i>
      </a>
    </div>
    <div class="header-item">
      <a
        href={linkedInUrl}
        aria-label="LinkedIn"
        on:click={handleLinkedInClick}
      >
        <i class="devicon-linkedin-plain"></i>
      </a>
    </div>
  </div>

  <div class="mobile-nav">
    <div class="mobile-nav-spacer" aria-hidden="true"></div>
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
          <a href="https://github.com/jma02" aria-label="GitHub">
            <i class="devicon-github-original"></i>
          </a>
        </div>
        <div class="menu-item">
          <a
            href={linkedInUrl}
            aria-label="LinkedIn"
            on:click={handleLinkedInClick}
          >
            <i class="devicon-linkedin-plain"></i>
          </a>
        </div>
      </div>
    </nav>
  </div>
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
    justify-content: flex-end;
    width: 100%;
    padding-right: 8px;

    @media screen and (max-width: 768px) {
      display: flex;
    }
  }

  .mobile-nav-spacer {
    flex: 1;
    min-width: 0;
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
  }

  .header-item-static {
    &:hover {
      transform: none;
    }
  }

  .spacer {
    width: 100%;
  }

  .hamburger {
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 111;
    position: relative;
    border-radius: 999px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.06);
    }

    i {
      font-size: 32px;
      color: var(--headerTextColor);
    }
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    max-width: none;
    height: 100vh;
    z-index: 105;
    transform: translateY(-8px);
    opacity: 0;
    animation: mobileMenuIn 0.22s ease forwards;

    &.open {
      transform: translateY(0);
      opacity: 1;
    }

    nav {
      display: flex;
      flex-direction: column;
      padding: 104px 28px 32px;
      background:
        linear-gradient(180deg, rgba(10, 13, 20, 0.98), rgba(12, 16, 24, 0.96)),
        radial-gradient(
          circle at 18% 18%,
          rgba(38, 74, 124, 0.16),
          transparent 36%
        );
      height: 100%;
      box-sizing: border-box;
      backdrop-filter: blur(18px);

      > a {
        color: #fffcf9;
        text-decoration: none;
        font-size: clamp(2rem, 8vw, 2.65rem);
        font-weight: 600;
        letter-spacing: -0.04em;
        padding: 20px 4px;
        border-bottom: 1px solid rgba(255, 252, 249, 0.08);

        &:last-of-type {
          margin-bottom: 8px;
        }
      }

      .menu-divider {
        margin: 22px 0 16px 0;
        border: none;
        border-top: 1px solid rgba(255, 252, 249, 0.12);
      }

      .icon-row {
        display: flex;
        gap: 14px;
        padding: 10px 0 8px;
        justify-content: flex-start;

        .menu-item {
          display: flex;

          a {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            border: 1px solid rgba(255, 252, 249, 0.12);
            border-radius: 999px;
            background: rgba(255, 252, 249, 0.04);
            text-decoration: none;
            transition:
              background-color 0.2s ease,
              border-color 0.2s ease,
              transform 0.2s ease;

            &:hover {
              background: rgba(255, 252, 249, 0.08);
              border-color: rgba(255, 252, 249, 0.2);
              transform: translateY(-1px);
            }
          }

          i {
            font-size: 30px;
            color: #fffcf9 !important;
            opacity: 0.92;
          }
        }
      }
    }
  }

  @keyframes mobileMenuIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
