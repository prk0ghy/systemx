import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import { H } from "root/format";
import LoginForm from "components/forms/LoginForm";
import Page from "components/shell/Page";
import routes from "root/routes";
import TextLink from "components/generics/TextLink";
const Login = () => (
	<Page title="Anmeldung">
		<AuthenticationLayout>
			<h3><H>Alter Hase</H></h3>
			<br/>
			<TextLink align="right" href={ routes.registration.path }>Neues Konto erstellen</TextLink>
			<LoginForm/>
		</AuthenticationLayout>
	</Page>
);
export default Login;
