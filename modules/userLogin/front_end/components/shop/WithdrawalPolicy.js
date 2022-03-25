import Button from "components/inputs/Button";
import styles from "./WithdrawalPolicy.module.css";
import { H } from "root/format";
import Laced from "components/generics/Laced";
import { useTranslation } from "next-i18next";
const WithdrawalPolicy = ({
	onCancel, onProceed
}) => {
	const { t } = useTranslation("common");
	return (
		<div className={ styles.withdrawalPolicy }>
			<Laced>
				<h3><H>{ t("withdrawal|withdrawalPolicy") }</H></h3>
				<br/>
				<p>{ t("withdrawal|readHere") }</p>
				<div className={ styles.actions }>
					<Button className={ styles.cancel } kind="primary" onClick={ onCancel }>
						{ t("withdrawal|disagree") }
					</Button>
					<Button className={ styles.proceed } kind="primary" onClick={ onProceed }>
						{ t("withdrawal|agree") }
					</Button>
				</div>
			</Laced>
		</div>
	);
};
export default WithdrawalPolicy;
