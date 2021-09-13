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

export const filterBuild = name => {
	if(name === "*"){return v => v;}
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
		ret[key] = filterBuild(key);
	}
	return ret;
};
export default filterAdd;
