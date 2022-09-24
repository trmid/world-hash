<script lang="ts">

	// Imports:
  import { resolveWorldFiles } from '$lib/client/functions';

  // Type Imports:
  import type { ENSDomain, WorldInfo } from '$lib/client/types';

  // Initializations:
  export let ens: ENSDomain | undefined;
  export let id: string;
  export let world: WorldInfo;

  // Reactive Date:
  $: date = new Date(world.timestamp * 1000);

  // Function to download world:
  const downloadWorld = async () => {
    if(ens) {
      try {
        // const success = await resolveWorldFiles(ens, id);
      } catch(beef) {
        console.error(beef);
      }
    } else {
      // <TODO> need ipfs hash validation
      try {
        // <TODO> resolve ipfs hash (need a different function)
      } catch(beef) {
        console.error(beef);
      }
    }
  }

  // Function to display world creator:
  const displayCreator = () => {
    if(world.creator !== '' && ens !== world.creator) {
      return ` (by ${world.creator})`;
    } else {
      return '';
    }
  }
	
</script>

<!-- #################################################################################################### -->

<div class="wrapper">

  <!-- World Hash Icon -->
  <img class="icon" src="/logo.svg" alt="World Icon">

  <!-- World Identifiers -->
  <div class="ids">
    <div class="idsWrapper">
      <span class="worldName">{world.name}{displayCreator()}</span>
      <span class="worldHash">{id}</span>
    </div>
  </div>

  <!-- Date -->
  <span class="date">{date.toLocaleString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>

  <!-- Download Button -->
  <button class="download" on:click={downloadWorld}><i class="icofont-download" /></button>

</div>

<!-- #################################################################################################### -->

<style>

	div.wrapper {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 0 1em 0 .5em;
    background: var(--accent-color);
    outline: 4px solid white;
    overflow: hidden;
  }

  div.wrapper:hover {
    outline: 4px solid var(--primary-color);
  }

  img.icon {
    height: 5em;
    width: 5em;
  }

  div.ids {
    position: relative;
    flex: 1;
    height: 5em;
  }

  div.idsWrapper {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  span.worldName {
    font-size: 1.5em;
  }

  span.worldHash {
    width: 100%;
    font-size: .8em;
    word-wrap: break-word;
    max-height: 1.9em;
    opacity: .6;
  }

  button.download {
    padding: .2em;
    font-size: 1.5em;
    background: none;
    border: none;
    appearance: none;
    cursor: pointer;
  }

  button.download:hover {
    color: var(--primary-color);
  }
	
</style>