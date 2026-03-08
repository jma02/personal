<section class="about">
  <div class="about-copy">
    <p>
      I studied mathematics at the University of Delaware, with a focus on
      machine learning and applied mathematics. I currently work as a software
      engineer.
    </p>
    <p>
      I am looking to populate this page in the future with more of what I'm
      working on. In the meanwhile, please feel free to connect with me on
      <a href="https://linkedin.com/in/ma-jonathan">LinkedIn</a>.
    </p>
  </div>
</section>

<style lang="scss">
  .about {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 1rem 2rem 0;
    box-sizing: border-box;
  }

  .about-copy {
    width: min(760px, 100%);
    color: var(--post-card-text-color);

    p {
      margin: 0;
      font-family: 'Work Sans';
      font-size: 0.98rem;
      line-height: 1.72;
      max-width: 34rem;
      opacity: 0.74;

      a {
        color: var(--card-href-color);
        text-decoration: none;
      }
    }

    p + p {
      margin-top: 0.9rem;
    }
  }

  @media screen and (max-width: 900px) {
    .about {
      padding: 1.5rem 1.5rem 0;
    }
  }

  @media screen and (max-width: 640px) {
    .about {
      padding: 1.35rem 1.25rem 0;
    }
  }
</style>
