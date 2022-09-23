
// Type Imports:
import type { ENS, World } from './types';

/* ========================================================================================================================================================================= */

// Function to resolve ENS domain to worlds:
export const resolveENS = async (ens: ENS) => {
  const response = await fetch(`/world/resolve/ens/${encodeURI(ens)}`);
  if(response.ok) {
    const worlds = (await response.json()) as Record<string, World>;
    return worlds;
  } else {
    throw new Error('Could not resolve ENS domain.');
  }
}

/* ========================================================================================================================================================================= */

// Function to resolve world files:
export const resolveWorldFiles = async (ens: ENS, cid: string) => {
  const response = await fetch(`/world/resolve/ens/${encodeURI(ens)}/${encodeURI(cid)}`);
  if(response.ok) {
    return true;
  } else {
    throw new Error('Could not resolve world files.');
  }
}