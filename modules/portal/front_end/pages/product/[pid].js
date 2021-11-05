import BannerLayout from "components/layouts/BannerLayout";
import Product from "components/marketing/Product";
import styles from "../../components/marketing/ProductList.module.css";
import { useProducts } from "../../contexts/Products";
import { useRouter } from "next/router";

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

const selectProduct = (productTree, id) => {
	const potentialMatch = productTree.find(product => product.id === id);
	if (potentialMatch) {
		return (potentialMatch);
	}
	return null;
};

const Collection = () => {
	const router = useRouter();
	const { pid } = router.query;
	const [{ products }] = useProducts();
	const selection = selectProduct(products, pid);

	let headline = null;
	let allChildren = null;
	let productList = null;

	if (selection) {
		headline = (
			<>
				<div>{ selection.name }</div>
			</>
		);
		allChildren = selection.children;
	}

	if (allChildren) {
		productList = allChildren.map((product, i) => (
			<li className={ styles.item } key={ product.id }>
				<Product { ...product } startWithPreview={ i % 2 === 1 }/>
			</li>
		));
	}

	if (selection) {
		return (
			<BannerLayout className={ styles.home } headline={ headline } height={ selection.previewHeight } image={ selection.previewURL } width={ selection.previewWidth }>
				<div className={ styles.productList }>
					<ul className={ styles.items }>
						{ productList }
					</ul>
				</div>
			</BannerLayout>
		);
	}
	return (
		<div><p>lade...</p></div>
	);
};

export default Collection;
