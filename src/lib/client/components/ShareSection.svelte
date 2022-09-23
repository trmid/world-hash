<script lang="ts">

	// Imports:
  // :3

  // Initializations:
  // :3

  // Function to scroll to top of page:
  const scrollUp = () => {
    const mainElement = document.querySelector('main');
    if(mainElement) {
      mainElement.scrollTop = 0;
    }
  }
	
</script>

<!-- #################################################################################################### -->

<section>
  <!-- <img src="/images/netherPortal.png" alt="Nether Portal" id="portal" on:click={scrollUp}> -->
  section 2
</section>

<!-- #################################################################################################### -->

<style>

	section {
    position: relative;
    height: 100vh;
    width: 100%;
    padding: 2em;
    background: url('/images/netherBG.png');
    background-repeat: no-repeat;
    background-position: top right;
    scroll-snap-align: start;
    overflow: hidden;
    isolation: isolate;
  }

  /* #portal {
    position: absolute;
    bottom: 78px;
    right: 268px;
    user-select: none;
  } */

  /* #portal:hover {
    filter: drop-shadow(0 0 1.5em var(--accent-color));
    cursor: pointer;
  } */
	
</style>