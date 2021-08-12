import {
	Route,
	BrowserRouter as Router,
	Switch
} from "react-router-dom";
import { BrandProvider } from "contexts/Brand.mjs";
import { CartProvider } from "contexts/Cart.mjs";
import Footer from "components/Footer.mjs";
import Header from "components/Header.mjs";
import Home from "components/routes/Home.mjs";
import Imprint from "components/routes/Imprint.mjs";
import Login from "components/routes/Login.mjs";
import Privacy from "components/routes/Privacy.mjs";
import { ProductsProvider } from "contexts/Products.mjs";
import Registration from "components/routes/Registration.mjs";
import routes from "../routes.mjs";
import ScrollManager from "components/ScrollManager.mjs";
import styles from "./Application.css";
import TermsAndConditions from "components/routes/TermsAndConditions.mjs";
const Application = () => (
	<div className={ styles.application }>
		<Router>
			<ScrollManager/>
			<Header/>
			<main>
				<Switch>
					<Route component={ Home } exact path={ routes.home.path }/>
					<Route component={ Imprint } exact path={ routes.imprint.path }/>
					<Route component={ Login } exact path={ routes.login.path }/>
					<Route component={ Privacy } exact path={ routes.privacy.path }/>
					<Route component={ Registration } exact path={ routes.registration.path }/>
					<Route component={ TermsAndConditions } exact path={ routes.termsAndConditions.path }/>
					<Route>Fallback route</Route>
				</Switch>
			</main>
			<Footer/>
		</Router>
	</div>
);
export default () => (
	<BrandProvider>
		<ProductsProvider>
			<CartProvider>
				<Application/>
			</CartProvider>
		</ProductsProvider>
	</BrandProvider>
);
