<script lang="ts">

	// Imports:
  import '../app.css';
	
</script>

<!-- #################################################################################################### -->

<!-- App Content -->
<main><slot /></main>

<!-- #################################################################################################### -->

<style>

	main {
    position: relative;
    height: 100vh;
    overflow: hidden auto;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }

  @media screen and (max-width: 1280px) {
    main {
      overflow-x: auto;
    }
  }
	
</style>