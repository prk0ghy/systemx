import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCallback, useState } from "react";
import Button from "components/inputs/Button";
import Page from "components/shell/Page";
import { useBrand } from "contexts/Brand";
import { useBus } from "contexts/Bus";
import { useCart } from "contexts/Cart";
const Goodbye = () => (
	<>
		<p>Vielen Dank für Ihre Bestellung.</p>
		<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy. At vero eos et accusam et justo duo dolores et ea rebum. Elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
	</>
);
const PaymentForm = ({ onApprove }) => {
	const [{ isRejected: isInitialLoadRejected }] = usePayPalScriptReducer();
	const [{ items }] = useCart();
	const captureOrder = useCallback(async ({ orderID }) => {
		const isCaptured = await window.systemx?.captureOrder(orderID);
		if (isCaptured) {
			onApprove();
		}
	}, [
		onApprove
	]);
	const createOrder = useCallback(async () => {
		const itemIDs = Object.values(items);
		const orderID = await window.systemx?.createOrder(itemIDs) || {};
		return orderID;
	}, [
		items
	]);
	if (isInitialLoadRejected) {
		return (
			<div>
				<h3>PayPal konnte nicht erreicht werden.</h3>
				<p>Bei der Verbindungsherstellung zu PayPal ist ein Fehler aufgetreten. Bitte überprüfen Sie folgende mögliche Ursachen.</p>
				<ul>
					<li>Deaktivieren Sie Werbe- und Tracking-Blocker wie etwa uBlock Origin, AdBlock Plus, uMatrix oder NoScript.</li>
					<li>Überprüfen Sie Ihre Firewall-Einstellungen.</li>
				</ul>
			</div>
		);
	}
	return (
		<PayPalButtons
			createOrder={ createOrder }
			onApprove={ captureOrder }
		/>
	);
};
const ConsentForm = () => {
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
			<p>Zur Zahlungsabwicklung verwenden wir den Dienst PayPal.</p>
			<p>Mit dem Fortfahren erklären Sie Ihr Einverständnis, dass mit dem Anzeigen der nachfolgenden Zahlungsabwicklung personenbezogene Daten an PayPal übermittelt werden.</p>
			<p>Weitere Details finden Sie in unserer Datenschutzerklärung.</p>
			<Button kind="primary" onClick={ agree }>Ich stimme zu</Button>
		</div>
	);
};
const PaymentConsentForm = ({ onApprove }) => {
	const [{ hasOneTimePayPalConsent }] = useBus();
	return hasOneTimePayPalConsent
		? <PaymentForm onApprove={ onApprove }/>
		: <ConsentForm/>;
};
const Checkout = () => {
	const [{
		CheckoutPreviewHeight,
		CheckoutPreviewURL,
		CheckoutPreviewWidth
	}] = useBrand();
	const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
	const onApprove = useCallback(() => {
		setIsCheckoutComplete(true);
	}, [
		setIsCheckoutComplete
	]);
	return (
		<Page title="Kasse">
			<BannerLayout autoHeight height={ CheckoutPreviewHeight } image={ CheckoutPreviewURL } width={ CheckoutPreviewWidth }>
				<TextContent>
					{
						isCheckoutComplete
							? <Goodbye/>
							: <PaymentConsentForm onApprove={ onApprove }/>
					}
				</TextContent>
			</BannerLayout>
		</Page>
	);
};
export default Checkout;
