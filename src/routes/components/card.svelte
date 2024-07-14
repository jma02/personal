<div class="card-container">
  <div class="card">
    <div class="portrait">
      <img src="/images/me2.png" class="me" alt="This is me." />
      <p>this is me.</p>
    </div>
    <div class="card-snd-flexbox">
      <div class="contact">
        <header><b>Jonathan Ma</b></header>
        <div class="contact-item">
          <span class="material-symbols-outlined">school</span>:
          <p>University of Delaware</p>
        </div>
        <div class="contact-item">
          <span class="material-symbols-outlined">mail</span>:
          <a href="mailto:ma.jonathan02@gmail.com" class="card-href"
            >ma.jonathan02@gmail.com</a
          >
        </div>
        <div>
          <div class="contact-item">
            <span class="material-symbols-outlined"> location_on</span>:
            <p>Wilmington, Delaware</p>
          </div>
        </div>
      </div>
      <div class="interests">
        <b>interests</b>
        <li>Spectral Graph Theory</li>
        <li>Algebra (maybe)</li>
        <li>Deep Learning</li>
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
    display: flex;
    gap: 35px;
    @media screen and (max-width: 1200px) {
      flex-direction: column;
      overflow-y: scroll;
      gap: 10px;
    }
    @media screen and (max-width: 450px) {
      font-size: small;
    }
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: min(50%, 600px);
    color: #2e4057;
    padding: 35px;
    height: 400px;
    background-color: #fffcf9;
    border-radius: 10px;
  }

  .card-snd-flexbox {
    display: flex;
    flex-direction: column;
  }

  .card-href {
    text-decoration: none;
    color: #2e4057;
  }

  .portrait {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .me {
    width: 250px;
    border: 1px solid #fffcf9;
    @media screen and (max-width: 450px) {
      width: 100px;
    }
    border-radius: 5%;
  }

  .contact {
    header {
      font-family: 'Noto Serif', serif;
      font-size: x-large;
    }
    &-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .interests {
    line-height: 35px;
  }
</style>
