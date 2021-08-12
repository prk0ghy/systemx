import {
	Route as OriginalRoute,
	BrowserRouter as Router,
	Switch
} from "react-router-dom";
import {
	lazy,
	Suspense
} from "react";
import { BrandProvider } from "contexts/Brand.mjs";
import { CartProvider } from "contexts/Cart.mjs";
import Footer from "components/shell/Footer.mjs";
import Header from "components/shell/Header.mjs";
import { ProductsProvider } from "contexts/Products.mjs";
import routes from "root/routes.mjs";
import ScrollManager from "components/shell/ScrollManager.mjs";
import styles from "./Application.css";
const withSuspense = WrappedComponent => (
	<Suspense fallback={ null }>
		<WrappedComponent/>
	</Suspense>
);
const Home = lazy(() => import("components/routes/Home.mjs"));
const Imprint = lazy(() => import("components/routes/Imprint.mjs"));
const Login = lazy(() => import("components/routes/Login.mjs"));
const Privacy = lazy(() => import("components/routes/Privacy.mjs"));
const Registration = lazy(() => import("components/routes/Registration.mjs"));
const TermsAndConditions = lazy(() => import("components/routes/TermsAndConditions.mjs"));
const Route = ({
	component,
	...rest
}) => {
	const ComponentWithSuspense = () => withSuspense(component);
	return (
		<OriginalRoute
			exact
			render={ props => <ComponentWithSuspense { ...props }/> }
			{ ...rest }
		/>
	);
};
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
