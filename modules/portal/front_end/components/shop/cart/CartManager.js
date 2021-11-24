import { CSSTransition,	TransitionGroup } from "react-transition-group";
import { formatPrice, H } from "root/format";
import Button from "components/inputs/Button";
import CartProduct from "../marketing/CartProduct";
import styles from "./CartManager.module.css";
import { useAuthentication } from "contexts/Authentication";
import { useCart } from "contexts/Cart";
import { useProducts } from "contexts/Products";

const CartManager = ({ onProceed }) => {

	const findProduct = (productTree, id) => {
		if (!productTree) {
			return null;
		}
		const potentialMatch = productTree.find(product => product.id === id);
		if (potentialMatch) {
			return potentialMatch;
		}
		for (let i = 0; i < productTree.length; i++) {
			const newTree = productTree[i].children;
			if (!newTree) {
				continue;
			}
			const newProduct = findProduct(newTree, id);
			if (newProduct !== null) {
				return newProduct;
			}
		}
		return null;
	};

	const [{ items }] = useCart();
	const [{ products }] = useProducts();
	const cartItems = items.map(id => {
		const item = findProduct(products, id);
		const classNames = {
			exit: styles.itemExit,
			exitActive: styles.itemExitActive
		};
		return (
			<CSSTransition
				classNames={ classNames }
				key={ id }
				timeout={ 500 }
			>
				<CartProduct key={ id } { ...item }/>
			</CSSTransition>
		);
	});
	const sum = items.map(id => {
		const item = findProduct(products, id);
		return item
			? item.price
			: 0;
	}).reduce((a, b) => a + b, 0);
	const emptyCartClassNames = {
		enter: styles.itemEnter,
		enterActive: styles.itemEnterActive
	};
	const [{ user }] = useAuthentication();
	const disabled = !user
		? "disabled"
		: "";
	return (
		<div className={ styles.cartManager }>
			<h3><H>Warenkorb</H></h3>
			<br/>
			<TransitionGroup className="todo-list">
				{
					cartItems.length
						? [...cartItems, <div className={ styles.sum } key="shopping_cart_sum">Artikelsumme <span>{ formatPrice(sum) }</span></div>]
						: [
							<CSSTransition
								classNames={ emptyCartClassNames }
								key="empty"
								timeout={ 50000 }
							>
								<span className={ styles.cartManager }>Zurzeit ist Ihr Warenkorb leer.</span>
							</CSSTransition>
						]
				}
			</TransitionGroup>
			<p>Um zur Kasse fortzufahren, benötigen Sie ein Benutzerkonto.</p>
			<div className={ styles.actions }>
				<Button
					className={ styles.proceed }
					disabled={ disabled }
					kind="primary"
					onClick={ onProceed }
				>
					Zur Kasse
				</Button>
			</div>
		</div>
	);
};
export default CartManager;
