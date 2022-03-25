import BannerLayout from "components/layouts/BannerLayout";
import ProductEvent from "components/product/ProductEvent";
import ProductLayout from "components/layouts/ProductLayout";
import styles from "components/product/ProductList.module.css";
const mapFun = event => (
	<li className={ styles.item } key={ event.id }>
		<ProductEvent product={ event }/>
	</li>
);
const mapBookFilter = e => e.date === "";
const mapEventFilter = e => e.date !== "";
const eventList = children => {
	return (
		<ul className={ styles.items }>
			{ children }
		</ul>
	);
};
const ProductChildren = ({ product }) => {
	const events = eventList(product.children.filter(mapEventFilter).map(mapFun));
	const books = eventList(product.children.filter(mapBookFilter).map(mapFun));
	return (
		<BannerLayout className={ styles.home } headline={ product.name } picture={ product.preview } textAlignRight>
			<ProductLayout panel0={ events } panel1={ books }/>
		</BannerLayout>
	);
};
export default ProductChildren;
