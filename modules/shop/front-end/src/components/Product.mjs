import cx from "classnames";
import Button from "components/Button.mjs";
import { formatPrice } from "../format.mjs";
import Laced from "components/Laced.mjs";
import styles from "./Product.css";
export default ({
	caption,
	children,
	description,
	name,
	previewURL,
	price,
	startWithPreview
}) => {
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
		: "In den Warenkorb";
	return (
		<div className={ productClassName }>
			<div className={ styles.row }>
				<div className={ styles.card }>
					<h2 className={ styles.name }>
						<span className={ styles.text }>{ name }</span>
					</h2>
					<Laced>
						<div className={ styles.cardContent }>
							<div className={ styles.enticer }>
								<div className={ styles.caption }>{ caption }</div>
								<div className={ styles.description }>{ description }</div>
							</div>
							<div className={ styles.bottom }>
								<div className={ styles.action }>
									{ formattedPrice }
									<Button>{ buttonText }</Button>
								</div>
							</div>
						</div>
					</Laced>
				</div>
				<img className={ styles.preview } src={ previewURL }/>
			</div>
		</div>
	);
};
