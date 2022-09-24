import * as fs from "fs/promises";
import { join } from "path";
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { getSavesDir } from "$lib/server/minecraft";

/**
 * Fetches a list of local worlds from disk.
 * 
 * @returns Response with local world list
 */
export const GET: RequestHandler = async () => {

  // Get saves directory:
  const savesDir = await getSavesDir();
  if(!savesDir) throw error(500, "Missing saves directory...");

  // Get world folders:
  const worlds: { name: string, imageSrc: string }[] = [];
  const dirContents = await fs.readdir(savesDir);
  for(const filename of dirContents) {

    // Check if world dir exists:
    const stat = await fs.stat(join(savesDir, filename));
    if(stat.isDirectory()) {

      // Check if dir contains a level.dat file:
      const levelDatStat = await fs.stat(join(savesDir, filename, "level.dat"));
      if(levelDatStat.isFile()) {
        
        // Push world to list:
        worlds.push({
          name: filename,
          imageSrc: `world/saved/${filename}/icon`
        });
      }
    }
  }
  return json({ worlds });
};