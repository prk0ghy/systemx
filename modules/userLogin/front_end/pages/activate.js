import { ShellContent } from "components/shell/Shell";
import { useRouter } from "next/router";
import ActivateAccount from "../components/user/activate/ActivateAccount";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const AccountActivation = () => {
	const router = useRouter();
	const token = router.query.token;
	const { t } = useTranslation("common");
	return (
		<ShellContent skipActivationNotice title={ t("titles|activation") }>
			<ActivateAccount token={ token }/>
		</ShellContent>
	);
};
export default AccountActivation;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
