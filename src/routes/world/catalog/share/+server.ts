import type { RequestHandler } from "./$types";
import { error, json } from '@sveltejs/kit';
import { isValidWorldCatalog, type MinecraftJSON } from "$lib/shared/world";
import { addFile, cp } from "$lib/server/ipfs";
 
export const POST: RequestHandler = async ({ request }) => {

  // Validate new catalog:
  const minecraftJSON: MinecraftJSON = await request.json();
  if(!minecraftJSON) throw error(400, "missing json data in body");
  if(!isValidWorldCatalog(minecraftJSON.worlds)) throw error(400, "invalid world catalog");

  // Add the json records to IPFS:
  const addRes = await addFile(JSON.stringify(minecraftJSON));
  const cid = addRes.cid.toString();

  // Save json records to IPFS files:
  const date = new Date(Date.now());
  await cp(`/ipfs/${cid}`, `/world-hash/${date.getFullYear()}/${date.getMonth()}/${date.getDay()}/${cid}.json`);

  // Return catalog CID:
  return json({ cid });
};