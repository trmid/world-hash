<script lang="ts">

	// Imports:
  import { resolveENS, resolveIPFS } from '$lib/client/functions';
  import Title from '$lib/client/components/Title.svelte';
  import WorldDisplay from '$lib/client/components/WorldDisplay.svelte';

  // Type Imports:
  import type { ENSDomain, MinecraftJSON } from '$lib/client/types';

  // Type Initializations:
  type LoadingStatus = 'none' | 'invalidENS' | 'invalidIPFS' | 'resolvingENS' | 'resolvingIPFS' | 'done' | 'beef';

  // Initializations:
  const searchPlaceholder: string = 'Search for an ENS domain or IPFS hash...';
  let searchText: string = '';
  let ens: ENSDomain | undefined = undefined;
  let worlds: MinecraftJSON['worlds'] = {};
  let status: LoadingStatus = 'none';

  // Reactive World IDs:
  $: worldIDs = Object.keys(worlds);

  // Function to scroll to bottom of page:
  const scrollDown = () => {
    const mainElement = document.querySelector('main');
    if(mainElement) {
      mainElement.scrollTop += window.innerHeight;
    }
  }

  // Function to search for worlds given an ENS domain or IPFS hash:
  const search = async () => {
    if(searchText && status !== 'resolvingENS' && status !== 'resolvingIPFS') {
      worlds = {};
      if(searchText.endsWith('.eth')) {
        if(searchText.length > 4) {
          status = 'resolvingENS';
          try {
            const data = await resolveENS(searchText as ENSDomain);
            worlds = data.worlds;
            status = 'done';
          } catch(beef) {
            console.error(beef);
            status = 'beef';
          }
        } else {
          status = 'invalidENS';
        }
      } else {
        status = 'resolvingIPFS';
        try {
          const data = await resolveIPFS(searchText);
          worlds = data.worlds;
          status = 'done';
        } catch(beef: any) {
          console.error(beef);
          if(beef.message.includes('Invalid')) {
            status = 'invalidIPFS';
          } else {
            status = 'beef';
          }
        }
      }
    }
  }
	
</script>

<!-- #################################################################################################### -->

<section>

  <!-- Nether Portal -->
  <img src="/images/overworldPortal.png" alt="Nether Portal" id="portal" on:click={scrollDown}>

  <!-- Header -->
  <Title />

  <!-- Search Bar -->
  <form id="search" on:submit|preventDefault={search}>
    <input type="text" bind:value={searchText} placeholder={searchPlaceholder} spellcheck="false">
    <button type="submit" class:potionOfInvisibility={!searchText}>></button>
  </form>

  <!-- Loading Info -->
  <div id="loading">
    {#if status === 'resolvingENS'}
      <span>Resolving worlds from ENS...</span>
      <img class="spin" src="/images/pickaxe.png" alt="Spinning Pickaxe">
    {:else if status === 'resolvingIPFS'}
      <span>Resolving worlds from IPFS...</span>
      <img class="spin" src="/images/pickaxe.png" alt="Spinning Pickaxe">
    {:else if status === 'invalidENS'}
      <span class="error">This doesn't seem to be a valid ENS domain</span>
      <img src="/images/beef.png" alt="Beef">
    {:else if status === 'invalidIPFS'}
      <span class="error">This doesn't seem to be a valid IPFS CID</span>
      <img src="/images/beef.png" alt="Beef">
    {:else if status === 'beef'}
      <span class="error">Could not find any worlds</span>
      <img src="/images/beef.png" alt="Beef">
    {/if}
  </div>

  <!-- Worlds Display -->
  {#if status === 'done'}
    <div id="worlds">
      <h3>Found {worldIDs.length.toLocaleString()} world{worldIDs.length === 1 ? '' : 's'}</h3>
      {#each worldIDs as id}
        <WorldDisplay {ens} {id} world={worlds[id]} />
      {/each}
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
    background: url('/images/overworldBG.png');
    background-repeat: no-repeat;
    background-position: bottom right;
    scroll-snap-align: start;
    overflow: hidden;
    isolation: isolate;
  }

  #portal {
    position: absolute;
    bottom: 177px;
    right: 268px;
    user-select: none;
  }

  #portal:hover {
    filter: drop-shadow(0 0 1.5em var(--accent-color));
    cursor: pointer;
  }

  #search {
    position: relative;
    display: flex;
    width: 50ch;
    margin: 0 auto;
    background: var(--secondary-color);
    border: .2em solid var(--primary-color);
  }

  #search > input {
    flex: 1;
    padding: .5em 3em;
    text-align: center;
  }

  #search > button {
    position: absolute;
    right: 0;
    padding: .5em 1em;
  }

  #search > button.potionOfInvisibility {
    color: transparent;
  }

  #loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
    margin-top: 1em;
  }

  #loading > img {
    height: 1.5em;
    width: 1.5em;
  }

  span.error {
    color: red;
  }

  #worlds {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
    width: 45vw;
    margin: 5vh 0 0 5vw;
    isolation: isolate;
  }

  #worlds h3 {
    font-size: 4em;
    font-weight: normal;
    text-shadow: 2px 2px 5px black;
  }
	
</style>