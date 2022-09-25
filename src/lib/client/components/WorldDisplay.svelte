<script lang="ts">

	// Imports:
  import { resolveWorldFiles } from '$lib/client/functions';

  // Type Imports:
  import type { ENSDomain, WorldInfo } from '$lib/client/types';

  // Type Initializations:
  type LoadingStatus = 'none' | 'loading' | 'done' | 'beef';

  // Initializations:
  export let ens: ENSDomain | undefined;
  export let id: string;
  export let world: WorldInfo;
  let downloadStatus: LoadingStatus = 'none';

  // Reactive Date:
  $: date = new Date(world.timestamp * 1000);

  // Function to download world:
  const downloadWorld = async () => {
    downloadStatus = 'loading';
    try {
      const success = await resolveWorldFiles(id);
      if(success) {
        downloadStatus = 'done';
      } else {
        downloadStatus = 'beef';
      }
    } catch(beef) {
      console.error(beef);
      downloadStatus = 'beef';
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
  <button class="download" on:click={downloadWorld} title="Download World" disabled={downloadStatus !== 'none'}>
    {#if downloadStatus === 'done'}
      <i class="icofont-ui-check" />
    {:else if downloadStatus === 'beef'}
      <i class="icofont-ui-close" />
    {:else if downloadStatus === 'loading'}
      <img class="spin" src="/images/pickaxe.png" alt="Spinning Pickaxe">
    {:else}
      <i class="icofont-download" />
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
    background: var(--accent-color);
    border: 4px solid white;
    overflow: hidden;
  }

  div.wrapper:hover {
    border: 4px solid var(--primary-color);
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
  }

  button.download:hover {
    color: var(--primary-color);
  }

  button.download > img {
    height: 1.5em;
    width: 1.5em;
  }
	
</style>