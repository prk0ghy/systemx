import { useRefreshUserData, userLogout } from "root/api";
import Button from "../inputs/Button";
import styles from "./LoginForm.module.css";
import { useCallback } from "react";
const LoginForm = () => {
	const [refresh] = useRefreshUserData();
	const doLogout = useCallback(
		async e => {
			e.preventDefault();
			await userLogout();
			refresh();
		}, [refresh]
	);
	return (
		<div className={ styles.loginForm }>
			<form onSubmit={ doLogout }>
				<Button className={ styles.submit } kind="primary" type="submit">Logout</Button>
			</form>
		</div>
	);
};
export default LoginForm;
