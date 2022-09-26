![World Hash Banner][banner]

World Hash is a toolkit for sharing and experiencing Minecraft worlds through ENS and IPFS!

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)

## Setup

While a simple `.exe` is in development, you can try out World Hash right now by doing the following:

- **Step 1:** Clone this repo to your computer.

- **Step 2:** Make sure you have [Node](https://nodejs.org/en/download/) installed.

- **Step 3:** Setup your environment variables.

  This means setting some variables on a `.env` file. We provide a `.env.example` file that should let you know what our app is looking for. The `PUBLIC_MINECRAFT_SHORTCUT` variable is currently optional!

  If you have the Brave IPFS Companion extension, you can find your addresses really easily:

  ![Brave IPFS Companion][braveIpfsComp]

- **Step 4:** Run `npm i` to install World Hash's dependencies.

- **Step 5:** Run `npm run build` to build the app.

- **Step 6:** Run `npm start` to start your decentralized Minecraft journey!

## The Overworld

World Hash's overworld allows you to search for Minecraft worlds from your friends or favorite creators through ENS and IPFS, downloading them to your computer if you'd like.

![Overworld][overworld]

## The Nether

World Hash's nether allows you to browse your local Minecraft worlds, and share any particularly impressive ones with everyone else!

![Nether][nether]

## Future Additions

There are many improvements that can be made to World Hash, including the following:

- Executable package for multiple operating systems.
- Launch button for Minecraft.
- Adding non-primary ENS domain support.
- Adding further IPFS node managament options.
- Improved UI/UX.

## Local Development

Install dependencies with `npm i`.

Setup your `.env` file (an example file is provided).

Run local server with `npm run dev`.

[banner]: /static/banner.png "World Hash Banner"
[braveIpfsComp]: /static/screenshots/braveIpfsComp.png "Brave IPFS Companion"
[overworld]: /static/screenshots/overworld.png "World Hash Overworld"
[nether]: /static/screenshots/nether.png "World Hash Nether"
