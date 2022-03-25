import ButtonLink from "components/inputs/ButtonLink.js";
import { useTranslation } from "next-i18next";
import routes from "root/routes";
import styles from "./OrderComplete.module.css";
const OrderComplete = () => {
	const { t } = useTranslation("common");
	return (
		<div className={ styles.order }>
			<div className={ styles.text }>
				<p>{ t("completedOrder|thanks") }</p>
				<p>{ t("completedOrder|haveFun") }</p>
			</div>
			<div className={ styles.button }>
				<ButtonLink href={ routes.library.path }>
					{ t("completedOrder|toLibrary") }
				</ButtonLink>
			</div>
		</div>
	);
};
export default OrderComplete;
