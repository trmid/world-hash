
// ENS Type:
export type ENSDomain = `${string}.eth`;

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