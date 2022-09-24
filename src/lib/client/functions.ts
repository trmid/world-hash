
// Type Imports:
import type { ENSDomain, WorldInfo, LocalWorldInfo } from '$lib/client/types';

/* ========================================================================================================================================================================= */

// Function to resolve ENS domain to worlds:
export const resolveENS = async (ens: ENSDomain) => {
  const response = await fetch(`/world/resolve/ens/${encodeURI(ens)}`);
  if(response.ok) {
    const jsonFile = (await response.json()) as { cid: string, worlds: Record<string, WorldInfo> };
    return jsonFile.worlds ?? {};
  } else {
    throw new Error('Could not resolve ENS domain.');
  }
}

/* ========================================================================================================================================================================= */

// Function to resolve IPFS CID to worlds:
export const resolveIPFS = async (cid: string) => {
  const response = await fetch(`/world/resolve/ipfs/${encodeURI(cid)}`);
  if(response.ok) {
    const jsonFile = (await response.json()) as { cid: string, worlds: Record<string, WorldInfo> };
    return jsonFile.worlds ?? {};
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
export const resolveWorldFiles = async (ens: ENSDomain, cid: string) => {
  const response = await fetch(`/world/resolve/ens/${encodeURI(ens)}/${encodeURI(cid)}`, { method: 'POST' });
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