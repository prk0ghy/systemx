import LibraryLayout from "components/layouts/LibraryLayout";
import Card from "components/generics/Card";
import UserLibrary from "components/user/Library";
import { ShellContent } from "../components/shell/Shell";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
const LibraryPage = () => {
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|library") }>
			<LibraryLayout>
				<Card>
					<UserLibrary/>
				</Card>
			</LibraryLayout>
		</ShellContent>
	);
};
export default LibraryPage;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
