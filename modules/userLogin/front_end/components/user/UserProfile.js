import { useRefreshUserData, userLogout } from "root/api";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Button from "../inputs/Button.js";
import ButtonLink from "../inputs/ButtonLink.js";
import Configuration from "../../config.js";
import EmailIcon from "@mui/icons-material/Email";
import { H } from "root/format";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./UserProfile.module.css";
import { useAuthentication } from "contexts/Authentication";
import { useCallback } from "react";
import UserBusinessEdit from "./inputs/UserBusinessEdit.js";
import UserCountryEdit from "./inputs/UserCountryEdit.js";

const UserProfile = () => {
	const [{ user }] = useAuthentication();
	const [refresh] = useRefreshUserData();
	const doLogout = useCallback(
		async e => {
			e.preventDefault();
			await userLogout();
			refresh();
		}, [refresh]
	);
	return (
		<>
			{ user
				? (
					<section className={ styles.userProfile }>
						<h4><H>Ihr Benutzerprofil</H></h4>
						<br/>
						<div>
							<p><PersonIcon className={ styles.icon }/><H>{ user.name }</H></p>
						</div>
						<div>
							<p><EmailIcon className={ styles.icon }/><H>{ user.email }</H></p>
						</div>
						<div>
							<p><LanguageIcon className={ styles.icon }/><H>{ user.meta.country }</H></p>
							<UserCountryEdit/>
						</div>
						<div>
							<p>
								<BusinessCenterIcon className={ styles.icon }/>
								{
									user?.meta?.isBusinessCustomer
										? "Geschäftskunde"
										: "Privatkunde"
								}
							</p>
							<UserBusinessEdit/>
						</div>
						<br/>
						{ Configuration?.passwordReset?.enabled
							? (<ButtonLink href="/reset-password">Passwort zurücksetzen</ButtonLink>)
							: null
						}
						<ButtonLink className={ styles.delete } href="/delete-user">Benutzer löschen</ButtonLink>
						<Button kind="primary" onClick={ doLogout }>Logout</Button>
					</section>
				)
				: null
			}
		</>
	);
};
export default UserProfile;
