<script lang="ts">

	// Imports:
  import { ethers } from 'ethers';
  import { onMount } from 'svelte';
  import { resolverABI } from '$lib/client/ABIs';
  import { getLocalWorlds, resolveENS, shareWorldCatalog, shareWorld } from '$lib/client/functions';
  import Title from '$lib/client/components/Title.svelte';
  import Wallet from '$lib/client/components/Wallet.svelte';
  import ENSWorldDisplay from '$lib/client/components/ENSWorldDisplay.svelte';
  import LocalWorldDisplay from '$lib/client/components/LocalWorldDisplay.svelte';

  // Type Imports:
  import type { ENSDomain, MinecraftJSON, LocalWorldInfo } from '$lib/client/types';

  // Type Initializations:
  type LoadingStatus = 'none' | 'loading' | 'done' | 'beef';

  // Initializations:
  let provider: ethers.providers.JsonRpcProvider | undefined;
  let signer: ethers.providers.JsonRpcSigner | undefined;
  let localWorlds: LocalWorldInfo[] = [];
  let fileStatus: LoadingStatus = 'none';
  let ensResolutionStatus: LoadingStatus = 'none';
  let ipfsShareStatus: LoadingStatus = 'none';
  let txStatus: LoadingStatus = 'none';
  let ens: ENSDomain | undefined = undefined;
  let ensContent: MinecraftJSON = { worlds: {} };
  let worldIDs: string[] = [];
  let newWorldIDs = new Set<string>();
  let catalogCID: string | undefined = undefined;
  let ensContentChanged: boolean = false;
  let localWorldsLoading: string[] = [];

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
    fileStatus = 'loading';
    try {
      localWorlds = await getLocalWorlds();
      fileStatus = 'done';
    } catch(beef) {
      console.error(beef);
      fileStatus = 'beef';
    }
  }

  // Function to read content on ENS:
  const resolveENSContent = async () => {
    if(ens) {
      ensContentChanged = false;
      worldIDs = [];
      newWorldIDs.clear();
      ensResolutionStatus = 'loading';
      try {
        ensContent = await resolveENS(ens);
        Object.keys(ensContent.worlds).forEach(cid => worldIDs = [...worldIDs, cid]);
        ensResolutionStatus = 'done';
      } catch(beef) {
        console.error(beef);
        ensResolutionStatus = 'beef';
      }
    }
  }

  // Function to update worlds on IPFS and ENS:
  const updateWorlds = async () => {
    await updateIPFS();
    await updateENS();
  }

  // Function to update IPFS:
  const updateIPFS = async () => {
    ipfsShareStatus = 'loading';
    try {
      catalogCID = await shareWorldCatalog(ensContent);
      ipfsShareStatus = 'done';
    } catch(beef) {
      console.error(beef);
      ipfsShareStatus = 'beef';
    }
  }

  // Function to update ENS:
  const updateENS = async () => {
    if(provider && signer && ens && catalogCID) {
      txStatus = 'loading';
      try {
        const resolver = await provider.getResolver(ens);
        if(resolver) {
          const nameHash = ethers.utils.namehash(ens);
          let resolverContract = new ethers.Contract(resolver.address, resolverABI, signer);
          let tx = await resolverContract.setText(nameHash, 'minecraft', catalogCID);
          let receipt = await tx.wait();
          if(receipt.status) {
            txStatus = 'done';
            await resolveENSContent();
          } else {
            console.error('Transaction to update ENS failed.');
            txStatus = 'beef';
          }
        } else {
          console.error(`No resolver found for ENS domain: ${ens}`);
          txStatus = 'beef';
        }
      } catch(beef) {
        console.error(beef);
        txStatus = 'beef';
      }
    } else if(provider === undefined) {
      console.error('No provider set for ENS update.');
      txStatus = 'beef';
    } else if(signer === undefined) {
      console.error('No signer set for ENS update.');
      txStatus = 'beef';
    } else if(ens === undefined) {
      console.error('No ENS detected for ENS update.');
      txStatus = 'beef';
    } else {
      console.error('No world catalog CID found for ENS update.');
      txStatus = 'beef';
    }
  }

  // Function to get world hash for newly shared world:
  const getWorldHash = async (world: LocalWorldInfo) => {
    if(ens) {
      localWorldsLoading = [...localWorldsLoading, world.dir];
      const worldHash = await shareWorld(world.dir);
      const name = world.name;
      const timestamp = Date.now() / 1000;
      const creator = ens;
      ensContent.worlds[worldHash] = { name, timestamp, creator };
      ensContentChanged = true;
      worldIDs = [...worldIDs, worldHash];
      newWorldIDs.add(worldHash);
      localWorldsLoading = localWorldsLoading.filter(dir => dir !== world.dir);
    }
  }

  // Function to remove world hash from ENS content:
  const hideWorld = async (cid: string) => {
    if(ensContent.worlds[cid]) {
      delete ensContent.worlds[cid];
      worldIDs = worldIDs.filter(id => id !== cid);
      ensContentChanged = true;
    }
    if(newWorldIDs.has(cid)) {
      newWorldIDs.delete(cid);
    }
  }

  // Function to update world creator:
  const updateNotch = (cid: string, newCreator: string) => {
    if(ensContent.worlds[cid]) {
      ensContent.worlds[cid].creator = newCreator;
      ensContentChanged = true;
    }
  }

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
  <Wallet bind:provider bind:signer bind:ens />

  <!-- Main Content -->
  <div class="content">

    <!-- Local Worlds Display -->
    {#if ens}
      <div id="localWorlds">
        <div class="info">
          <h3>Found {localWorlds.length.toLocaleString()} local world{localWorlds.length === 1 ? '' : 's'}</h3>
          <button on:click={readLocalWorldFiles} title="Re-Fetch Local Worlds"><i class="icofont-loop" /></button>
        </div>
        {#each localWorlds as world}
          <LocalWorldDisplay loading={localWorldsLoading.includes(world.dir)} onShare={getWorldHash} {world} />
        {/each}
      </div>
    {/if}

    <!-- ENS Content -->
    {#if ens}
      <div id="ensContent">
        <h3>Your ENS content</h3>
        {#if worldIDs.length > 0}
          {#each worldIDs as id}
            <ENSWorldDisplay onThrowWorldInLava={hideWorld} onChangeCreator={updateNotch} {ens} {id} world={ensContent.worlds[id]} isNew={newWorldIDs.has(id)} />
          {/each}
        {:else if ensResolutionStatus === 'loading'}
          <span>Loading your ENS contents...</span>
        {:else}
          <span>You don't seem to have any worlds up on ENS yet!</span>
        {/if}
        <button on:click={updateWorlds} disabled={!ensContentChanged || worldIDs.length === 0 || ipfsShareStatus === 'loading' || txStatus === 'loading'}>
          {#if ipfsShareStatus === 'loading'}
            Sharing on IPFS...
          {:else if txStatus === 'loading'}
            Updating ENS...
          {:else}
            Update ENS
          {/if}
        </button>
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

  button:hover:not(:disabled) {
    outline-color: var(--nether-accent-color);
  }

  button:disabled {
    filter: grayscale(.7) brightness(.7);
  }

  div.info > button {
    margin-top: .2em;
    padding: 0 .2em;
    font-size: 2em;
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