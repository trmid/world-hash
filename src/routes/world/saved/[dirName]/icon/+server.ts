import { getSavesDir } from "$lib/server/minecraft";
import { error } from "@sveltejs/kit";
import * as fs from "fs/promises";
import { join } from "path";
import type { RequestHandler } from './$types';

/**
 * GET
 * 
 * Acts as a proxy for fetching icon.png files from local minecraft saves.
 */
export const GET: RequestHandler = async ({ params }) => {

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