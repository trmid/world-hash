import { PUBLIC_IPFS_API, PUBLIC_IPFS_GATEWAY } from "$env/static/public";

export async function apiCall(method: string, endpoint: string, params?: URLSearchParams) {
  const url = `${PUBLIC_IPFS_API}${endpoint}${params ? "?" + params.toString() : ""}`;
  console.log(`IPFS API Call: ${method} ${url}`);
  return await fetch(url, { method });
}

export function ipfsFetch(cid: string, path?: string) {
  const url = `${PUBLIC_IPFS_GATEWAY}/ipfs/${cid}/${path ? path : ""}`;
  console.log(`Requesting resource from IPFS: GET ${url}`);
  return fetch(url);
}

export async function isValidCID(cid: string) {
  const res = await apiCall('POST', `/api/v0/cid/format`, new URLSearchParams({ arg: cid }));
  const json = await res.json();
  return !json.ErrorMsg;
}