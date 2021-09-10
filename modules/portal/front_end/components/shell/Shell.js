import { BrandProvider } from "contexts/Brand";
import { BusProvider } from "contexts/Bus";
import { CartProvider } from "contexts/Cart";
import cx from "classnames";
import Footer from "components/shell/Footer";
import Header from "components/shell/Header";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ProductsProvider } from "contexts/Products";
import SideMenu from "components/shell/SideMenu";
import styles from "./Shell.module.css";
import { useBus } from "contexts/Bus";
const MaybePayPalProvider = ({ children }) => {
	const providerOptions = {
		"client-id": process.env.NODE_ENV === "development"
			? "ASAEgYQ-jpFzrBIJeE1KGN1f5tHh4ygf7sTLUQbBuIYL9Vw_6bpEHMnVe-qtdtjFGiifiWPWYBVTtZAy"
			: "AcJstEvZJ856n4bISE_ktLOoPNh83WUdiyC-yaHQj1kX0zL8DA-FhaD79mUeJhveFUu4oRYjpAKQiQvo",
		currency: "EUR"
	};
	const [{ hasOneTimePayPalConsent }] = useBus();
	const needsConsent = !hasOneTimePayPalConsent;
	return needsConsent
		? children
		: (
			<PayPalScriptProvider options={ providerOptions }>
				{ children }
			</PayPalScriptProvider>
		);
};
const ShellContent = ({ children }) => {
	const [{ isSideMenuOpen }] = useBus();
	const shellContentClassName = cx(styles.content, {
		[styles.inactive]: isSideMenuOpen
	});
	return (
		<div className={ styles.shell }>
			<div className={ shellContentClassName }>
				<Header/>
				<main className={ styles.children }>
					{ children }
				</main>
				<Footer/>
			</div>
			<SideMenu/>
		</div>
	);
};
const Shell = ({ children }) => (
	<BrandProvider>
		<ProductsProvider>
			<CartProvider>
				<BusProvider>
					<MaybePayPalProvider>
						<ShellContent>
							{ children }
						</ShellContent>
					</MaybePayPalProvider>
				</BusProvider>
			</CartProvider>
		</ProductsProvider>
	</BrandProvider>
);
export default Shell;
