import dynamic from "next/dynamic";
import { formatPrice, H } from "root/format";
import Button from "components/inputs/Button";
import CartProduct from "./CartProduct";
import styles from "./CartManager.module.css";
import { useAuthentication } from "contexts/Authentication";
import { useCart } from "contexts/Cart";
import { findProduct } from "user-login-common/product";
import { useTranslation } from "next-i18next";
const CartManager = ({
	onProceed, readOnly = false
}) => {
	const { t } = useTranslation("common");
	const [{ items }] = useCart();
	const cartItems = items.map(id => {
		const item = findProduct(id);
		return (
			<CartProduct key={ id } { ...item } readOnly={ readOnly }/>
		);
	});
	const sum = items.map(id => {
		const item = findProduct(id);
		return item
			? item.price
			: 0;
	}).reduce((a, b) => a + b, 0);
	const [{ user }] = useAuthentication();
	const disabled = !user || !cartItems.length
		? "disabled"
		: "";
	return (
		<div className={ styles.cartManager }>
			<h3 className={ styles.cartHeadline }><H>{ t("cart|cart") }</H></h3>
			<br/>
			{
				cartItems.length
					? [...cartItems, <div className={ styles.sum } key="shopping_cart_sum">{ t("cart|sum") } <span>{ formatPrice(sum) }</span></div>]
					: [<span className={ styles.cartManager } key="shopping_cart_empty">{ t("cart|emptyCart") }</span>]
			}
			{
				!user && <p className={ styles.requiresLogin }>{ t("cart|accountRequired") }</p>
			}
			{
				readOnly
					? null
					: (
						<div className={ styles.actions }>
							<Button
								className={ styles.proceed }
								disabled={ disabled }
								kind="primary"
								onClick={ onProceed }
							>
								{ t("cart|toCheckout") }
							</Button>
						</div>
					)
			}
		</div>
	);
};
export default dynamic(() => Promise.resolve(CartManager), {
	ssr: false
});
