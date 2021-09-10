import CartManager from "./CartManager";
import HorizontalSplit from "../layouts/HorizontalSplit";
import LoginRegistrationManager from "./LoginRegistrationManager";
import styles from "./CheckoutManager.module.css";
const CheckoutManager = () => {
	return (
		<div className={ styles.checkoutManager }>
			<HorizontalSplit>
				<LoginRegistrationManager/>
				<CartManager/>
			</HorizontalSplit>
		</div>
	);
};
export default CheckoutManager;
