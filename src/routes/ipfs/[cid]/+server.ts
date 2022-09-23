import type { RequestHandler } from './$types';
import { GET as pathGET } from './[...path]/+server';


/**
 * GET
 * 
 * Calls the [path] request with an empty string.
 */
export const GET: RequestHandler = async (e) => {
  e.params.path = "";
  return await pathGET(<any>e);
}