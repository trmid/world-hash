<script lang="ts">

  // Imports:
  import { onMount } from 'svelte';
  
  // Type Imports: 
  import type { ethers } from 'ethers';
  import type { ENS } from '@ensdomains/ensjs';
  import type { ENSDomain } from '$lib/client/types';

  // Initializations:
  export let provider: ethers.providers.JsonRpcProvider;
  export let ensInstance: ENS;
  export let chainID: string | undefined = undefined;
  export let address: string | undefined = undefined;
  // export let ens: ENSDomain | undefined = undefined;
  export let ens: ENSDomain | undefined = 'ncookie.eth'; // <TODO> remove placeholder
  let connecting: boolean = false;

  // Function to check wallet chain ID:
  const checkChainID = async () => {
    try {
      chainID = await (window as any).ethereum.request({ method: 'eth_chainId' });
    } catch {
      console.error('Something went wrong while checking chain ID.');
    }
  }

  // Function to check wallet address:
  const checkAddress = async () => {
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      if(accounts.length > 0) {
        address = accounts[0];
        await checkENS();
      } else {
        address = undefined;
      }
    } catch(beef: any) {
      address = undefined;
      if(beef.code === 4001) {
        console.error('Wallet connection rejected.');
      } else {
        console.error('Something went wrong while connecting to wallet.');
      }
    }
  }

  // Function to check ENS domain for a given wallet address:
  const checkENS = async () => {
    try {
      if(address) {
        const reverseResolution = await ensInstance.withProvider(provider).getName(address); // <TODO> this is failing for some god forsaken reason (reached out on ENS dev channel)
        if(reverseResolution?.name) {
          ens = reverseResolution.name;
        } else {
          ens = undefined;
        }
      } else {
        ens = undefined;
      }
    } catch {
      console.error('Something went wrong while resolving wallet\'s ENS.');
    }
  }

  // Function to connect to wallet:
  const connect = async () => {
    connecting = true;
    await checkChainID();
    await checkAddress();
    connecting = false;
  }

  onMount(async () => {

    // Event handlers:
    if(typeof (window as any).ethereum !== 'undefined') {
      (window as any).ethereum.on('chainChanged', checkChainID);
      (window as any).ethereum.on('accountsChanged', checkAddress);
    }

  });
	
</script>

<!-- #################################################################################################### -->

<div class="wrapper">
  <div id="wallet">
    {#if connecting}
      <span>Connecting...</span>
      <img class="spin" src="/images/redstone.png" alt="Spinning Redstone">
    {:else}
      {#if ens}
        <span>Greetings, {ens}</span>
      {:else if address}
        <div class="ensInfo">
          <span>Hello there, {address.slice(0, 6)}...{address.slice(-4)}!</span>
          <span>It seems that your wallet doesn't resolve to an ENS domain. Get one <a href="https://app.ens.domains/">here</a>, and ensure you set it as your primary domain.</span>
        </div>
      {:else}
        <button id="connectWallet" on:click={connect}>Connect Wallet</button>
      {/if}
    {/if}
  </div>
</div>

<!-- #################################################################################################### -->

<style>

  div.wrapper {
    display: flex;
    justify-content: end;
    padding-right: 2em;
  }

  #wallet {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
    width: 33em;
  }

  #wallet > button {
    padding: .3em 1em;
    color: black;
    font: inherit;
    background: var(--gold-color);
    border: 4px solid var(--dark-gold-color);
    cursor: pointer;
    appearance: none;
  }

  #wallet > button:hover {
    border-color: var(--nether-accent-color);
  }

  a {
    color: var(--gold-color);
    text-decoration: none;
  }

  img {
    height: 2em;
    width: 2em;
  }

  div.ensInfo {
    display: flex;
    flex-direction: column;
    gap: 1em;
    text-align: center;
  }
	
</style>