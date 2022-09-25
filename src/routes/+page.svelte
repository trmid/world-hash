<script lang="ts">

	// Imports:
  import ShareSection from '$lib/client/components/ShareSection.svelte';
  import SearchSection from '$lib/client/components/SearchSection.svelte';
	
</script>

<!-- #################################################################################################### -->

<!-- SvelteKit Dynamic Header -->
<svelte:head>
	<title>World Hash</title>
	<meta name="description" content="The toolkit for sharing Minecraft worlds through ENS and IPFS." />
</svelte:head>

<!-- Search Section -->
<SearchSection />

<div id="bedrockLayer" />

<!-- Share Section -->
<ShareSection />

<!-- #################################################################################################### -->

<style>

	#bedrockLayer {
		height: 25vh;
		background: url('/images/bedrock.png');
	}
	
</style>