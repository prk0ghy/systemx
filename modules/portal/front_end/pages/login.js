import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import LoginRegistrationManager from "components/user/LoginRegistrationManager";
import Page from "components/shell/Page";
const Login = () => (
	<Page title="Anmeldung">
		<AuthenticationLayout>
			<LoginRegistrationManager/>
		</AuthenticationLayout>
	</Page>
);
export default Login;
