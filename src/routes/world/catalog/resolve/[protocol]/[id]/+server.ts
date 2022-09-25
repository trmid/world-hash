import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { ethers } from 'ethers';
import { ipfsFetch, isValidCID } from '$lib/server/ipfs';
import { isValidWorldInfo, type MinecraftJSON, type WorldCatalog, type WorldInfo } from '$lib/shared/world';

/**
 * Resolves a world catalog from a CID or ENS name.
 * 
 * @returns JSON response with world catalog.
 */
export const GET: RequestHandler = async ({ params }) => {

  // CID:
  let cid: string | undefined;

  // Handle ENS identifiers:
  if(params.protocol.match(/^ens$/i)) {
    
    // Fetch content CID from ENS:
    const provider = new ethers.providers.JsonRpcProvider(process.env.PUBLIC_ETHEREUM_RPC_URL || "https://cloudflare-eth.com");
    const resolver = await provider.getResolver(params.id);
    const worldHashContent = await resolver?.getText("minecraft");
    if(!worldHashContent) throw error(404, `Could not resolve ENS minecraft field for name: ${params.id}`);
    const uriMatch = worldHashContent.match(/^(\/ipfs\/|ipfs\:\/\/)(.+)/);
    cid = uriMatch ? uriMatch[2] : worldHashContent;
  }
  // Handle IPFS identifiers:
  else if(params.protocol.match(/^ipfs$/i)) {
    cid = params.id;
  }
  // Unknown Protocol:
  else {
    throw error(500, `unsupported protocol: ${params.protocol}`);
  }

  // Check if CID is valid:
  if(!await isValidCID(cid)) throw error(400, `invalid CID: ${cid}`);

  // Resolve JSON directory:
  let minecraftJSON: MinecraftJSON = { worlds: {} };
  try {
    minecraftJSON = await (await ipfsFetch(cid)).json();
  } catch(err) {
    console.error(err);
    throw error(500, `failed to resolve JSON from CID: ${cid}`);
  }
  
  // Validate world info:
  for(const [cid, info] of Object.entries(minecraftJSON.worlds)) {
    if(!await isValidCID(cid) && isValidWorldInfo(info)) {
      throw error(500, "resolved invalid world info");
    }
  }

  // Return worlds:
  return json({ cid, data: minecraftJSON });
};