
// ENS Type:
export type ENSDomain = `${string}.eth`;

/* ========================================================================================================================================================================= */

// Minecraft JSON Interface:
export interface MinecraftJSON {
  worlds: Record<string, WorldInfo>
}

/* ========================================================================================================================================================================= */

// World Interface:
export interface WorldInfo {
  name: string
  timestamp: number
  creator: string
}

/* ========================================================================================================================================================================= */

// Local World Interface:
export interface LocalWorldInfo {
  name: string
  dir: string
  imageSrc: string
}