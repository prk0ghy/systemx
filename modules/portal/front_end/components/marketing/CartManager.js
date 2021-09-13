import { CSSTransition,	TransitionGroup } from "react-transition-group";
import { formatPrice, H } from "root/format";
import CartProduct from "./CartProduct";
import styles from "./CartManager.module.css";
import { useCart } from "contexts/Cart";
import { useProducts } from "contexts/Products";
const CartManager = () => {
	const [{ items }] = useCart();
	const [{ products }] = useProducts();
	const cartItems = items.map(id => {
		const item = products.find(product => product.id === id);
		return (
			<CSSTransition
				classNames={ {
					exit: styles.itemExit,
					exitActive: styles.itemExitActive
				} }
				key={ id }
				timeout={ 500 }
			>
				<CartProduct key={ id } { ...item }/>
			</CSSTransition>
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
			<TransitionGroup className="todo-list">
				{ cartItems.length
					? [...cartItems, <div className={ styles.sum } key="shopping_cart_sum">Artikelsumme <span>{ formatPrice(sum) }</span></div>]
					: [
						<CSSTransition
							classNames={ {
								enter: styles.itemEnter,
								enterActive: styles.itemEnterActive
							} }
							key="empty"
							timeout={ 50000 }
						>
							<span className={ styles.CartManager }>Zurzeit ist Ihr Warenkorb leer.</span>
						</CSSTransition>]
				}
			</TransitionGroup>
		</div>
	);
};
export default CartManager;
