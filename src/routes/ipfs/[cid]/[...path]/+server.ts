import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { ipfsFetch, isValidCID } from '$lib/server/ipfs';

/**
 * GET
 * 
 * A text proxy gateway for debugging IPFS requests.
 */
export const GET: RequestHandler = async ({ params }) => {

  // Check if CID is valid:
  if(!await isValidCID(params.cid)){
    throw error(400, "invalid CID");
  }

  // Fetch resource:
  const res = await ipfsFetch(params.cid, params.path || undefined);

  // Return result
  return res;
}