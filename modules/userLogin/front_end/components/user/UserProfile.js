import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ButtonLink from "../inputs/ButtonLink.js";
import Configuration from "../../config.js";
import dynamic from "next/dynamic";
import EmailIcon from "@mui/icons-material/Email";
import { H } from "root/format";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./UserProfile.module.css";
import { useAuthentication } from "contexts/Authentication";
import UserBusinessEdit from "./inputs/UserBusinessEdit.js";
import UserCountryEdit from "./inputs/UserCountryEdit.js";
import { useTranslation } from "next-i18next";
const UserProfile = () => {
	const { t } = useTranslation("common");
	const [{ user }] = useAuthentication();
	return (
		<>
			{ user
				? (
					<section className={ styles.userProfile }>
						<h4><H>{ t("profile|yourProfile") }</H></h4>
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
										? t("buisnessCustomer")
										: t("personalCustomer")
								}
							</p>
							<UserBusinessEdit/>
						</div>
						<br/>
						{ Configuration?.passwordReset?.enabled
							? (<ButtonLink href="/reset-password">{ t("passwordReset") }</ButtonLink>)
							: null
						}
						<ButtonLink className={ styles.delete } href="/delete-user">{ t("deleteUser") }</ButtonLink>
					</section>
				)
				: null
			}
		</>
	);
};
export default dynamic(() => Promise.resolve(UserProfile), {
	ssr: false
});
