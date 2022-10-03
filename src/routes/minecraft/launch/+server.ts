import type { RequestHandler } from './$types';
import { execSync } from 'child_process';
import { error } from '@sveltejs/kit';
import config from '$lib/server/config';

export const GET: RequestHandler = async () => {

  if(!config.MINECRAFT_SHORTCUT) {
    return new Response("Minecraft shortcut not set...", { status: 404 });
  }

  try {
    execSync(`Start ${config.MINECRAFT_SHORTCUT}`);
  } catch(err) {
    throw error(500, err instanceof Error ? err.message : "Something went wrong...");
  }

  return new Response("Minecraft launched!", { status: 200 });
}