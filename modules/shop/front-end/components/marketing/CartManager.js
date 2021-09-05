import { formatPrice, H } from "root/format";
import CartProduct from "./CartProduct.js";
import styles from "./CartManager.module.css";
import { useCart } from "contexts/Cart";
import { useProducts } from "contexts/Products";
const CartManager = () => {
	const [{ items }] = useCart();
	const [{ products }] = useProducts();
	const cartItems = items.map(id => {
		const item = products.find(product => product.id === id);
		return (
			<CartProduct key={ id } { ...item }/>
		);
	});
	const sum = items.map(id => {
		const item = products.find(product => product.id === id);
		return item
			? item.price
			: 0;
	}).reduce((a, b) => a + b, 0);
	return (
		<div className={ styles.cartManager }>
			<h3><H>Warenkorb</H></h3>
			<br/>
			{ cartItems.length
				? cartItems
				: "Zurzeit ist Ihr Warenkorb leer."
			}
			<div className={ styles.sum }>Artikelsumme <span>{ formatPrice(sum) }</span></div>
		</div>
	);
};
export default CartManager;
