<script>
import me from "../../images/me.png";
</script>

<div class="card-container">
    <div class="card">
        <div class="portrait">
            <img
                    src={me}
                    class="me"
                    alt="This is me."
            >
            <p>this is me.</p>
        </div>
        <div class="contact">
            <header><b>Jonathan Ma</b></header>
            <p>currently: @UD, Chatham Financial</p>
            <p>contact: ma.jonathan02@gmail.com</p>
            <p>location: philly area</p>
        </div>
        <div class="interests">
            <b>interests</b>
            <li>Spectral Graph Theory</li>
            <li>Deep Learning</li>
            <li>Full Stack Development</li>
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
    width: 70%;
    color: #2E4057;
    padding: 35px;
    height: 400px;
    background-color: #fffcf9fa;
    border-radius: 10px;
  }

  .portrait {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .me {
    width: 250px;
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
  }

  .interests {
    line-height: 35px;
  }
</style>