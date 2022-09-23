import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { GET as GETWorldCatalog } from '../+server';
import { apiCall, isValidCID } from '$lib/shared/ipfs';

/**
 * Begins a resolution of a world with the given worldHashCID from the given world 
 * catalog information and pins it to the local IPFS node as well as copies it to
 * the minecraft saves folder.
 */
export const PUT: RequestHandler = async (req) => {

  // Get params:
  const { params } = req;

  // Resolve the world catalog:
  const worldCatalogRes = await GETWorldCatalog(req);
  if(worldCatalogRes.status != 200) {
    return worldCatalogRes;
  }
  const worldCatalog = await worldCatalogRes.json();

  // Check to see if the world hash CID exists in the catalog:
  const worldInfo = worldCatalog.worlds[params.worldHashCID];
  if(!worldInfo) throw error(500, "could not find world hash CID in catalog");

  // Check if valid CID:
  if(!await isValidCID(params.worldHashCID)) throw error(500, `invalid CID: ${params.worldHashCID}`);

  // Copy it to node files:
  const args = new URLSearchParams();
  args.append("arg", `/ipfs/${params.worldHashCID}`);
  args.append("arg", `/world-hash/${params.id}/${worldCatalog.cid}/${params.worldHashCID}`);
  args.set("parents", "true");
  const cpRes = await apiCall("POST", "/api/v0/files/cp", args);
  if(cpRes.status !== 200) return cpRes;

  // Copy it to .minecraft/saves:
  // TODO

  throw error(500);
};

/**
 * Gets the current status of the resolution process.
 */
export const GET: RequestHandler = async({ params }) => {

  // TODO: provide progress of resolution
  return json({ status: 'n/a', progress: 0 });
}