import styles from "./CartManager.module.css";
import { useCart } from "contexts/Cart";
import { useProducts } from "contexts/Products";
const CartManager = () => {
	const [{ items }] = useCart();
	const [{ products }] = useProducts();
	const cartItems = items.map(id => {
		const item = products.find(product => product.id === id);
		return (
			<li key={ id }>{ item.name }</li>
		);
	});
	return (
		<ul className={ styles.cartManager }>
			{ cartItems }
		</ul>
	);
};
export default CartManager;
