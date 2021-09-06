import { H } from "root/format";
import LoginForm from "../forms/LoginForm";
import RegistrationForm from "../forms/RegistrationForm";
import styles from "./LoginRegistrationManager.module.css";
const LoginRegistrationManager = () => {
	return (
		<div className={ styles.checkoutManager }>
			<h3><H>Alter Hase</H></h3>
			<br/>
			<LoginForm/>
			<br/>
			<br/>
			<h3><H>Ich bin neu hier</H></h3>
			<br/>
			<RegistrationForm/>
		</div>
	);
};
export default LoginRegistrationManager;
