import {
	BrowserRouter as Router,
	Route,
	Switch
} from "react-router-dom";
import Authentication from "components/routes/Authentication.mjs";
import { CartProvider } from "contexts/Cart.mjs";
import { ProductsProvider } from "contexts/Products.mjs";
import Footer from "components/Footer.mjs";
import Header from "components/Header.mjs";
import Imprint from "components/routes/Imprint.mjs";
import Home from "components/routes/Home.mjs";
import Privacy from "components/routes/Privacy.mjs";
import termsAndConditions from "components/routes/Terms-and-conditions.mjs";
import routes from "../routes.mjs";
import styles from "./Application.css";

const Application = () => (
	<div className={ styles.application }>
		<Router>
			<Header/>
			<main>
				<Switch>
					<Route component={ Home } exact path={ routes.home.path }/>
					<Route component={ Authentication } exact path={ routes.authentication.path }/>
					<Route component={ Imprint } exact path={ routes.imprint.path }/>
					<Route component={ Privacy } exact path={ routes.privacy.path }/>
					<Route component={ termsAndConditions } exact path={routes.termsAndConditions.path }/>
					<Route>Fallback route</Route>
				</Switch>
			</main>
			<Footer/>
		</Router>
	</div>
);
export default () => (
	<ProductsProvider>
		<CartProvider>
			<Application/>
		</CartProvider>
	</ProductsProvider>
);
