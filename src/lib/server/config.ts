import * as fs from "fs"

export interface Config {
  IPFS_API: string
  IPFS_GATEWAY: string
  ETHEREUM_RPC_URL: string
  MINECRAFT_SAVES_DIR: string
  MINECRAFT_SHORTCUT: string | null
}

// Read config json in sync so it's ready on app load:
const config: Config = JSON.parse(fs.readFileSync("config.json", { encoding: 'utf8' }));

// Remove trailing slashes on API and GATEWAY:
const trailingSlashRegex = /\/+$/;
config.IPFS_API = config.IPFS_API.replace(trailingSlashRegex, "");
config.IPFS_GATEWAY = config.IPFS_GATEWAY.replace(trailingSlashRegex, "");

// Export as default:
export default config;
