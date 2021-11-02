import Product from "components/marketing/Product";
import styles from "./ProductList.module.css";
import { useProducts } from "contexts/Products";
const ProductList = ({
	tagesb,
	ToggleTagesb
}) => {
	const [{ products }] = useProducts();
	const productList = products.map((product, i) => (
		<li className={ styles.item } key={ product.id }>
			<Product ToggleTagesb={ ToggleTagesb } tagesb={ tagesb } { ...product } startWithPreview={ i % 2 === 1 }/>
		</li>
	));

	return (
		<div className={ styles.productList }>
			<ul className={ styles.items }>
				{ tagesb
					? (
						<p>Children</p>
					)
					: productList
				}
			</ul>
		</div>
	);
};
export default ProductList;
