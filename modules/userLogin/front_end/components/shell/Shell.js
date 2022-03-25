import { AuthenticationProvider } from "contexts/Authentication";
import { BrandProvider } from "contexts/Brand";
import { BusProvider } from "contexts/Bus";
import { CartProvider } from "contexts/Cart";
import { InvoiceProvider } from "contexts/Invoice";
import cx from "classnames";
import Footer from "components/shell/Footer";
import Header from "components/shell/Header";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ProductsProvider } from "contexts/Products";
import { useAuthentication } from "../../contexts/Authentication";
import SideMenu from "components/navigation/SideMenu";
import styles from "./Shell.module.css";
import { useBus } from "contexts/Bus";
import {
	useCallback, useEffect, useState
} from "react";
import { useRefreshUserData } from "root/api";
import { useRouter } from "next/router";
import ActivationRequirement from "../user/activate/ActivationRequirement.js";
import Head from "next/head";
const MaybePayPalProvider = ({ children }) => {
	const providerOptions = {
		"client-id": process.env.NODE_ENV === "development"
			? "ASAEgYQ-jpFzrBIJeE1KGN1f5tHh4ygf7sTLUQbBuIYL9Vw_6bpEHMnVe-qtdtjFGiifiWPWYBVTtZAy"
			: "AcJstEvZJ856n4bISE_ktLOoPNh83WUdiyC-yaHQj1kX0zL8DA-FhaD79mUeJhveFUu4oRYjpAKQiQvo",
		currency: "EUR"
	};
	const [{ hasPayPalConsent }] = useBus();
	const needsConsent = !hasPayPalConsent;
	return needsConsent
		? children
		: (
			<PayPalScriptProvider options={ providerOptions }>
				{ children }
			</PayPalScriptProvider>
		);
};
export const ShellContent = ({
	children,
	headerNoBlur,
	headerBackgroundColor,
	title = "mVet",
	skipActivationNotice = false
}) => {
	const [{ isSideMenuOpen }] = useBus();
	const shellContentClassName = cx(styles.content, {
		[styles.inactive]: isSideMenuOpen
	});
	const [refresh] = useRefreshUserData();
	useEffect(() => {
		refresh();
	}, [refresh]);
	// Check if the account requires activation
	const [{ user }] = useAuthentication();
	const [requiresActivation, setRequiresActivation] = useState(false);
	useEffect(() => {
		setRequiresActivation(user && !user.isActivated);
	}, [user]);
	return (
		<>
			<Head>
				<link href="/favicon.svg" rel="icon"/>
				<title>{ title }</title>
			</Head>
			<div className={ styles.shell }>
				<div className={ shellContentClassName }>
					<Header backgroundColor={ headerBackgroundColor } noBlur={ headerNoBlur }/>
					<main className={ styles.children }>
						{
							!requiresActivation
								? children
								: skipActivationNotice
									? children
									: <ActivationRequirement user={ user }/>
						}
					</main>
					<Footer/>
				</div>
				<SideMenu/>
			</div>
		</>
	);
};
const CloseSideMenuOnNavigation = ({ children }) => {
	const Router = useRouter();
	const [, dispatch] = useBus();
	const handler = useCallback(() => {
		dispatch({
			type: "CLOSE_SIDE_MENU"
		});
	}, [dispatch]);
	Router?.events?.on("routeChangeComplete", handler);
	return children;
};
const Shell = ({ children }) => (
	<BrandProvider>
		<ProductsProvider>
			<AuthenticationProvider>
				<CartProvider>
					<InvoiceProvider>
						<BusProvider>
							<CloseSideMenuOnNavigation>
								<MaybePayPalProvider>
									{ children }
								</MaybePayPalProvider>
							</CloseSideMenuOnNavigation>
						</BusProvider>
					</InvoiceProvider>
				</CartProvider>
			</AuthenticationProvider>
		</ProductsProvider>
	</BrandProvider>
);
export default Shell;
