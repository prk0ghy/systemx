import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import LoginRegistrationManager from "components/user/LoginRegistrationManager";
import routes from "root/routes";
import { ShellContent } from "../components/shell/Shell";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const Login = () => {
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|login") }>
			<AuthenticationLayout>
				<LoginRegistrationManager loginHref={ routes.library.path }/>
			</AuthenticationLayout>
		</ShellContent>
	);
};
export default Login;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
