<script lang="ts">

  // Type Imports:
  import type { LocalWorldInfo } from '$lib/client/types';

  // Initializations:
  export let world: LocalWorldInfo;
  export let loading: boolean;
  export let onShare: Function;
  let icon: string = `${world.imageSrc}`;
	
</script>

<!-- #################################################################################################### -->

<div class="wrapper">

  <!-- World Icon -->
  <img class="icon" src="{icon}" alt="World Icon" on:error={() => icon = '/images/dirt_block.png'}>

  <!-- World Name -->
  <span class="worldName">{world.name}</span>

  <!-- Share Checkbox -->
  <button class="share" on:click={() => onShare(world)} title="Share World" disabled={loading}>
    {#if loading}
      <img class="spin" src="/images/pickaxe.png" alt="Spinning Pickaxe">
    {:else}
      <i class="icofont-plus" />
    {/if}
  </button>

</div>

<!-- #################################################################################################### -->

<style>

	div.wrapper {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 0 1em 0 .5em;
    color: black;
    background: var(--gold-color);
    border: 4px solid var(--dark-gold-color);
    overflow: hidden;
  }

  div.wrapper:hover {
    border: 4px solid var(--nether-accent-color);
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

  button.share > img {
    height: 1.5em;
    width: 1.5em;
  }
	
</style>