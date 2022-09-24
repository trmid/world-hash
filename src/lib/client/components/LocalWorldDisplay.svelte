<script lang="ts">

  // Type Imports:
  import type { LocalWorldInfo } from '$lib/client/types';

  // Initializations:
  export let world: LocalWorldInfo;
  export let onShare: Function;
	
</script>

<!-- #################################################################################################### -->

<div class="wrapper">

  <!-- World Icon -->
  <img class="icon" src="{world.imageSrc}" alt="World Icon">

  <!-- World Name -->
  <span class="worldName">{world.name}</span>

  <!-- Share Checkbox -->
  <button class="share" on:click={() => onShare(world)}><i class="icofont-plus" /></button>

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
    height: 3em;
    width: 3em;
    margin: .5em 0;
    border: 2px solid var(--dark-gold-color);
  }

  span.worldName {
    flex: 1;
    font-size: 1.5em;
  }

  button.share {
    padding: .2em;
    color: black;
    font-size: 1.5em;
  }

  button.share:hover {
    color: var(--nether-accent-color);
  }
	
</style>