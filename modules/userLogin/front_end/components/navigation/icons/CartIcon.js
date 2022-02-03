import Link from "next/link";
import routes from "root/routes";
import styles from "./CartIcon.module.css";
import { useCart } from "contexts/Cart";
const CartIcon = () => {
	const [{ items }] = useCart();
	const notification = items.length
		? (
			<div className={ styles.notification }>
				{ items.length }
			</div>
		)
		: null;
	return (
		<Link href={ routes.cart.path }>
			<a className={ styles.cartIcon }>
				<img
					alt="Warenkorb"
					className={ styles.image }
					height={ 77 }
					src="/mvet/ui/cart.png"
					width={ 100 }
				/>
				{ notification }
			</a>
		</Link>
	);
};
export default CartIcon;
