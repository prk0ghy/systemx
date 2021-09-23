const rawFilters = {"*":{}};

/* Adds a filter λ to a named action, it is important that
 * there is at least one λ of the default order 0, otherwise
 * the whole filter will be skipped. It is also possible to add
 * multiple filters to the same order, though then their order
 * within the same value is undefined.
 */
export const add = (name,fun,order=0) => {
	if(!rawFilters[name]){rawFilters[name] = {};}
	if(!rawFilters[name][order]){rawFilters[name][order] = [];}
	rawFilters[name][order].push(fun);
};
export default add;

/* Reduces an array of λs into a single λ that when called
 * calls them all in order, with the first argument being
 * threaded through and the second argument always being the
 * next function, with the last one being an identity function
 * eg. (v => v)
 */
const reduce = (pipeline,next) => {
	if(!pipeline.length){return next;}
	const λ = pipeline.pop();
	return reduce(pipeline,v => λ(v,next));
};

/* Filters without a filter of order==0 get ignored, this is so we can safely
 * add on to filters defined in other filters and have the whole filter being
 * ignored when a feature is put on the blacklist, for an example look at
 * the userRegistration hook in userMeta.mjs
 */
export const build = name => {
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
	return reduce(pipeline,v => v);
};

/* Build all filters into callable λs and return an
 * object containing all of them.
 */
export const buildAll = () => {
	const ret = {};
	for(const key of Object.keys(rawFilters)){
		const filter = build(key);
		if(!filter){continue;}
		ret[key] = filter;
	}
	return ret;
};
