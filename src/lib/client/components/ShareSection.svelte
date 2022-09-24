<script lang="ts">

	// Imports:
  import { ethers } from 'ethers';
  import { onMount } from 'svelte';
  import { ENS } from '@ensdomains/ensjs';
  import { getLocalWorlds, resolveENS } from '$lib/client/functions';
  import Title from '$lib/client/components/Title.svelte';
  import Wallet from '$lib/client/components/Wallet.svelte';
  import ENSWorldDisplay from '$lib/client/components/ENSWorldDisplay.svelte';
  import LocalWorldDisplay from '$lib/client/components/LocalWorldDisplay.svelte';

  // Type Imports:
  import type { ENSDomain, LocalWorldInfo, WorldInfo } from '$lib/client/types';

  // Type Initializations:
  type LoadingStatus = 'none' | 'loading' | 'done' | 'beef';

  // Initializations:
  const rpcURL: string = 'https://cloudflare-eth.com/';
  let localWorlds: LocalWorldInfo[] = [];
  let fileStatus: LoadingStatus = 'none';
  let ensContentStatus: LoadingStatus = 'none';
  let ens: ENSDomain | undefined = undefined;
  let ensContent: Record<string, WorldInfo> = {};

  // Initializing Provider & ENS Instance:
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  const ensInstance = new ENS();

  // Reactive ENS Contents:
  $: ens, resolveENSContent();
  $: ensWorldIDs = Object.keys(ensContent);

  // Function to scroll to top of page:
  const scrollUp = () => {
    const mainElement = document.querySelector('main');
    if(mainElement) {
      mainElement.scrollTop = 0;
    }
  }

  // Read local world files:
  const readLocalWorldFiles = async () => {
    fileStatus = 'loading';
    try {
      localWorlds = [
        { name: 'My Test World', dir: 'something', imageSrc: 'https://assets.reedpopcdn.com/pack__1_.png/BROK/resize/1200x1200%3E/format/jpg/quality/70/pack__1_.png' },
        { name: 'MuhCows', dir: 'something', imageSrc: 'https://assets.reedpopcdn.com/pack__1_.png/BROK/resize/1200x1200%3E/format/jpg/quality/70/pack__1_.png' },
        { name: 'ETHCraft', dir: 'something', imageSrc: 'https://assets.reedpopcdn.com/pack__1_.png/BROK/resize/1200x1200%3E/format/jpg/quality/70/pack__1_.png' }
      ];
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
    if(ens) {
      ensContentStatus = 'loading';
      try {
        ensContent = {
          'bafybeiafpw6e5thyg5c44yrsxnlbxrhbdtdewlcoxx7tm57adbpraifl2c': { name: 'ETHCraft', timestamp: 1663884267, creator: 'ncookie.eth' },
          'bafybeiafpw6e5thyg5c44yrsxnlbxrhbdtdewlcoxx7tm57adbpraifl2a': { name: 'TestWorld', timestamp: 1663834267, creator: 'ncookie.eth' },
          'bafybeiafpw6e5thyg5c44yrsxnlbxrhbdtdewlcoxx7tm57adbpraifl2b': { name: 'MuhPiggies', timestamp: 1663884067, creator: 'ncookie.eth' },
          'bafybeiafpw6e5thyg5c44yrsxnlbxrhbdtdewlcoxx7tm57adbpraifl2e': { name: 'Ok Then', timestamp: 1663184267, creator: 'ncookie.eth' }
        }
        // <TODO> replace placeholders with actual function
        // ensContent = await resolveENS(ens);
        ensContentStatus = 'done';
      } catch(beef) {
        console.error(beef);
        ensContentStatus = 'beef';
      }
    }
  }

  // Function to update worlds on IPFS and ENS:
  const updateWorlds = async () => {
    // <TODO> send worlds to `pin to ipfs` endpoint and get CID
  }

  // <TODO> need function to give new json file to backend and get catalog CID
  // <TODO> need function to update ens with new CID

  onMount(async () => {
    readLocalWorldFiles();
  });
	
</script>

<!-- #################################################################################################### -->

<section>

  <!-- Nether Portal -->
  <!-- <img src="/images/netherPortal.png" alt="Nether Portal" id="portal" on:click={scrollUp}> -->
  
  <!-- Header -->
  <Title preset="corner" />

  <!-- Wallet Connection -->
  <Wallet {provider} {ensInstance} bind:ens />

  <!-- Main Content -->
  <div class="content">

    <!-- Local Worlds Display -->
    {#if fileStatus === 'done' && ens}
      <div id="localWorlds">
        <div class="info">
          <h3>Found {localWorlds.length.toLocaleString()} local worlds</h3>
          <button on:click={readLocalWorldFiles}><i class="icofont-loop" /></button>
        </div>
        {#each localWorlds as world}
          <LocalWorldDisplay {world} />
        {/each}
      </div>
    {:else if fileStatus === 'loading'}
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

    <!-- ENS Content -->
    {#if ensContentStatus === 'done' && ens}
      <div id="ensContent">
        <h3>Your ENS content</h3>
        {#if ensWorldIDs.length > 0}
          {#each ensWorldIDs as id}
            <ENSWorldDisplay {id} world={ensContent[id]} />
          {/each}
        {:else}
          <span>You don't seem to have any worlds up on ENS yet!</span>
        {/if}
        <button on:click={updateWorlds}>Update ENS</button>
      </div>
    {/if}

  </div>

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

  div.content {
    display: flex;
    justify-content: space-between;
    gap: 2em;
  }

  #localWorlds {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
    width: 35vw;
    margin: 25vh 0 0 5vw;
    isolation: isolate;
  }

  div.info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2em;
  }

  h3 {
    font-size: 3em;
    font-weight: normal;
    text-shadow: 2px 2px 5px black;
  }

  button {
    color: black;
    background: var(--gold-color);
    outline: 4px solid var(--dark-gold-color);
  }

  button:hover {
    outline-color: var(--nether-accent-color);
  }

  div.info > button {
    margin-top: .2em;
    padding: 0 .2em;
    font-size: 2em;
  }

  span.error {
    color: red;
  }

  #ensContent {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
    width: 40vw;
    margin: 10vh 5vw 0 0;
  }

  #ensContent > button {
    padding: .5em 1em;
  }
	
</style>