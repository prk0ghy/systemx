import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EmailIcon from "@mui/icons-material/Email";
import { H } from "root/format";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./UserProfile.module.css";
import { useAuthentication } from "contexts/Authentication";
import UserBusinessEdit from "../inputs/userMeta/UserBusinessEdit.js";
import UserCountryEdit from "../inputs/userMeta/UserCountryEdit.js";

const UserProfile = () => {
	const [{ user }] = useAuthentication();
	return (
		<>
			{ user
				? (
					<section className={ styles.userProfile }>
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
					</section>
				)
				: null
			}
		</>
	);
};
export default UserProfile;
