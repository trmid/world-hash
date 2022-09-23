<script lang="ts">

	// Imports:
  import { resolveENS } from '../functions';
  import WorldDisplay from './WorldDisplay.svelte';

  // Type Imports:
  import type { ENS, World } from '../types';

  // Type Initializations:
  type LoadingStatus = 'none' | 'invalidENS' | 'resolvingENS' | 'resolvingIPFS' | 'done' | 'beef';

  // Initializations:
  const searchPlaceholder: string = 'Search for an ENS domain or IPFS hash...';
  let searchText: string = '';
  let ens: ENS | undefined = undefined;
  let worlds: Record<string, World> = {};
  let status: LoadingStatus = 'none';

  // Reactive World Names:
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
        status = 'resolvingENS';
        ens = searchText as ENS;
        try {
          setTimeout(() => {
            worlds = {
              'bafybeiafpw6e5thyg5c44yrsxnlbxrhbdtdewlcoxx7tm57adbpraifl2efsdfs6fsd76g789dsf6ygh98sdgtsd987gsd896gsd978g67sdg6sd8g6sd8g96sd98g6s9d8g6sd': { name: 'ETHCraft', timestamp: 1663884267 },
              'bafybeiafpw6e5thyg5c44yrsxnlbxrhbdtdewlcoxx7tm57adbpraifl2a': { name: 'TestWorld', timestamp: 1663834267 },
              'bafybeiafpw6e5thyg5c44yrsxnlbxrhbdtdewlcoxx7tm57adbpraifl2b': { name: 'MuhPiggies', timestamp: 1663884067 },
              'bafybeiafpw6e5thyg5c44yrsxnlbxrhbdtdewlcoxx7tm57adbpraifl2e': { name: 'Ok Then', timestamp: 1663184267 }
            }
            status = 'done';
          }, 1000);
          // <TODO> replace placeholders with actual function
          // worlds = await resolveENS(ens);
          // status = 'done';
        } catch(beef) {
          console.error(beef);
          status = 'beef';
        }
      } else {
        status = 'resolvingIPFS';
        try {
          // <TODO> resolve IPFS hash
          status = 'done';
        } catch(beef) {
          console.error(beef);
          status = 'beef';
        }
      }
    }
  }

  // <TODO> need tooltip for portal
	
</script>

<!-- #################################################################################################### -->

<section>

  <!-- Nether Portal -->
  <img src="/images/overworldPortal.png" alt="Nether Portal" id="portal" on:click={scrollDown}>

  <!-- Header -->
  <h1>World Hash</h1>

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
    {:else if status === 'beef'}
      <span class="error">Could not find any worlds</span>
      <img src="/images/beef.png" alt="Beef">
    {/if}
  </div>

  <!-- TODO - need cool from-side animation for each item -->
  <!-- Worlds Display -->
  {#if worldIDs.length > 0}
    <div id="worlds">
      <h3>Found {worldIDs.length.toLocaleString()} worlds</h3>
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

  h1 {
    position: relative;
    margin: 15vh 0 .2em;
    font-family: MinecraftEvenings;
    font-size: 10em;
    letter-spacing: .05em;
    line-height: .8em;
    text-align: center;
    color: white;
    user-select: none;
    background: url('/images/dirt.png');
    background-repeat: no-repeat;
    background-position: top center;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }

  h1:after {
    content: 'World Hash';
    position: absolute;
    inset: 0;
    text-shadow: 4px 4px 10px black;
    z-index: -1;
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
    padding: .5em;
    font: inherit;
    text-align: center;
    background: none;
    border: none;
    appearance: none;
  }

  #search > button {
    position: absolute;
    right: 0;
    padding: .5em 1em;
    font: inherit;
    background: none;
    border: none;
    appearance: none;
    cursor: pointer;
  }

  #search > button.potionOfInvisibility {
    color: transparent;
  }

  input:focus, button:focus {
    outline: none;
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
    gap: 1em;
    width: 45vw;
    margin: 5vh 0 0 5vw;
    isolation: isolate;
  }

  #worlds > h3 {
    font-size: 4em;
    font-weight: normal;
    text-shadow: 2px 2px 5px black;
  }
	
</style>