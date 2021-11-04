import { useProducts } from "../contexts/Products";

const Subproducts = (id) => {
	const [{ products }] = useProducts();
	const findProduct = (productTree, id) => {
		const potentialMatch = productTree.find(product => product.id === id);
		if (potentialMatch) {
			return potentialMatch;
		}
		const newProductTree = productTree
			.filter(product => product.children)
			.flatMap(product => product.children, Infinity);
		return findProduct(newProductTree, id);
	};

	return findProduct(products, id);
};

export default Subproducts;
