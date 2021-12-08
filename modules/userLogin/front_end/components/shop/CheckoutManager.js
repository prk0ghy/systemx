import CartManager from "./cart/CartManager";
import HorizontalSplit from "../layouts/HorizontalSplit";
import LoginRegistrationManager from "../user/LoginRegistrationManager";
import PaymentView from "./PaymentView";
import styles from "./CheckoutManager.module.css";
import { useBus } from "contexts/Bus";
import { useCallback } from "react";
const CheckoutManager = () => {
	const [{ checkoutStep }, dispatch] = useBus();
	const proceed = useCallback(() => {
		dispatch({
			data: {
				value: checkoutStep + 1
			},
			type: "SET_CHECKOUT_STEP"
		});
	}, [
		checkoutStep,
		dispatch
	]);
	const steps = [(
		<HorizontalSplit key="step-1">
			<LoginRegistrationManager/>
			<CartManager onProceed={ proceed }/>
		</HorizontalSplit>
	), (
		<PaymentView key="step-2" onProceed={ proceed }/>
	), (
		<div key="step-3">
			<p>Vielen Dank für Ihre Bestellung.</p>
			<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy. At vero eos et accusam et justo duo dolores et ea rebum. Elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
		</div>
	)];
	return (
		<div className={ styles.checkoutManager }>
			{ steps[checkoutStep] }
		</div>
	);
};
export default CheckoutManager;
