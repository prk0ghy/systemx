import * as res from './ressources.mjs';

export async function get(targetName){
	return res.get('css',targetName);
}
