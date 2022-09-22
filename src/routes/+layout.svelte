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
	
</style>