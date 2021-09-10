import { BrandProvider } from "contexts/Brand";
import { BusProvider } from "contexts/Bus";
import { CartProvider } from "contexts/Cart";
import cx from "classnames";
import Footer from "components/shell/Footer";
import Header from "components/shell/Header";
import { ProductsProvider } from "contexts/Products";
import SideMenu from "components/shell/SideMenu";
import styles from "./Shell.module.css";
import { useBus } from "contexts/Bus";
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
					<ShellContent>
						{ children }
					</ShellContent>
				</BusProvider>
			</CartProvider>
		</ProductsProvider>
	</BrandProvider>
);
export default Shell;
