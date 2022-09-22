<script lang="ts">

	// Imports:
  // :3

  // Initializations:
  // :3

  // Function to scroll to bottom of page:
  const scrollDown = () => {
    const mainElement = document.querySelector('main');
    if(mainElement) {
      mainElement.scrollTop += window.innerHeight;
    }
  }
	
</script>

<!-- #################################################################################################### -->

<!-- SvelteKit Dynamic Header -->
<svelte:head>
	<title>World Hash</title>
	<meta name="description" content="The toolkit for sharing Minecraft worlds through ENS and IPFS." />
</svelte:head>

<!-- Search Section -->
<section id="searchSection">
  section 1
  <img src="/images/portal.png" alt="Nether Portal" id="portal" on:click={scrollDown}>
</section>

<!-- Share Section -->
<section id="shareSection">
  section 2
</section>

<!-- #################################################################################################### -->

<style>

	section {
    position: relative;
    height: 100vh;
    width: 100%;
    padding: 2em;
    scroll-snap-align: start;
    overflow: hidden;
    isolation: isolate;
  }

  #searchSection {
    background: url('/images/minecraftBG.png');
    background-repeat: no-repeat;
    background-position: top right;
  }

  #portal {
    position: absolute;
    bottom: 78px;
    right: 268px;
  }

  #portal:hover {
    filter: drop-shadow(0 0 1.5em var(--secondary-color));
    cursor: pointer;
  }

  #shareSection {
    background: url('/images/netherBG.png');
    background-repeat: no-repeat;
    background-position: top right;
  }
	
</style>