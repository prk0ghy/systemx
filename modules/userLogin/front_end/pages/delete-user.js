import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import DeleteUserForm from "components/user/delete/DeleteUserForm";
import DeleteUserConfirmForm from "components/user/delete/DeleteUserConfirmForm";
import { ShellContent } from "../components/shell/Shell";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const DeleteUser = () => {
	const router = useRouter();
	const token = router.query.token;
	const { t } = useTranslation("common");
	return (
		<ShellContent headerBackgroundColor="#3E4162" title={ t("titles|deleteUser") }>
			<AuthenticationLayout>
				{ token
					? <DeleteUserConfirmForm token={ token }/>
					: <DeleteUserForm/>
				}
			</AuthenticationLayout>
		</ShellContent>
	);
};
export default DeleteUser;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
