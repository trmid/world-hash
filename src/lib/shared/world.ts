export type WorldCatalog = Record<string, WorldInfo>

export interface MinecraftJSON {
  worlds: WorldCatalog
}

export interface WorldInfo {
  name: string
  timestamp: number // seconds since UNIX epoch
  creator: string // ENS name (or other identifier in the future)
}

export function isValidWorldCatalog(catalog: WorldCatalog): catalog is WorldCatalog {
  if(typeof catalog !== "object") return false;
  for(const key in catalog) {
    if(!isValidWorldInfo(catalog[key])) return false;
  }
  return true;
}

export function isValidWorldInfo(info: WorldInfo): info is WorldInfo {
  return (
    typeof info === 'object' &&
    typeof info.name === 'string' &&
    typeof info.timestamp === 'number' &&
    (
      typeof info.creator === 'undefined' ||
      typeof info.creator === 'string'
    )
  );
}