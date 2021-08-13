import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import LoginForm from "components/forms/LoginForm";
import Page from "components/shell/Page";
const Login = () => (
	<Page title="Anmeldung">
		<AuthenticationLayout>
			<LoginForm/>
		</AuthenticationLayout>
	</Page>
);
export default Login;
