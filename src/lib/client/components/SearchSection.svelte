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

  <!-- Background Video -->
  <video autoplay muted loop id="overworldVideoBG">
    <source src="/videos/overworldVideo.mp4" type="video/mp4">
  </video>

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
      <div class="scrollableList">
        {#each worldIDs as id}
          <WorldDisplay {ens} {id} world={worlds[id]} />
        {/each}
      </div>
    </div>
  {/if}

</section>

<!-- #################################################################################################### -->

<style>

	section {
    position: relative;
    height: min(100vh, 1440px);
    width: max(100%, 1280px);
    margin-top: calc(100vh - min(100vh, 1440px));
    padding: 2em;
    outline: 10px solid black;
    scroll-snap-align: end;
    overflow: hidden;
    isolation: isolate;
  }

  video {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 2560px;
    z-index: -1;
  }

  #portal {
    position: absolute;
    bottom: 248px;
    right: 361px;
    width: 378px;
    opacity: 0.5;
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
  }

  #worlds h3 {
    font-size: 4em;
    font-weight: normal;
    text-shadow: 2px 2px 5px black;
  }

  div.scrollableList {
    display: flex;
    flex-direction: column;
    gap: 1em;
    max-height: 45vh;
    padding-right: 1em;
    overflow: auto;
  }

  div.scrollableList::-webkit-scrollbar {
    display: block;
    width: .8em;
  }

  div.scrollableList::-webkit-scrollbar-track {
    background: var(--primary-color);
    outline: 2px solid white;
  }

  div.scrollableList::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
  }

  @media screen and (max-height: 1050px) {
    div.scrollableList {
      max-height: 35vh;
    }
  }

  @media screen and (max-height: 850px) {
    div.scrollableList {
      max-height: 30vh;
    }
  }

  @media screen and (max-width: 1550px) {
    #worlds h3 {
      font-size: 3em;
      white-space: nowrap;
    }
  }

  @media screen and (max-width: 1280px) {
    #worlds {
      width: 45%;
    }
  }
	
</style>