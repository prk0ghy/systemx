import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import BannerLayout from "components/layouts/BannerLayout";
import Card from "components/generics/Card";
import Product from "components/product/Product";
import styles from "../../components/product/ProductList.module.css";
import { useProducts } from "../../contexts/Products";
import { useRouter } from "next/router";

/* Using recursive reduce to walk the tree and return the first result matching id */
export const findProduct = (prods, id) => {
	if (!prods) {
		return null;
	}
	for (const prod of prods) {
		if (prod.id === id) {
			return prod;
		}
		const child = findProduct(prod?.children, id);
		if (child) {
			return child;
		}
	}
	return null;
};

const Collection = () => {
	const router = useRouter();
	const { pid } = router.query;
	const [{ products }] = useProducts();
	const selection = findProduct(products, pid);

	let allChildren = null;
	let productList = null;

	allChildren = selection?.children;
	if (allChildren) {
		productList = allChildren.map((product, i) => (
			<li className={ styles.item } key={ product.id }>
				<Product { ...product } startWithPreview={ i % 2 === 1 }/>
			</li>
		)) || <Product { ...selection }/>;
	}

	return selection
		? (
			<BannerLayout className={ styles.home } headline={ selection.name } height={ selection.previewHeight } image={ selection.previewURL } width={ selection.previewWidth }>
				<Card>
					<h2>{ selection?.caption }</h2>
					<br/>
					{ selection?.longDescription.split("\n").map(v => v?.trim()
						? (<p>{ v }</p>)
						: null)
					}
				</Card>
				<div className={ styles.productList }>
					<ul className={ styles.items }>
						{ productList }
					</ul>
				</div>
			</BannerLayout>
		)
		: (
			<AuthenticationLayout className={ styles.home } headline="404 - Produkt konnte nicht gefunden werden">
				<Card>
					<h4>404</h4>
					<br/>
					<p>Das Produkt konnte nicht gefunden werden</p>
				</Card>
			</AuthenticationLayout>
		);
};

export default Collection;
