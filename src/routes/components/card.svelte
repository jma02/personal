<div class="card-container">
  <div class="card">
    <div class="portrait">
      <img src="/images/me2.png" class="me" alt="This is me." />
      <p>this is me.</p>
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
          <p>interests</p>
        </div>
        <div class="interests-item">
          <span class="material-symbols-outlined">
            keyboard_double_arrow_right
          </span>
          Scientific ML
        </div>
        <div class="interests-item">
          <span class="material-symbols-outlined">
            keyboard_double_arrow_right
          </span>
          Applied Mathematics
        </div>
      </div>
      <div class="interests-item">
        <span class="material-symbols-outlined">
          keyboard_double_arrow_right
        </span>
        Spectral Graph Theory
      </div>
    </div>
  </div>
</div>

<style lang="scss">
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
