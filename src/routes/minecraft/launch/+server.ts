import { PUBLIC_MINECRAFT_SHORTCUT } from '$env/static/public';
import type { RequestHandler } from './$types';
import { execSync } from 'child_process';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {

  if(!PUBLIC_MINECRAFT_SHORTCUT) {
    return new Response("Minecraft shortcut not set...", { status: 404 });
  }

  try {
    const res = execSync(`Start ${PUBLIC_MINECRAFT_SHORTCUT}`);
  } catch(err) {
    throw error(500, err instanceof Error ? err.message : "Something went wrong...");
  }

  return new Response("Minecraft launched!", { status: 200 });
}