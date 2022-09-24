
// Type Imports:
import type { ENSDomain, MinecraftJSON, LocalWorldInfo } from '$lib/client/types';

/* ========================================================================================================================================================================= */

// Function to resolve ENS domain to worlds:
export const resolveENS = async (ens: ENSDomain) => {
  const response = await fetch(`/world/catalog/resolve/ens/${encodeURI(ens)}`);
  if(response.ok) {
    const jsonFile = (await response.json()) as { cid: string, data: MinecraftJSON };
    return jsonFile.data ?? {};
  } else {
    throw new Error('Could not resolve ENS domain.');
  }
}

/* ========================================================================================================================================================================= */

// Function to resolve IPFS CID to worlds:
export const resolveIPFS = async (cid: string) => {
  const response = await fetch(`/world/catalog/resolve/ipfs/${encodeURI(cid)}`);
  if(response.ok) {
    const jsonFile = (await response.json()) as { cid: string, data: MinecraftJSON };
    return jsonFile.data ?? {};
  } else {
    if(response.status === 400) {
      throw new Error('Invalid IPFS CID.');
    } else {
      throw new Error('Could not resolve IPFS CID.');
    }
  }
}

/* ========================================================================================================================================================================= */

// Function to resolve world files:
export const resolveWorldFiles = async (cid: string) => {
  const response = await fetch(`/world/resolve/${encodeURI(cid)}`, { method: 'POST' });
  if(response.ok) {
    return true;
  } else {
    throw new Error('Could not resolve world files.');
  }
}

/* ========================================================================================================================================================================= */

// Function to get list of local worlds:
export const getLocalWorlds = async () => {
  const response = await fetch('/world/list');
  if(response.ok) {
    const jsonFile = (await response.json()) as { worlds: LocalWorldInfo[] };
    return jsonFile.worlds;
  } else {
    throw new Error('Could not read local world files.');
  }
}

/* ========================================================================================================================================================================= */

// Function to share world catalog:
export const shareWorldCatalog = async (catalog: MinecraftJSON) => {
  const response = await fetch(`/world/catalog/share`, { method: 'POST', body: JSON.stringify(catalog) });
  if(response.ok) {
    const jsonFile = (await response.json()) as { cid: string };
    return jsonFile.cid;
  } else {
    throw new Error('Could not share world catalog to IPFS.');
  }
}

/* ========================================================================================================================================================================= */

// Function to share world:
export const shareWorld = async (worldDir: string) => {
  const response = await fetch(`/world/share/${encodeURI(worldDir)}`, { method: 'POST' });
  if(response.ok) {
    const jsonFile = (await response.json()) as { cid: string };
    return jsonFile.cid;
  } else {
    throw new Error('Could not share world to IPFS.');
  }
}