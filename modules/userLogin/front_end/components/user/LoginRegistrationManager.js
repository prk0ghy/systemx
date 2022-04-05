import dynamic from "next/dynamic";
import Card from "components/generics/Card";
import { H } from "root/format";
import LoginForm from "components/user/LoginForm";
import LogoutForm from "components/user/LogoutForm";
import RegistrationForm from "components/user/RegistrationForm";
import styles from "./LoginRegistrationManager.module.css";
import { useAuthentication } from "contexts/Authentication";
import { useTranslation } from "next-i18next";
const LoginRegistrationManager = ({ loginHref }) => {
	const [{ user }] = useAuthentication();
	const { t } = useTranslation("common");
	return (
		<div className={ styles.checkoutManager }>
			{ user
				? (
					<Card>
						<LogoutForm/>
					</Card>
				)
				: (
					<Card>
						<h3>
							<H>{ process.env.enableRegistration === "true"
								? t("misc|what")
								: t("Login")
							}
							</H>
						</h3>
						<br/>
						<LoginForm loginHref={ loginHref }/>
						<br/>
						{ process.env.enableRegistration === "true"
							? (
								<>
									<br/>
									<h3><H>{ t("what") }</H></h3>
									<br/>
									<RegistrationForm/>
								</>
							)
							: null
						}
					</Card>
				)
			}
		</div>
	);
};
export default dynamic(() => Promise.resolve(LoginRegistrationManager), {
	ssr: false
});
