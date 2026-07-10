<script lang="ts">
  import { pdfNotes } from '$lib/notes/pdf-manifest';
</script>

<main>
  <section>
    <h1>Jonathan Ma</h1>
  </section>

  <section>
    <h2>About</h2>
    <p>
      I studied mathematics at the University of Delaware, with a focus on
      machine learning and applied mathematics. I currently work as a software
      engineer.
    </p>
    <p>
      Outside of work, I'm a big fan of competitive programming, Olympic weightlifting, and poker.
      In a past life I enjoyed Magic: The Gathering.
    </p>
    <p>
      Apparently I have approximately perfect pitch (49/50 with stddev maybe .1?):
      <a href="https://dialed.gg/sound" target="_blank" rel="noopener noreferrer"
        >dialed.gg/sound</a
      >.
    </p>
    <p>
      My Erdős number is 5 (Ma → Monk → Steiger → Richter → Miklós → Erdős).
    </p>
    <p>
      If you want to get in touch, email me at
      <a href="mailto:johnma@udel.edu">johnma@udel.edu</a>.
    </p>
  </section>

  <section>
    <h2>Notes</h2>
    <p>Some typed-up class notes. (I had a note taking phase.) Let me know if you find any typos.</p>
    <ul>
      {#each pdfNotes as note}
        <li>
          <a href="/notes/{note.fileName}" target="_blank" rel="noopener noreferrer"
            >{note.title}</a
          >
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2>Blog</h2>
    <p>Blog coming soon 🫠</p>
  </section>

  <section>
    <h2>Links</h2>
    <p>
      <a href="https://github.com/jma02" target="_blank" rel="noopener noreferrer"
        >GitHub</a
      >
      ·
      <a
        href="https://linkedin.com/in/ma-jonathan"
        target="_blank"
        rel="noopener noreferrer">LinkedIn</a
      >
      ·
      <a href="https://x.com/jma02_" target="_blank" rel="noopener noreferrer">X</a>
      ·
      <a
        href="https://scholar.google.com/citations?user=X0gJFmAAAAAJ&hl=en"
        target="_blank"
        rel="noopener noreferrer">Scholar</a
      >
      ·
      <a href="mailto:johnma@udel.edu">Email</a>
    </p>
  </section>
</main>

<style lang="scss">
  main {
    max-width: 640px;
    margin: 0 auto;
    padding: 4rem 1.25rem 6rem;
  }

  h1 {
    font-size: clamp(2rem, 6vw, 3rem);
    margin: 0 0 0.5rem;
    font-weight: 600;
  }

  section {
    margin-top: 3rem;
  }

  h2 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #999;
    margin: 0 0 1rem;
    font-weight: 500;
  }

  p,
  li {
    line-height: 1.65;
    color: #c8c8c8;
  }

  ul {
    padding-left: 1.25rem;
    margin: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: #8ecae6;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
