<script>
    import salon from "../../images/salon.gif";
    import salonStatic from '../../images/salon-static.png';
    import ada from "../../images/corgi.png"

    let mouseOver = false;
    let selectedTab = 0;
</script>
<div class="showcase">
    <div class="navbar">
        <img
                on:mouseover={()=>mouseOver=true}
                on:mouseout={()=>mouseOver=false}
                on:click={()=>selectedTab=0}
                src={mouseOver ? salon : salonStatic}
                class="barber-pole"
                alt="A barber pole"/>
        <img
                src={ada}
                class="ada"
                alt="ada"
                on:click={()=>selectedTab=1}
            />
        <i
                class="devicon-svelte-plain colored icon"
                on:click={()=>selectedTab=2}
        />
    </div>
    <div class="showcase-item">
        <header class="header-text-small">what am I working on?</header>
        <p>come back soon to find out...</p>
    </div>
</div>
<style lang="scss">
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

  .navbar {
    display: grid;
    grid-template-rows: repeat(4, .25fr);
    justify-content: center;
    align-content: center;
    border-width: 1px;
    border-color: #2E4057;
    border-right-style: ridge;
    @media screen and (max-width: 750px) {
      font-size: medium;
      grid-template-rows: none;
      grid-template-columns: repeat(4, 0.25fr);
      align-items: center;
      border-right-style: none;
      border-bottom-style: ridge;;
    }
    > * {
      padding: 5px;
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

  .header-text-small {
    font-size: x-large;
    font-weight: 400;
    color: #2E4057;
  }

  .barber-pole {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  @keyframes wobble {
    0%, 100% {
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
    transition: transform .75s ease-in-out;
  }

  .icon {
    font-size: 45px;
    text-align: center;
    cursor: pointer;
    &:hover {
      animation: wobble 1s infinite;
    }
    transition: transform .75s ease-in-out;
  }
</style>