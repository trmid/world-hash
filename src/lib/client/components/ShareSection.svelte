<script lang="ts">

	// Imports:
  import { onMount } from 'svelte';
  import { getLocalWorlds } from '$lib/client/functions';
  import Title from '$lib/client/components/Title.svelte';
  import Wallet from '$lib/client/components/Wallet.svelte';
  import LocalWorldDisplay from '$lib/client/components/LocalWorldDisplay.svelte';

  // Type Imports:
  import type { ENSDomain, LocalWorldInfo } from '$lib/client/types';

  // Type Initializations:
  type FileStatus = 'none' | 'reading' | 'done' | 'beef';

  // Initializations:
  let localWorlds: LocalWorldInfo[] = [];
  let fileStatus: FileStatus = 'none';
  let ens: ENSDomain | undefined = undefined;

  // Reactive ENS Contents:
  $: ens, resolveENSContent();

  // Function to scroll to top of page:
  const scrollUp = () => {
    const mainElement = document.querySelector('main');
    if(mainElement) {
      mainElement.scrollTop = 0;
    }
  }

  // Read local world files:
  const readLocalWorldFiles = async () => {
    fileStatus = 'reading';
    try {
      localWorlds.push({ name: 'My Test World', imageSrc: 'file:///C:/Users/Ncookie/AppData/Roaming/.minecraft/saves/Screenshot%20World/icon.png' });
      localWorlds.push({ name: 'MuhCows', imageSrc: 'file:///C:/Users/Ncookie/AppData/Roaming/.minecraft/saves/Screenshot%20World/icon.png' });
      localWorlds.push({ name: 'ETHCraft', imageSrc: 'file:///C:/Users/Ncookie/AppData/Roaming/.minecraft/saves/Screenshot%20World/icon.png' });
      // <TODO> remove placeholders and add actual function
      // localWorlds = await getLocalWorlds();
      fileStatus = 'done';
    } catch(beef) {
      console.error(beef);
      fileStatus = 'beef';
    }
  }

  // Function to read content on ENS:
  const resolveENSContent = async () => {
    // <TODO>
  }

  onMount(async () => {
    readLocalWorldFiles();
    // <TODO> need to check existing minecraft content field
  });
	
</script>

<!-- #################################################################################################### -->

<section>

  <!-- Nether Portal -->
  <!-- <img src="/images/netherPortal.png" alt="Nether Portal" id="portal" on:click={scrollUp}> -->
  
  <!-- Header -->
  <Title preset="corner" />

  <!-- Wallet Connection -->
  <Wallet bind:ens />

  <!-- Local Worlds Display -->
  {#if fileStatus === 'done' && ens}
    <div id="localWorlds">
      <div class="info">
        <h3>Found {localWorlds.length.toLocaleString()} local worlds</h3>
        <button on:click={readLocalWorldFiles}><i class="icofont-refresh" /></button>
      </div>
      {#each localWorlds as world}
        <LocalWorldDisplay {world} />
      {/each}
    </div>
  {:else if fileStatus === 'reading'}
    <div id="loadingLocalWorlds">
      <span>Reading local worlds...</span>
      <img class="spin" src="/images/book.png" alt="Spinning Book">
    </div>
  {:else if fileStatus === 'beef'}
    <div id="localWorldsError">
      <span class="error">Could not read local world files</span>
      <img src="/images/beef.png" alt="Beef">
    </div>
  {/if}

</section>

<!-- #################################################################################################### -->

<style>

	section {
    position: relative;
    height: 100vh;
    width: 100%;
    padding: 2em;
    background: url('/images/netherBG.png');
    background-repeat: no-repeat;
    background-position: top left;
    scroll-snap-align: start;
    overflow: hidden;
    isolation: isolate;
  }

  /* #portal {
    position: absolute;
    top: 78px;
    left: 268px;
    user-select: none;
  } */

  /* #portal:hover {
    filter: drop-shadow(0 0 1.5em var(--accent-color));
    cursor: pointer;
  } */

  #localWorlds {
    display: flex;
    flex-direction: column;
    gap: 1em;
    width: 45vw;
    margin: 5vh 0 0 5vw;
    isolation: isolate;
  }

  #localWorlds h3 {
    font-size: 3em;
    font-weight: normal;
    text-shadow: 2px 2px 5px black;
  }

  span.error {
    color: red;
  }
	
</style>