import type { RequestHandler } from "./$types";
import { error, json } from '@sveltejs/kit';
import { join } from "path";
import { getSavesDir } from "$lib/server/minecraft";
import { addDir, apiCall, cp, stat } from "$lib/server/ipfs";
 
export const POST: RequestHandler = async ({ params, request }) => {

  // Verify world exists:
  const savesDir = await getSavesDir();
  if(!savesDir) throw error(500, "could not find minecraft saves directory");
  
  // Add world files to IPFS:
  const date = new Date(Date.now());
  const ipfsWorldDir = `/world-hash/worlds/${date.toISOString()}`;
  const addRes = await addDir(join(savesDir, params.worldDir));
  for await (const res of addRes) {
    // Only include root additions (no paths with slashes)
    if(!res.path.match(/\//)) {
      const cpRes = await cp(`/ipfs/${res.cid}`, `${ipfsWorldDir}/${res.path}`);
      if(cpRes.status !== 200) return cpRes;
    }
  }

  // Get folder CID:
  const cid = (await (await stat(ipfsWorldDir)).json()).Hash;

  // Pin folder:
  await apiCall("POST", "/api/v0/pin/add", new URLSearchParams({ arg: `/ipfs/${cid}` }));

  // Return world CID:
  return json({ cid });
};