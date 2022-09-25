import type { RequestHandler } from './$types';
import { execSync } from 'child_process';
import { error } from '@sveltejs/kit';
import * as env from '$env/static/public';

export const GET: RequestHandler = async () => {

  if(!env.PUBLIC_MINECRAFT_SHORTCUT) {
    return new Response("Minecraft shortcut not set...", { status: 404 });
  }

  try {
    execSync(`Start ${env.PUBLIC_MINECRAFT_SHORTCUT}`);
  } catch(err) {
    throw error(500, err instanceof Error ? err.message : "Something went wrong...");
  }

  return new Response("Minecraft launched!", { status: 200 });
}