import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import DeleteUserConfirmForm from "components/user/delete/DeleteUserConfirmForm";
import Page from "components/shell/Page";
import { useRouter } from "next/router";

const Deletion = () => {
	const router = useRouter();
	const token = router.query.token;
	return (
		<Page title="Benutzer Löschen">
			<AuthenticationLayout>
				<DeleteUserConfirmForm deletionToken={ token }/>
			</AuthenticationLayout>
		</Page>
	);
};
export default Deletion;
