import cx from "classnames";
import styles from "./ProductBig.module.css";
import Picture from "../generics/Picture";
import Link from "next/dist/client/link";
const Product = ({
	product,
	className
}) => {
	const {
		name,
		preview,
		color,
		startWithPreview
	} = product;
	const picture = {
		...preview,
		autoHeight: false,
		alt: name
	};
	const productClassName = cx(styles.product, className, {
		[styles.startWithPreview]: startWithPreview
	});
	return (
		<Link href={ `/product/${encodeURIComponent(product.id)}` }>
			<div
				className={ productClassName } style={ {
					backgroundColor: color
				} }
			>
				<Picture className={ styles.picture } { ...picture }/>
				<div className={ styles.card }>
					{ name }
				</div>
			</div>
		</Link>
	);
};
export default Product;
