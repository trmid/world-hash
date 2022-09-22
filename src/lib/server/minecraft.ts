import * as fs from "fs/promises";

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