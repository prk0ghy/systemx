import { formatPrice, H } from "root/format";
import cx from "classnames";
import dynamic from "next/dynamic";
import ImageText from "components/generics/ImageText";
import Laced from "components/generics/Laced";
import styles from "./Product.module.css";
import { useCallback } from "react";
import { useCart } from "contexts/Cart";
import { useRouter } from "next/router";

const Button = dynamic(() => import("components/inputs/Button"), {
	ssr: false
});
const Product = ({
	caption,
	children,
	description,
	id,
	name,
	previewHeight,
	previewURL,
	previewWidth,
	price,
	startWithPreview
}) => {
	const [{ items }, dispatch] = useCart();
	const router = useRouter();

	const productClassName = cx(styles.product, {
		[styles.startWithPreview]: startWithPreview
	});
	const formattedPrice = children
		? null
		: (
			<div className={ styles.price }>{ formatPrice(price) }</div>
		);
	const buttonText = children
		? "Zur Auswahl"
		: items.includes(id)
			? "Aus dem Warenkorb"
			: "In den Warenkorb";

	const onClick = useCallback(() => {
		if (!children) {
			dispatch({
				data: {
					id
				},
				type: items.includes(id)
					? "REMOVE_ITEM"
					: "ADD_ITEM"
			});
		}
		else {
			router.push("/product/" + id);
		}
	}, [
		children,
		dispatch,
		id,
		items,
		router
	]);
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
									<Button onClick={ onClick }>{ buttonText }</Button>
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
