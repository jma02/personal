<div class="card-container">
  <div class="card">
    <div class="portrait">
      <img src="/images/me2.png" class="me" alt="This is me." />
      <p>Me and the Harvard Mark I.</p>
    </div>
    <div class="card-snd-flexbox">
      <div class="contact">
        <h3>Jonathan Ma</h3>
        <div class="contact-item">
          <span class="material-symbols-outlined">school</span>&mdash;
          <p>University of Delaware</p>
        </div>
        <div class="contact-item">
          <span class="material-symbols-outlined">mail</span>&mdash;
          <a href="mailto:ma.jonathan02@gmail.com" class="card-href"
            >ma.jonathan02@gmail.com</a
          >
        </div>
        <div>
          <div class="contact-item">
            <span class="material-symbols-outlined"> location_on</span>&mdash;
            <p>Wilmington, Delaware</p>
          </div>
        </div>
      </div>
      <div class="interests">
        <div class="interests-item">
          <span class="material-symbols-outlined"> import_contacts </span>
          <p>Interests</p>
        </div>
        <div class="interests-item">
          <span class="material-symbols-outlined">
            keyboard_double_arrow_right
          </span>
           Diffusion Models for PDEs
        </div>
        <div class="interests-item">
          <span class="material-symbols-outlined">
            keyboard_double_arrow_right
          </span>
           Inverse Problems
        </div>
      </div>
      <div class="interests-item">
        <span class="material-symbols-outlined">
          keyboard_double_arrow_right
        </span>
           Geometry in Applied Mathematics
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  :global(body),
  :global(body .card) {
    transition: background-color 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
  }
  :global(body.dark) .card {
    background-color: #1e1e1e;
    color: #e0e0e0;
    border-color: #888;
  }

  :global(body.dark) .card-href {
    color: #9fd3c7;
  }

  :global(body.dark) .me {
    border-color: #888;
  }

  :global(body.dark) .contact h3 {
    color: #ffffff;
  }

  :global(body.dark) .contact-item p,
  :global(body.dark) .interests-item {
    color: #d0d0d0;
  }

  :global(body.dark) .material-symbols-outlined {
    color: #bbbbbb;
  }

  .card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  .card {
    display: grid;
    grid-template-columns: repeat(2, 0.5fr);

    border-width: 1px;
    border-color: #2e4057;
    border-style: ridge;
    border-radius: 5px;
    gap: 35px;
    width: 600px;
    height: 400px;
    @media screen and (max-width: 800px) {
      grid-template-columns: none;
      grid-template-rows: 0.25fr 2fr;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 62.5%;
      height: 775px;
    }
    @media screen and (max-width: 600px) {
      font-size: smaller;
    }
    align-items: center;
    justify-content: start;
    color: #2e4057;
    background-color: #fffcf9;
    padding: 35px;
  }

  .card-snd-flexbox {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .card-href {
    text-decoration: none;
    color: #2e4057;
  }

  .portrait {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .me {
    width: 250px;
    border-width: 1px;
    border-color: #2e4057;
    border-style: ridge;
    border-radius: 3px;
  }

  .contact {
    h3 {
      font-family: 'Noto Serif', serif;
      font-size: x-large;
      font-weight: 400;
    }
    &-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }
  }

  .interests {
    line-height: 35px;

    &-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }
  }
</style>
