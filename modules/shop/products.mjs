import * as configuration from "./configuration.mjs";
const getProductCheckoutLI = name => {
	const prod = configuration.getProduct(name);
	if(prod === undefined)     {return '';}
	if(prod.name === undefined){return '';}

	return '<li>'+prod.price+'&euro; - '+prod.name+'</li>';
};

const getProductPrice = name => {
	const prod = configuration.getProduct(name);
	if(prod === undefined)     {return '';}
	if(prod.name === undefined){return '';}

	return prod.price;
};

export const getCheckoutList = async ctx => {
	let ret ='';
	let netto = 0;
	if(ctx.request.body === undefined){return ret;}
	for(const product in ctx.request.body){
		if(ctx.request.body[product] !== 'orderItem'){continue;}
		ret += getProductCheckoutLI(product);
		netto += getProductPrice(product);
	}
	const brutto = netto / 1.19;
	const mwst = netto - brutto;
	ret = '<ul>'+ret+'</ul>';
	ret += '<p>Brutto: '+brutto.toFixed(2)+'&euro;<br/>';
	ret += 'MwST 19%: '+mwst.toFixed(2)+'&euro;<br/>';
	ret += 'Summe: '+netto.toFixed(2)+'&euro;</p><br/>';
	return ret;
};

export const getCheckoutInputs = ctx => {
	let ret ='';
	if(ctx.request.body === undefined){return ret;}
	for(const product in ctx.request.body){
		if(ctx.request.body[product] !== 'orderItem'){continue;}
		ret += '<input type="hidden" name="'+product+'" value="orderItem"/>'+"\n";
	}
	return ret;
};

export const getLinkList = async ctx => {
	let ret ='';
	if(ctx.request.body === undefined){return ret;}
	for(const name in ctx.request.body){
		if(ctx.request.body[name] !== 'orderItem'){continue;}
		const prod = configuration.getProduct(name);
		if(prod === undefined)     {continue;}
		if(prod.name === undefined){continue;}
		ret += '<li><a href="'+prod.href+'">'+prod.name+'</a></li>';
	}
	ret = '<ul>'+ret+'</ul>';
	return ret;
};
