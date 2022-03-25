import AuthenticationLayout from "components/layouts/AuthenticationLayout";
import Button from "components/inputs/Button";
import Card from "components/generics/Card";
import { H } from "root/format";
import LoginForm from "components/user/LoginForm";
import RegistrationForm from "components/user/RegistrationForm";
import { ShellContent } from "components/shell/Shell";
import NeverUsers from "components/user/NeverUsers";
import OnlyUsers from "components/user/OnlyUsers";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const Registration = () => {
	const { t } = useTranslation("common");
	return (
		<ShellContent title={ t("titles|register") }>
			<AuthenticationLayout>
				<Card>
					<h3><H>{ t("titles|register") }</H></h3>
					<br/>
					<OnlyUsers>
						<p>{ t("thanksForRegistering") }</p>
						<br/>
						<Link href="/" passHref>
							<Button kind="primary">{ t("toShop") }</Button>
						</Link>
					</OnlyUsers>
					<NeverUsers>
						<RegistrationForm/>
						<br/>
						<h3>{ t("alreadyCustomer") }</h3>
						<br/>
						<LoginForm/>
					</NeverUsers>
				</Card>
			</AuthenticationLayout>
		</ShellContent>
	);
};
export default Registration;
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"]))
		}
	};
}
