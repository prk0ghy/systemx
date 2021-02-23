import * as res from './ressources.mjs';

export default true;

export async function get(targetName){
	const mainJS = await res.get('js',targetName);
	return mainJS;
}
