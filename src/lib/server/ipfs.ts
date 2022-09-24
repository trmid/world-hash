import { PUBLIC_IPFS_API, PUBLIC_IPFS_GATEWAY } from "$env/static/public";
import { create, globSource } from "ipfs-http-client";

const client = create({ url: PUBLIC_IPFS_API });

export async function apiCall(method: string, endpoint: string, params?: URLSearchParams, body?: BodyInit) {
  const url = `${PUBLIC_IPFS_API}${endpoint}${params ? "?" + params.toString() : ""}`;
  console.log(`IPFS API Call: ${method} ${url}`);
  return await fetch(url, { method, body });
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

export async function formatCID(cid: string): Promise<string> {
  const res = await apiCall("POST", "/api/v0/cid/format", new URLSearchParams({ arg: cid }));
  const json = await res.json();
  if(json.ErrorMsg) throw new Error(json.ErrorMsg);
  return json.CidStr;
}

export function cp(from: string, to: string) {
  const args = new URLSearchParams();
  args.append("arg", from);
  args.append("arg", to);
  args.set("parents", "true");
  return apiCall("POST", "/api/v0/files/cp", args);
}

export function read(filepath: string) {
  return apiCall("POST", "/api/v0/files/read", new URLSearchParams({ arg: filepath }));
}

export function ls(path: string) {
  return apiCall("POST", `/api/v0/files/ls`, new URLSearchParams({ arg: path }))
}

export function stat(path: string) {
  return apiCall("POST", `/api/v0/files/stat`, new URLSearchParams({ arg: path }));
}

export async function addDir(path: string) {

  return client.addAll(globSource(path, "**/*"));
  
}

export function addFile(data: any) {

  return client.add(data);
}