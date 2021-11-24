import ButtonLink from "../inputs/ButtonLink.js";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./UserProfileManager.module.css";
import { useAuthentication } from "contexts/Authentication";
import UserBusinessEdit from "../inputs/userMeta/UserBusinessEdit.js";
import UserCountryEdit from "../inputs/userMeta/UserCountryEdit.js";
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
						<div className={ styles.grid }>
							<div className={ styles.left }>
								<UserProfile/>
							</div>
							<div className={ styles.right }>
								<p><a><EditIcon className={ styles.edit }/></a></p>
								<p><a><EditIcon className={ styles.edit }/></a></p>
								<UserCountryEdit/>
								<UserBusinessEdit/>
							</div>
						</div>
						<br/>
						<ButtonLink href="/reset-password">Passwort zurücksetzen</ButtonLink>
						<br/>
						<br/>
						<ButtonLink href="/delete-user">Benutzer löschen</ButtonLink>
						<br/>
					</section>
				)
				: null
			}
		</>
	);
};
export default UserProfileManager;
