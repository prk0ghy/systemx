import Product from "components/marketing/Product.mjs";
import styles from "./ProductList.css";
import { useProducts } from "contexts/Products.mjs";
export default () => {
	const [{ products }] = useProducts();
	const productList = products.map((product, i) => (
		<li className={ styles.item } key={ product.id }>
			<Product { ...product } startWithPreview={ i % 2 === 1 }/>
		</li>
	));
	return (
		<div className={ styles.productList }>
			<ul className={ styles.items }>
				{ productList }
			</ul>
		</div>
	);
};
