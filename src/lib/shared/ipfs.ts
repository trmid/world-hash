import { PUBLIC_IPFS_API } from "$env/static/public";
import { join } from "path";


export async function apiCall(method: string, endpoint: string, params?: URLSearchParams) {
  return await fetch(`${PUBLIC_IPFS_API}${join("/", endpoint)}${params ? "?" + params.toString() : ""}`, { method });
}

export async function ipfsFetch(cid: string, path?: string) {
  return await apiCall('GET', `/ipfs/${cid}${path ? join("/", path) : ""}`);
}

export async function isValidCID(cid: string) {
  const res = await apiCall('POST', `/api/v0/cid/format`, new URLSearchParams({ arg: cid }));
  const json = await res.json();
  return !!json.ErrorMsg;
}