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
    max-width: 2560px;
    margin: 0 auto;
    overflow: hidden auto;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }

  @media screen and (max-width: 2000px) {
    main {
      font-size: .8em;
    }
  }

  @media screen and (max-width: 1280px) {
    main {
      overflow-x: auto;
    }
  }
	
</style>