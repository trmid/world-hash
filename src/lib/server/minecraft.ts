import * as fs from "fs/promises";
import * as nbt from "./nbt";

/**
 * Finds the minecraft saves directory using appdata environment variable. (Non-windows installations )
 * 
 * @returns Minecraft saves directory or null
 */
export const getSavesDir = async () => {
  const savesDir = process.env.PUBLIC_MINECRAFT_SAVES_DIR || `${process.env.appdata}\\.minecraft\\saves`;
  if(!savesDir || !(await fs.stat(savesDir)).isDirectory()) {
    return null;
  }
  return savesDir;
};

/**
 * Parses the name from a minecraft .dat file.
 * 
 * @param filepath path to the .dat file
 */
export const parseDatFileName = async (filepath: string) => {
  const data = await fs.readFile(filepath);
  return new Promise<string | null>((resolve, reject) => {
    nbt.parse(data, function(error: any, data: any) {
      if (error) reject(error);
      resolve(data?.value?.Data?.value?.LevelName?.value || null);
    });
  });
}