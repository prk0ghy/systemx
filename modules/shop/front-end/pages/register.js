import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import Page from "components/shell/Page";
import RegistrationForm from "components/forms/RegistrationForm";
const Registration = () => (
	<Page title="Registrierung">
		<AuthenticationLayout>
			<RegistrationForm/>
		</AuthenticationLayout>
	</Page>
);
export default Registration;
