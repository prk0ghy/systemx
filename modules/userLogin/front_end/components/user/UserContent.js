import { H } from "root/format";
import styles from "./UserProfile.module.css";
import { useTranslation } from "next-i18next";
const UserContent = () => {
	const { t } = useTranslation("common");
	return (
		<>
			<section className={ styles.userProfile }>
				<h4><H>{ t("profile|yourProfile") }</H></h4>
				<p>Testerle</p>
			</section>
		</>
	);
};
export default UserContent;
