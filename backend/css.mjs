import * as res from './ressources.mjs';

export default true;

export async function get(targetName){
	const mainCSS = await res.get('css',targetName);
	return mainCSS;
}
