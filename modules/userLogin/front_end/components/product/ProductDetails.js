import Button from "components/inputs/Button";
import styles from "./ProductDetails.module.css";
import ProductButton from "components/product/ProductButton";
import Picture from "components/generics/Picture";
import { formatPrice } from "root/format";
import { getParentCategory } from "user-login-common/product";
import Link from "next/link";
import { useTranslation } from "next-i18next";
const ProductDetails = ({ product }) => {
	const { t } = useTranslation("common");
	const parentID = getParentCategory(product.id);
	return (
		<div className={ [styles.details,
			product.date
				? null
				: styles.infoBook].join(" ") }
		>
			<Picture className={ styles.img } { ...product.preview }/>
			{ product.date
				? (
					<>
						<div className={ styles.title }>
							<h1>{ product.name }</h1>
						</div>
						<div className={ styles.icons }>
							<div className={ styles.dateIcon }/>
							<div className={ styles.date }>{ product.date }</div>
							<Link href={ product.proceedingsLink }>
								<a className={ styles.bookText }>
									<div className={ styles.book }/>
									<span>{ t("products|includes") }<br/>{ t("products|proceeding") }</span>
								</a>
							</Link>
						</div>
					</>
				)
				: (
					<div className={ styles.bookTitle }>
						<h1>{ product.name }</h1>
					</div>
				)
			}
			<div className={ styles.description }>
				<h2>{ t("description") }</h2>
				{ product.longDescription }
			</div>
			<div className={ styles.price }>{ formatPrice(product.price) }
				<span className={ styles.mwst }>({ t("products|withoutTax") })</span>
			</div>
			<div className={ styles.button }>
				<ProductButton product={ product }/>
			</div>
			<div className={ styles.backbutton }>
				<Link
					href={ parentID
						? `/product/${parentID}`
						: "/" }
					passHref
				>
					<Button kind="secondary">{ t("back") }</Button>
				</Link>
			</div>
		</div>
	);
};
export default ProductDetails;
