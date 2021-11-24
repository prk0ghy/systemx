import { formatPrice, H } from "root/format";
import cx from "classnames";
import ImageText from "components/generics/ImageText";
import Laced from "components/generics/Laced";
import ProductButton from "components/product/ProductButton";
import ProductButtonLink from "components/product/ProductButtonLink";
import styles from "./Product.module.css";

const Product = ({
	caption,
	children,
	contentUri,
	group,
	description,
	id,
	name,
	previewHeight,
	previewURL,
	previewWidth,
	price,
	startWithPreview
}) => {
	const productClassName = cx(styles.product, {
		[styles.startWithPreview]: startWithPreview
	});
	const formattedPrice = children || !price
		? null
		: (
			<div className={ styles.price }>{ formatPrice(price) }</div>
		);
	return (
		<div className={ productClassName }>
			<div className={ styles.row }>
				<div className={ styles.card }>
					<h2 className={ styles.mobileName }>
						<Laced>
							<ImageText className={ styles.text }>
								<H>{ name }</H>
							</ImageText>
						</Laced>
					</h2>
					<h2 className={ styles.name }>
						<ImageText className={ styles.text }>{ name }</ImageText>
					</h2>
					<Laced>
						<div className={ styles.cardContent }>
							<div className={ styles.enticer }>
								<div className={ styles.caption }><H>{ caption }</H></div>
								<div className={ styles.description }>{ description }</div>
							</div>
							<div className={ styles.bottom }>
								<div className={ styles.action }>
									{ formattedPrice }
									{	children
										? <ProductButtonLink productId={ id }/>
										: <ProductButton product={ { children, id, group, contentUri, price } }/>
									}
								</div>
							</div>
						</div>
					</Laced>
				</div>
				<img
					alt=""
					className={ styles.preview }
					height={ previewHeight }
					src={ previewURL }
					width={ previewWidth }
				/>
			</div>
		</div>
	);
};
export default Product;
