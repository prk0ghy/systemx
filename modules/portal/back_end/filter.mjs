const rawFilters = {"*":{}};

export const filterAdd = (name,fun,order=0) => {
	if(!rawFilters[name]){rawFilters[name] = {};}
	if(!rawFilters[name][order]){rawFilters[name][order] = [];}
	rawFilters[name][order].push(fun);
};

const filterReduce = (pipeline,next) => {
	if(!pipeline.length){return next;}
	const λ = pipeline.pop();
	return filterReduce(pipeline,v => λ(v,next));
};

/* Filters without a filter of order==0 get ignored, this is so we can safely
 * add on to filters defined in other filters and have the whole filter being
 * ignored when a feature is put on the blacklist, for an example look at
 * the userRegistration hook in userMeta.mjs
 */
export const filterBuild = name => {
	if(name === "*"){return null;}
	if(!rawFilters[name] || rawFilters[name][0].length === 0){return null;}
	const pipeline = [];
	const wildcard = rawFilters['*'];
	const specific = rawFilters[name];
	const keys     = Object.keys(wildcard)
		.concat(Object.keys(specific))
		.sort((a,b) => Math.sign(parseInt(a) - parseInt(b)));
	for(const key of keys){
		if(wildcard[key]){pipeline.push(...wildcard[key]);}
		if(specific[key]){pipeline.push(...specific[key]);}
	}
	return filterReduce(pipeline,v => v);
};

export const filterBuildAll = () => {
	const ret = {};
	for(const key of Object.keys(rawFilters)){
		const filter = filterBuild(key);
		if(!filter){continue;}
		ret[key] = filter;
	}
	return ret;
};
export default filterAdd;
