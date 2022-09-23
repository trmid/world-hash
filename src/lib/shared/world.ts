export interface WorldInfo {
  name: string
  timestamp: number // seconds since UNIX epoch
  creator: string // ENS name (or other identifier in the future)
}

export function isValidWorldInfo(info: WorldInfo) {
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