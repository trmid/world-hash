<script lang="ts">

  // Type Initializations:
  type TitlePreset = 'large' | 'corner';

  // Initializations:
  export let preset: TitlePreset = 'large';
  const title: string = 'World Hash';
	
</script>

<!-- #################################################################################################### -->

<h1 class:large={preset === 'large'} class:corner={preset === 'corner'}>{title}</h1>

<!-- #################################################################################################### -->

<style>

  h1 {
    position: relative;
    font-family: MinecraftEvenings;
    letter-spacing: .05em;
    line-height: .8em;
    color: white;
    user-select: none;
    background: url('/images/dirt.png');
    background-repeat: no-repeat;
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

  h1.large {
    margin: 15vh 0 .2em;
    font-size: 10em;
    text-align: center;
    background-position: top center;
  }

  h1.corner {
    margin: .4em .4em .2em 0;
    padding-top: .1em;
    font-size: 5em;
    text-align: right;
    background-position: top right;
  }

  h1.corner:after {
    padding-top: .1em;
  }
	
</style>