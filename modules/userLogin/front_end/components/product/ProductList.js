import ProductBig from "components/product/ProductBig";
import styles from "./ProductList.module.css";
import { useProducts } from "contexts/Products";
import Laced from "components/generics/Laced";
const ProductList = () => {
	const [{ products }] = useProducts();
	const productList = products.map((product, i) => (
		<li className={ styles.item } key={ product.id }>
			<ProductBig product={ product } startWithPreview={ i % 2 === 1 }/>
		</li>
	));
	return (
		<div className={ styles.productList }>
			<Laced>
				<ul className={ styles.items }>
					{ productList }
				</ul>
			</Laced>
		</div>
	);
};
export default ProductList;
