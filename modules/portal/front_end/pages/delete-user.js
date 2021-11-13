import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import DeleteUserForm from "components/userDelete/DeleteUserForm";
import Page from "components/shell/Page";
const Registration = () => (
	<Page title="Benutzer Löschen">
		<AuthenticationLayout>
			<DeleteUserForm/>
		</AuthenticationLayout>
	</Page>
);
export default Registration;
