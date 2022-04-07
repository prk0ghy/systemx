import dynamic from "next/dynamic";
import Link from "next/link";
import routes from "root/routes";
import styles from "./CartIcon.module.css";
import { useBus } from "../../../contexts/Bus";
import { useCart } from "contexts/Cart";
const CartIcon = () => {
	const [{ items }] = useCart();
	const [, dispatch] = useBus();
	if (items.length > 0) {
		dispatch({
			type: "OPEN_HEADER"
		});
	}
	const notification = items.length
		? (
			<div className={ styles.notification }>
				{ items.length }
			</div>
		)
		: null;
	return (items.length > 0)
		? (
			<li>
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
			</li>
		)
		: null;
};
export default dynamic(() => Promise.resolve(CartIcon), {
	ssr: false
});
