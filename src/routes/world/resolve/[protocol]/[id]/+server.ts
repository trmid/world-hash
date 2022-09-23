import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { ethers } from 'ethers';

/**
 * Fetches a list of local worlds from disk.
 * 
 * @returns Response with local world list
 */
export const GET: RequestHandler = async ({ params }) => {

  // CID:
  let cid: string | undefined;

  // Handle ENS identifiers:
  if(params.protocol.match(/^ens$/i)) {
    
    // Fetch content CID from ENS:
    const provider = new ethers.providers.JsonRpcProvider();
    const resolver = await provider.getResolver(params.id);
    const worldHashContent = await resolver?.getText("minecraft");
    if(!worldHashContent) throw error(404, `Could not resolve ENS minecraft field for name: ${params.id}`);
    cid = worldHashContent;
  } 
  
  // Handle IPFS identifiers:
  if(params.protocol.match(/^ipfs$/i)) {
    cid = params.id;
  } else {
    throw error(500, `unsupported protocol: ${params.protocol}`);
  }

  // Check if CID is valid:
  

  throw error(500);
};