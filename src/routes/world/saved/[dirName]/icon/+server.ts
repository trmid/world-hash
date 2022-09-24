import { getSavesDir } from "$lib/server/minecraft";
import type { WorldInfo } from "$lib/shared/world";
import { error } from "@sveltejs/kit";
import * as fs from "fs/promises";
import { join } from "path";
import { GET as GETLocalWorlds } from "../../../list/+server";
import type { RequestHandler } from './$types';

/**
 * GET
 * 
 * Acts as a proxy for fetching icon.png files from local minecraft saves.
 */
export const GET: RequestHandler = async ({ params }) => {

  // Check if world exists:
  const worlds: WorldInfo[] = (await (await GETLocalWorlds(<any>{})).json()).worlds;
  if(!worlds.filter(x => x.name === params.dirName)[0]) throw error(500, "local world list does not contain the given world name");

  // Get the file path:
  const savesDir = await getSavesDir();
  if(!savesDir) throw error(500, "couldn't find minecraft saves directory");
  const path = join(savesDir, params.dirName, "icon.png");

  // Check if the file exists:
  if(!(await fs.stat(path)).isFile()) throw error(404);

  // Get the file data:
  const buffer = await fs.readFile(path);
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png"
    }
  });
};