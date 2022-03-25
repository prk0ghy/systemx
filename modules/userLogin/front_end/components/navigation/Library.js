import Button from "components/inputs/Button";
import LibraryItem from "./LibraryItem";
import Link from "next/link";
import LoginForm from "../user/LoginForm";
import LogoutLink from "./buttons/LogoutLink";
import routes from "root/routes";
import styles from "./Library.module.css";
import NeverUsers from "../user/NeverUsers";
import OnlyUsers from "../user/OnlyUsers";
import { findProduct } from "userLoginCommon/product";
import { useAuthentication } from "contexts/Authentication";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useTranslation } from "next-i18next";
const Library = () => {
	const { t } = useTranslation("common");
	const [{ user }] = useAuthentication();
	const router = useRouter();
	const items = Object.values(user?.groups || {}).map(d => {
		const p = findProduct(d);
		return <LibraryItem key={ d } product={ p }/>;
	});
	const registrationButton = useCallback(() => {
		router.push("/register");
	}, [router]);
	return (
		<div className={ styles.library }>
			<OnlyUsers>
				<div className={ styles.background }>
					<p className={ styles.title }><span className={ styles.fat }>{ t("my") }</span> { t("product") }</p>
					<Link href={ routes.library.path }>
						<a>
							<h3 className={ styles.header }>{ t("toLibrary") }</h3>
						</a>
					</Link>
					<ul className={ styles.items }>
						{ items }
					</ul>
					<Link href={ routes.userProfile.path }>
						<a>
							<h3 className={ styles.header }>{ t("toAccount") }</h3>
						</a>
					</Link>
					<ul className={ styles.items }>
						<li><LogoutLink/></li>
					</ul>
				</div>
			</OnlyUsers>
			<NeverUsers>
				<div className={ styles.login }>
					<h3 className={ styles.header }>{ t("login") }</h3>
					<LoginForm/>
					<br/>
					<Button kind="primary" onClick={ registrationButton } type="submit">{ t("registration") }</Button>
				</div>
			</NeverUsers>
		</div>
	);
};
export default Library;
