import ButtonLink from "../inputs/ButtonLink.js";
import styles from "./UserProfileManager.module.css";
import { useAuthentication } from "contexts/Authentication";
import UserProfile from "./Userprofile.js";

const UserProfileManager = () => {
	const [{ user }] = useAuthentication();
	return (
		<>
			{ user
				? (
					<section className={ styles.userProfile }>
						<h4>Ihr Benutzerprofil</h4>
						<br/>
						<UserProfile/>
						<br/>
						<ButtonLink href="/reset-password">Passwort zurücksetzen</ButtonLink>
						<br/>
						<br/>
						<br/>
						<ButtonLink className={ styles.delete } href="/delete-user">Benutzer löschen</ButtonLink>
						<br/>
						<br/>
					</section>
				)
				: null
			}
		</>
	);
};
export default UserProfileManager;
