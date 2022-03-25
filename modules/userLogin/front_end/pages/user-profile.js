import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import Card from "components/generics/Card";
import { ShellContent } from "components/shell/Shell";
import UserProfile from "components/user/UserProfile";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const UserProfilePage = () => {
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|userProfile") }>
			<AuthenticationLayout>
				<Card>
					<UserProfile/>
				</Card>
			</AuthenticationLayout>
		</ShellContent>
	);
};
export default UserProfilePage;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
