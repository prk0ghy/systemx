import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import { ShellContent } from "components/shell/Shell";
import ResetPasswordForm from "components/user/reset/ResetPasswordForm";
import ResetPasswordConfirmForm from "components/user/reset/ResetPasswordConfirmForm";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const ResetPassword = () => {
	const router = useRouter();
	const token = router.query.token;
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|passwordReset") }>
			<AuthenticationLayout resetPassword>
				{ token
					? <ResetPasswordConfirmForm token={ token }/>
					: <ResetPasswordForm/>
				}
			</AuthenticationLayout>
		</ShellContent>
	);
};
export default ResetPassword;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
