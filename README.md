![World Hash Banner][banner]

World Hash is an application for sharing and experiencing Minecraft worlds through ENS and IPFS!

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)

## Installation

### Windows

- **Prerequisite:** Make sure you have [Node.js](https://nodejs.org/en/download/) installed.

- **Step 1:** Download the latest [World Hash Launcher](https://github.com/trmid/world-hash/releases/latest).

- **Step 2:** Copy the downloaded `WorldHash.exe` file to a local directory.

- **Step 3:** Run `WorldHash.exe` and wait for the installation process to complete.

- **Step 4:** Enter your configuration options when prompted:

  - **IPFS API URL:** The local API URL of your IPFS node.

  - **IPFS Gateway URL:** The local gateway of your IPFS node.

    *Hint: If you use the brave browser, you can find this information by navigating to: `brave://ipfs-internals/`*

    *Alternatively, if you have the Brave IPFS Companion extension, you can find your URLs by opening the extension:*

    ![Brave IPFS Companion][braveIpfsComp]

  - **Ethereum RPC URL:** Any public or private Ethereum RPC. This is used to fetch public ENS records.

  - **Minecraft Saves Directory:** Your minecraft world saves directory. In most cases, you should accept the default value unless you have explicitly moved your minecraft installation.

  - **Minecraft Shortcut:** *(Optional)* The path to a shortcut (`.lnk`) to start your minecraft launcher.

- **Step 5:** Add World Hash to your Start Menu by right clicking the `WorldHash.exe` file and clicking "*Pin to Start*"

### Mac / Linux

To run World Hash on Mac or Linux, please follow the [Local Development](#local-development) instructions to run it from the command line.

## The Overworld

World Hash's overworld allows you to search for Minecraft worlds from your friends or favorite creators through ENS and IPFS, and download them directly to your minecraft world files if you'd like.

![Overworld][overworld]

## The Nether

World Hash's nether allows you to browse your local Minecraft worlds and share any particularly impressive ones with everyone else!

![Nether][nether]

## Future Additions

There are many improvements that can be made to World Hash, including the following:

- Executables for multiple operating systems.
- Launch button for Minecraft.
- Adding non-primary ENS domain support.
- Adding further IPFS node management options.
- Improved UI/UX.

## Local Development

Install dependencies with `npm i`.

Setup your `config.json` file (an `example.config.json` file is provided).

Run local server with `npm run dev`.

[banner]: /static/banner.png "World Hash Banner"
[braveIpfsComp]: /static/screenshots/braveIpfsComp.png "Brave IPFS Companion"
[overworld]: /static/screenshots/overworld.png "World Hash Overworld"
[nether]: /static/screenshots/nether.png "World Hash Nether"
