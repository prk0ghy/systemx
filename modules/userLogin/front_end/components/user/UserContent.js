import { H } from "root/format";
import styles from "./UserProfile.module.css";
import { useAuthentication } from "contexts/Authentication";

const UserContent = () => {
	const [{ user }] = useAuthentication();
	return (
		<>
			<section className={ styles.userProfile }>
				<h4><H>Ihr Benutzerprofil</H></h4>
				<p>Testerle</p>
			</section>
		</>
	);
};
export default UserContent;
