import { BrandProvider } from "contexts/Brand";
import { CartProvider } from "contexts/Cart";
import Footer from "components/shell/Footer";
import Header from "components/shell/Header";
import { ProductsProvider } from "contexts/Products";
import styles from "./Shell.module.css";
const Shell = ({ children }) => (
	<BrandProvider>
		<ProductsProvider>
			<CartProvider>
				<div className={ styles.shell }>
					<Header/>
					<main>
						{ children }
					</main>
					<Footer/>
				</div>
			</CartProvider>
		</ProductsProvider>
	</BrandProvider>
);
export default Shell;
