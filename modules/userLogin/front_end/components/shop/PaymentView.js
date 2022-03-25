import dynamic from "next/dynamic";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCallback, useState } from "react";
import { userCapturePayPalOrder, userCreatePayPalOrder } from "root/api";
import Button from "components/inputs/Button";
import routes from "root/routes";
import styles from "./PaymentView.module.css";
import { useBus } from "contexts/Bus";
import { useCart } from "contexts/Cart";
import { useInvoice } from "contexts/Invoice";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
const PaymentForm = ({ onApprove }) => {
	const { t } = useTranslation("common");
	const [{ isRejected: isInitialLoadRejected }] = usePayPalScriptReducer();
	const [{ items }, reduceCart] = useCart();
	const [{ invoice }] = useInvoice();
	const router = useRouter();
	const captureOrder = useCallback(async ({ orderID }) => {
		const { isCaptured } = await userCapturePayPalOrder(orderID);
		if (isCaptured) {
			onApprove();
			reduceCart({
				type: "CLEAR_ITEMS"
			});
			router.push(routes.orderComplete.path);
		}
	}, [reduceCart, router, onApprove]);
	const createOrder = useCallback(async () => {
		const itemIDs = Object.values(items);
		const ret = await userCreatePayPalOrder(itemIDs, invoice);
		if (ret.error) {
			throw ret;
		}
		return ret.orderID;
	}, [items, invoice]);
	if (isInitialLoadRejected) {
		return (
			<div key="paypal-load-rejected">
				<h3>{ t("payment|paypalError|title") }</h3>
				<p>{ t("payment|paypalError|description") }</p>
				<ul>
					<li>{ t("payment|paypalError|hint") }</li>
					<li>{ t("payment|paypalError|checkFirewall") }</li>
				</ul>
			</div>
		);
	}
	return (
		<div className={ styles.buttons } key="paypal">
			<div>
				<h4>{ t("payment|choosePayment") }</h4>
				<br/>
				<PayPalButtons
					createOrder={ createOrder }
					onApprove={ captureOrder }
				/>
			</div>
		</div>
	);
};
const ConsentForm = () => {
	const { t } = useTranslation("common");
	const [, dispatch] = useBus();
	const agree = useCallback(() => {
		dispatch({
			type: "CONSENT_TO_PAY_PAL"
		});
	}, [
		dispatch
	]);
	return (
		<div>
			<p>{ t("payment|paypal|provider") }</p>
			<p>{ t("payment|paypal|agree") }</p>
			<p>{ t("payment|paypal|privacy") }</p>
			<Button kind="primary" onClick={ agree }>{ t("payment|paypal|iAgree") }</Button>
		</div>
	);
};
const PaymentConsentForm = ({ onApprove }) => {
	const [{ hasPayPalConsent }] = useBus();
	return hasPayPalConsent
		? <PaymentForm onApprove={ onApprove }/>
		: <ConsentForm/>;
};
const Checkout = () => {
	const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
	const onApprove = useCallback(() => {
		setIsCheckoutComplete(true);
	}, [
		setIsCheckoutComplete
	]);
	return (
		isCheckoutComplete
			? null
			: <PaymentConsentForm onApprove={ onApprove }/>
	);
};
export default dynamic(() => Promise.resolve(Checkout), {
	ssr: false
});
