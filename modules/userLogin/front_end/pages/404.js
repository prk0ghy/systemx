import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import Card from "components/generics/Card";
import { ShellContent } from "components/shell/Shell";
import i18n from "i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const NotFound = ({ msg = i18n.t("404default") }) => (
	<ShellContent title={ `404 - ${msg}` }>
		<AuthenticationLayout headline={ `404 - ${msg}` }>
			<Card>
				<h4>404</h4>
				<br/>
				<p>{ `${msg}` }</p>
			</Card>
		</AuthenticationLayout>
	</ShellContent>
);
export default NotFound;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
