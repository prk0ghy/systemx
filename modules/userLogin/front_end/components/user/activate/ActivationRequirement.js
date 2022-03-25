import { useCallback, useState } from "react";
import Head from "next/head";
import Card from "../../generics/Card.js";
import Button from "../../inputs/Button.js";
import { userActivationResend } from "../../../api.js";
import styles from "./ActivationRequirement.module.css";
import { useTranslation } from "next-i18next";
const ActivateAccount = props => {
	const { t } = useTranslation("common");
	const [hasPressed, setHasPressed] = useState(false);
	const [feedback, setFeedback] = useState("");
	const resend = useCallback(async () => {
		const resp = await userActivationResend();
		setHasPressed(true);
		setFeedback(resp.error
			? t("feedback|email|failure")
			: t("feedback|email|success"));
	}, [t]);
	return (
		<>
			<Head>
				<title>{ t("activation|please") }</title>
			</Head>
			<Card>
				<div className={ styles.container }>
					<h1>{ t("activation|please") }</h1>
					<p>
						{ t("activation|checkMailLogin", {
							email: props.user.email
						}) }
					</p>
					<Button
						className={ styles.resendButton }
						kind="primary"
						onClick={ resend }
					>
						{ t("activation|resend") }
					</Button>
					<p className={ styles.offset }>
						{ t("activation|invalidateNotice") }
					</p>
					{
						hasPressed && (
							<p>{ feedback }</p>
						)
					}
				</div>
			</Card>
		</>
	);
};
export default ActivateAccount;
