import * as configuration from "./configuration.mjs";
const getProductCheckoutLI = name => {
	let prod = configuration.getProduct(name);
	if(prod === undefined)     {return '';}
	if(prod.name === undefined){return '';}

	return '<li>'+prod.price+'&euro; - '+prod.name+'</li>';
};

const getProductPrice = name => {
	let prod = configuration.getProduct(name);
	if(prod === undefined)     {return '';}
	if(prod.name === undefined){return '';}

	return prod.price;
};

export const getCheckoutList = async ctx => {
	let ret ='';
	let netto = 0;
	if(ctx.request.body === undefined){return ret;}
	for(let product in ctx.request.body){
		if(!ctx.request.body.hasOwnProperty(product)){continue;}
		if(ctx.request.body[product] !== 'orderItem'){continue;}
		ret += getProductCheckoutLI(product);
		netto += getProductPrice(product);
	}
	let brutto = netto / 1.19;
	let mwst = netto - brutto;
	ret = '<ul>'+ret+'</ul>';
	ret += '<p>Brutto: '+brutto.toFixed(2)+'&euro;<br/>';
	ret += 'MwST 19%: '+mwst.toFixed(2)+'&euro;<br/>';
	ret += 'Summe: '+netto.toFixed(2)+'&euro;</p><br/>';
	return ret;
};

export const getCheckoutInputs = ctx => {
	let ret ='';
	if(ctx.request.body === undefined){return ret;}
	for(let product in ctx.request.body){
		if(!ctx.request.body.hasOwnProperty(product)){continue;}
		if(ctx.request.body[product] !== 'orderItem'){continue;}
		ret += '<input type="hidden" name="'+product+'" value="orderItem"/>'+"\n";
	}
	return ret;
};

export const getLinkList = async ctx => {
	let ret ='';
	if(ctx.request.body === undefined){return ret;}
	for(let name in ctx.request.body){
		if(!ctx.request.body.hasOwnProperty(name)){continue;}
		if(ctx.request.body[name] !== 'orderItem'){continue;}
		let prod = configuration.getProduct(name);
		if(prod === undefined)     {continue;}
		if(prod.name === undefined){continue;}
		ret += '<li><a href="'+prod.href+'">'+prod.name+'</a></li>';
	}
	ret = '<ul>'+ret+'</ul>';
	return ret;
};
