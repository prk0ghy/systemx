import dynamic from "next/dynamic";
import { useCallback } from "react";
import CartManager from "./cart/CartManager";
import HorizontalSplit from "../layouts/HorizontalSplit";
import LoginRegistrationManager from "../user/LoginRegistrationManager";
import routes from "root/routes";
import styles from "./CheckoutManager.module.css";
import { useRouter } from "next/router";
const CheckoutManager = () => {
	const router = useRouter();
	const policy = useCallback(() => {
		router.push(routes.withdrawalPolicy.path);
	}, [
		router
	]);
	return (
		<div className={ styles.checkoutManager }>
			<HorizontalSplit>
				<LoginRegistrationManager/>
				<CartManager onProceed={ policy }/>
			</HorizontalSplit>
		</div>
	);
};
export default dynamic(() => Promise.resolve(CheckoutManager), {
	ssr: false
});
