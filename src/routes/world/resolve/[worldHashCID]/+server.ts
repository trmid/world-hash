import type { RequestHandler, RouteParams } from './$types';
import { error, json } from '@sveltejs/kit';
import * as ipfs from '$lib/server/ipfs';
import { getSavesDir } from '$lib/server/minecraft';
import { join } from "path";
import * as fs from "fs/promises";

// Resolution Status:
export interface ResolutionStatus {
  status: string, // status message
  progress: number // [0-1]
}

// Function to get a status ID:
function getStatusID(params: RouteParams) {
  return `${params.worldHashCID}`;
}

// Map to store status of a given resolution:
const statusMap = new Map<string, ResolutionStatus>();

/**
 * Begins a resolution of a world with the given worldHashCID from the given world 
 * catalog information and pins it to the local IPFS node as well as copies it to
 * the minecraft saves folder.
 */
export const POST: RequestHandler = async (req) => {

  // Get params:
  const { params } = req;

  // Initialize status:
  const statusID = getStatusID(params);
  console.log(statusMap.get(statusID));
  statusMap.set(statusID, {
    status: "Resolving World...",
    progress: 0.1
  });

  // Check if valid CID:
  if(!await ipfs.isValidCID(params.worldHashCID)) throw error(400, `invalid CID: ${params.worldHashCID}`);

  // Create node LMN filepath:
  const worldLMNPath = `/world-hash/worlds/${params.worldHashCID}`;

  // Copy it to node files:
  const cpRes = await ipfs.cp(`/ipfs/${params.worldHashCID}`, worldLMNPath);
  if(cpRes.status !== 200) return cpRes;

  // Get size of world files:
  const totalBytes = (await (await ipfs.stat(worldLMNPath)).json()).CumulativeSize;
  let bytesCopied = 0;

  // Define helper function for copying files from IPFS node:
  const copyFromNode = async (LMNPath: string, localPath: string) => {

    // Check if dir or file:
    const statRes = await ipfs.stat(LMNPath);
    const isDir = (await statRes.json()).Type === "directory";
    if(isDir) {

      // Create dir:
      await fs.mkdir(localPath);

      // Get files:
      const lsRes = await ipfs.ls(LMNPath);

      // Copy each child file/dir:
      const filenames = (await lsRes.json()).Entries.map((x: any) => x.Name);
      for(const filename of filenames) {
        await copyFromNode(LMNPath + "/" + filename, join(localPath, filename));
      }
    } else {

      // Copy file:
      const res = await ipfs.read(LMNPath);
      const view = new DataView(await res.arrayBuffer());
      await fs.writeFile(localPath, view);
      bytesCopied += view.byteLength;

      // Update status:
      console.log(statusMap.get(statusID));
      statusMap.set(statusID, {
        status: "Copying World Files...",
        progress: 0.6 + 0.4 * (bytesCopied / totalBytes)
      });
    }
  };

  // Copy it to .minecraft/saves:
  const savesDir = await getSavesDir();
  if(!savesDir) throw error(500, "could not find minecraft saves directory");
  try {
    const standardizedCID = await ipfs.formatCID(params.worldHashCID);
    const localWorldDir = join(savesDir, `${standardizedCID.slice(0, 8)}-${new Date(Date.now()).toISOString().replaceAll(":", "-")}`);
    await copyFromNode(worldLMNPath, localWorldDir);
  } catch(err) {
    console.error(err);
    throw error(500, "failed to copy world files from node to minecraft saves");
  }

  

  // Update status:
  console.log(statusMap.get(statusID));
  statusMap.set(statusID, {
    status: "Done!",
    progress: 1
  });

  // Return success:
  return new Response("world resolved!", { status: 200 });
};

/**
 * Gets the current status of the resolution process.
 */
export const GET: RequestHandler = async({ params }) => {
  const status = statusMap.get(getStatusID(params));
  if(!status) throw error(404);
  return json(status);
}