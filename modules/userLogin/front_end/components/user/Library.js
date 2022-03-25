import { findProduct } from "userLoginCommon/product";
import { H } from "root/format";
import styles from "./Library.module.css";
import NeverUsers from "../user/NeverUsers";
import OnlyUsers from "../user/OnlyUsers";
import { useAuthentication } from "contexts/Authentication";
import Badge from "../navigation/Badge";
import LoadingIndicator from "components/generics/LoadingIndicator";
import { useTranslation } from "next-i18next";
const UserProfile = () => {
	const { t } = useTranslation("common");
	const [{
		statusKnown, user
	}] = useAuthentication();
	const items = Object.values(user?.groups || {}).map(d => {
		const p = findProduct(d);
		return <Badge className={ styles.item } key={ d } product={ p }/>;
	});
	return (
		<section className={ styles.library }>
			<h4><H>{ t("library|yourLibrary") }</H></h4>
			<br/>
			<OnlyUsers>
				{ items.length
					? (
						<ul className={ styles.list }>
							{ items }
						</ul>
					)
					: <p>{ t("library|noItems") }</p>
				}
			</OnlyUsers>
			<NeverUsers>
				{
					statusKnown
						? t("libary|loginRequired")
						: <LoadingIndicator/>
				}
			</NeverUsers>
		</section>
	);
};
export default UserProfile;
