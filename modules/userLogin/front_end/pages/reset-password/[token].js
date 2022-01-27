import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import Page from "components/shell/Page";
import ResetPasswordConfirmForm from "components/user/reset/ResetPasswordConfirmForm";
import { useRouter } from "next/router";

const Deletion = () => {
	const router = useRouter();
	const token = router.query.token;
	return (
		<Page title="Benutzer Löschen">
			<AuthenticationLayout>
				<ResetPasswordConfirmForm resetToken={ token }/>
			</AuthenticationLayout>
		</Page>
	);
};
export default Deletion;
