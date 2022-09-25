<script lang="ts">

  // Type Imports:
  import type { ENSDomain, WorldInfo } from '$lib/client/types';

  // Initializations:
  export let ens: ENSDomain | undefined;
  export let id: string;
  export let world: WorldInfo;
  export let isNew: boolean;
  export let onThrowWorldInLava: Function;
  export let onChangeCreator: Function;
  let changingCreator: boolean = false;
  let newCreator: string = `${world.creator}`;

  // Reactive Date:
  $: date = new Date(world.timestamp * 1000);
	
</script>

<!-- #################################################################################################### -->

<div class="wrapper">

  <!-- World Hash Icon -->
  <img class="icon" src="/logo.svg" alt="World Icon">

  <!-- World Identifiers -->
  <div class="ids">
    <div class="idsWrapper">
      <span class="worldName">{world.name}</span>
      <span class="worldHash">{id}</span>
      <span class="creator">
        Created by 
        {#if changingCreator}
          <form on:submit|preventDefault={() => { onChangeCreator(id, newCreator); changingCreator = false; }}>
            <input type="text" bind:value={newCreator} spellcheck="false">
            <button type="submit">></button>
          </form>
        {:else}
          {ens === world.creator ? 'you' : world.creator}
          <i class="icofont-edit" on:click={() => changingCreator = true} />
        {/if}
      </span>
    </div>
  </div>

  <!-- Date -->
  <span class="date" class:isNew>{date.toLocaleString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>

  <!-- Delete Button -->
  <button class="delete" on:click={() => onThrowWorldInLava(id)} title="Throw World In Lava"><i class="icofont-trash" /></button>

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
    overflow: hidden;
  }

  span.creator {
    white-space: nowrap;
  }

  span.creator form {
    display: inline-flex;
    gap: .5em;
    height: 1em;
    width: 15em;
  }

  span.creator input {
    color: black;
    width: 100%;
    border-bottom: 2px solid var(--dark-gold-color);
  }

  span.creator button {
    color: black;
  }

  span.creator i {
    cursor: pointer;
  }

  span.creator i:hover {
    color: var(--nether-accent-color);
  }

  span.date {
    position: relative;
    isolation: isolate;
  }

  span.date.isNew::after {
    content: 'new';
    position: absolute;
    inset: 0;
    margin-top: -.5em;
    text-align: center;
    font-size: 3em;
    opacity: .1;
    rotate: -10deg;
    z-index: -1;
  }

  button.delete {
    padding: .2em;
    color: black;
    font-size: 1.5em;
  }

  button.delete:hover {
    color: var(--nether-accent-color);
  }
	
</style>