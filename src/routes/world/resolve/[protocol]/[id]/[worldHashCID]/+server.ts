import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { GET as GETWorldCatalog } from '../+server';
import { apiCall, isValidCID } from '$lib/server/ipfs';
import { getSavesDir } from '$lib/server/minecraft';
import { join } from "path";
import * as fs from "fs/promises";
import type { WorldInfo } from '$lib/shared/world';

/**
 * Begins a resolution of a world with the given worldHashCID from the given world 
 * catalog information and pins it to the local IPFS node as well as copies it to
 * the minecraft saves folder.
 */
export const POST: RequestHandler = async (req) => {

  // Get params:
  const { params } = req;

  // Resolve the world catalog:
  const worldCatalogRes = await GETWorldCatalog(req);
  if(worldCatalogRes.status != 200) {
    return worldCatalogRes;
  }
  const worldCatalog = await worldCatalogRes.json();

  // Check to see if the world hash CID exists in the catalog:
  const worldInfo: WorldInfo = worldCatalog.worlds[params.worldHashCID];
  if(!worldInfo) throw error(500, "could not find world hash CID in catalog");

  // Check if valid CID:
  if(!await isValidCID(params.worldHashCID)) throw error(400, `invalid CID: ${params.worldHashCID}`);

  // Create node LMN filepath:
  const worldLMNPath = `/world-hash/worlds/${params.worldHashCID}`;

  // Copy it to node files:
  const args = new URLSearchParams();
  args.append("arg", `/ipfs/${params.worldHashCID}`);
  args.append("arg", worldLMNPath);
  args.set("parents", "true");
  const cpRes = await apiCall("POST", "/api/v0/files/cp", args);
  if(cpRes.status !== 200) return cpRes;

  // Define helper function for copying files from IPFS node:
  const copyFromNode = async (LMNPath: string, localPath: string) => {

    // Check if dir or file:
    const statRes = await apiCall("POST", `/api/v0/files/stat`, new URLSearchParams({ arg: LMNPath }));
    const isDir = (await statRes.json()).Type === "directory";
    if(isDir) {

      // Create dir:
      await fs.mkdir(localPath);

      // Get files:
      const lsRes = await apiCall("POST", `/api/v0/files/ls`, new URLSearchParams({ arg: LMNPath }))

      // Copy each child file/dir:
      const filenames = (await lsRes.json()).Entries.map((x: any) => x.Name);
      for(const filename of filenames) {
        await copyFromNode(LMNPath + "/" + filename, join(localPath, filename));
      }
    } else {

      // Copy file:
      const res = await apiCall("POST", "/api/v0/files/read", new URLSearchParams({ arg: LMNPath }));
      const view = new DataView(await res.arrayBuffer());
      await fs.writeFile(localPath, view);
    }
  };

  // Copy it to .minecraft/saves:
  const savesDir = await getSavesDir();
  if(!savesDir) throw error(500, "could not find minecraft saves directory");
  try {
    const standardizedCID = (await (await apiCall("POST", "/api/v0/cid/format", new URLSearchParams({ arg: params.worldHashCID }))).json()).CidStr;
    const localWorldDir = join(savesDir, `${worldInfo.name}-${standardizedCID.slice(0, 8)}-${new Date(Date.now()).toISOString().replaceAll(":", "-")}`);
    await copyFromNode(worldLMNPath, localWorldDir);
  } catch(err) {
    console.error(err);
    throw error(500, "failed to copy world files from node to minecraft saves");
  }

  // Return success:
  return new Response("world resolved!", { status: 200 });
};

/**
 * Gets the current status of the resolution process.
 */
export const GET: RequestHandler = async({ params }) => {

  // TODO: provide progress of resolution
  return json({ status: 'n/a', progress: 0 });
}