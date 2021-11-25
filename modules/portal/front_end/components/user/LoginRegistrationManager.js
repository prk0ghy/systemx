import Card from "../generics/Card";
import Configuration from "../../config.js";
import { H } from "root/format";
import LoginForm from "../forms/LoginForm";
import RegistrationForm from "../forms/RegistrationForm";
import styles from "./LoginRegistrationManager.module.css";
import { useAuthentication } from "contexts/Authentication";
import UserContent from "./UserContent";
import UserProfile from "./UserProfile";
const LoginRegistrationManager = () => {
	const [{ user }] = useAuthentication();
	return (
		<div className={ styles.checkoutManager }>
			{ user
				? (
					<>
						<Card>
							<UserProfile/>
						</Card>
					</>
				)
				: (
					<Card>
						<h3><H>{ Configuration?.registration?.enabled ? "Alter Hase" : "Login" }</H></h3>
						<br/>
						<LoginForm/>
						<br/>
						{ Configuration?.registration?.enabled ?
							(
								<>
									<br/>
									<h3><H>Ich bin neu hier</H></h3>
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
export default LoginRegistrationManager;
