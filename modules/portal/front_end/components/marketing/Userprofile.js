import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EmailIcon from "@mui/icons-material/Email";
import { H } from "root/format";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./UserProfile.module.css";
import { useAuthentication } from "contexts/Authentication";

const UserProfile = () => {
	const [{ user }] = useAuthentication();
	return (
		<>
			{ user
				? (
					<section className={ styles.userProfile }>
						<p><PersonIcon className={ styles.icon }/><H>{ user.name }</H></p>
						<p><EmailIcon className={ styles.icon }/><H>{ user.email }</H></p>
						<p><LanguageIcon className={ styles.icon }/><H>{ user.meta.country }</H></p>
						<p><BusinessCenterIcon className={ styles.icon }/>
							{
								user.meta.isBusinessCustomer
									? "Geschäftskunde"
									: "Privatkunde"
							}
						</p>
					</section>
				)
				: null
			}
		</>
	);
};
export default UserProfile;
