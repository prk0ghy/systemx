import { BrandProvider } from "contexts/Brand";
import { BusProvider } from "contexts/Bus";
import { CartProvider } from "contexts/Cart";
import Footer from "components/shell/Footer";
import Header from "components/shell/Header";
import { ProductsProvider } from "contexts/Products";
import SideMenu from "components/shell/SideMenu";
import styles from "./Shell.module.css";
const Shell = ({ children }) => (
	<BrandProvider>
		<ProductsProvider>
			<CartProvider>
				<BusProvider>
					<div className={ styles.shell }>
						<Header/>
						<main className={ styles.content }>
							{ children }
						</main>
						<Footer/>
					</div>
					<SideMenu/>
				</BusProvider>
			</CartProvider>
		</ProductsProvider>
	</BrandProvider>
);
export default Shell;
