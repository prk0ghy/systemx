import products from "./productList.mjs";

(() => {
	const visited = {};
	const visit = prods => {
		for (const p of prods) {
			if (visited[p.id]) {
				throw new Error(`Duplicate Product (${p.id}), please give every product a unique ID, otherwise the shop can't distinguish them.`);
			}
			visited[p.id] = true;
			if (p.children) {
				visit(p.children);
			}
		}
	};
	visit(products);
})();

export const findProductRec = (list, id) => {
	if (!list) {
		return null;
	}
	for (const prod of list) {
		if (prod.id === id) {
			return prod;
		}
		const child = findProductRec(prod.children, id);
		if (child) {
			return child;
		}
	}
	return null;
};

/* Using recursive reduce to walk the tree and return the first result matching id */
export const findProduct = id => findProductRec(products, id);

if ((typeof window) !== "undefined") {
	window.findProduct = findProduct;
}

export const getAllProductIDs = () => {
	const ret = {};
	const getProductsRec = a => {
		if(a?.id){
			ret[a.id] = a.id;
		}
		a?.children?.forEach(getProductsRec);
	};
	products.forEach(getProductsRec);
	return Object.keys(ret).map(v => `/product/${v}`);
};

/**
 * @param {string} id
 * @returns {string | undefined}
 */
export const getParentCategory = (id) => {
	for (const p of products) {
		const category = p.children?.find(c => c.id === id);
		if (category) {
			return p.id;
		}
	}
	return undefined;
};
