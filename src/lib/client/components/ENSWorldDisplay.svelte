<script lang="ts">

  // Type Imports:
  import type { WorldInfo } from '$lib/client/types';

  // Initializations:
  export let id: string;
  export let world: WorldInfo;
  export let onThrowWorldInLava: Function;

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
    </div>
  </div>

  <!-- Date -->
  <span class="date">{date.toLocaleString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>

  <!-- Delete Button -->
  <button class="delete" on:click={() => onThrowWorldInLava(id)} title="Throw World In Lava"><i class="icofont-trash" /></button>

</div>

<!-- #################################################################################################### -->

<style>

	div.wrapper {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 0 1em 0 .5em;
    color: black;
    background: var(--gold-color);
    outline: 4px solid var(--dark-gold-color);
    overflow: hidden;
  }

  div.wrapper:hover {
    outline: 4px solid var(--nether-accent-color);
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

  button.delete {
    padding: .2em;
    color: black;
    font-size: 1.5em;
  }

  button.delete:hover {
    color: var(--nether-accent-color);
  }
	
</style>