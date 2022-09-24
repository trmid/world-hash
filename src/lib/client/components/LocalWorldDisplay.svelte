<script lang="ts">

	// Imports:
  // :3

  // Type Imports:
  import type { LocalWorldInfo } from '$lib/client/types';

  // Initializations:
  export let world: LocalWorldInfo;

  // Function to add world to share list:
  const shareWorld = () => {
    // <TODO>
  }
	
</script>

<!-- #################################################################################################### -->

<div class="wrapper">

  <!-- World Icon -->
  <img class="icon" src="{world.imageSrc}" alt="World Icon">

  <!-- World Name -->
  <span class="worldName">{world.name}</span>

  <!-- Share Checkbox -->
  <button class="share" on:click={shareWorld}><i class="icofont-plus" /></button>

</div>

<!-- #################################################################################################### -->

<style>

	div.wrapper {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 0 1em 0 .5em;
    color: black;
    background: var(--gold-color);
    outline: 4px solid var(--dark-gold-color);
    overflow: hidden;
  }

  div.wrapper:hover {
    outline: 4px solid var(--nether-accent-color);
  }

  img.icon {
    height: 4em;
    width: 4em;
  }

  span.worldName {
    flex: 1;
    font-size: 1.5em;
  }

  button.share {
    padding: .2em;
    color: black;
    font-size: 1.5em;
    background: none;
    border: none;
    appearance: none;
    cursor: pointer;
  }

  button.share:hover {
    color: var(--nether-accent-color);
  }
	
</style>