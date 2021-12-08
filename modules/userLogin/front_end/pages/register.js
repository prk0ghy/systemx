import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import { H } from "root/format";
import Page from "components/shell/Page";
import RegistrationForm from "components/forms/RegistrationForm";
const Registration = () => (
	<Page title="Registrierung">
		<AuthenticationLayout>
			<h3><H>Ich bin neu hier</H></h3>
			<br/>
			<RegistrationForm/>
		</AuthenticationLayout>
	</Page>
);
export default Registration;
