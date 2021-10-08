import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Button from "../inputs/Button.js";
import EmailIcon from "@mui/icons-material/Email";
import { H } from "root/format";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./UserProfileManager.module.css";
import { useAuthentication } from "contexts/Authentication";

const UserProfileManager = () => {
	const [{ user }] = useAuthentication();
	console.log(JSON.stringify(user, null, 2));
	return (
		<>
			{ user
				? (
					<section className={ styles.userProfile }>
						<h4><H>Benutzerprofil</H></h4>
						<br/>
						<p><PersonIcon/><H>{ user.name }</H></p>
						<p><EmailIcon/><H>{ user.email }</H></p>
						<p><LanguageIcon/><H>{ user.meta.country }</H></p>
						<p><BusinessCenterIcon/>
							{
								user.meta.isBusinessCustomer
									? "Geschäftskunde"
									: "Privatkunde"
							}
						</p>
						<Button href="/register" type="button">Benutzeroptionen</Button>
						<p className={ styles.deleteUser }>Wenn Sie ihr Benutzerprofil löschen möchten, klicken sie bitte
							<a href="/delete-user">hier</a>
						</p>
					</section>
				)
				: null
			}
		</>
	);
};
export default UserProfileManager;
