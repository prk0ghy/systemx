import { useEffect, useState } from "react";
import { userActivationCheck, userActivationSubmit } from "root/api";
import Card from "../../generics/Card.js";
import styles from "./ActivateAccount.module.css";
import { useTranslation } from "next-i18next";
const ActivateAccount = props => {
	const { t } = useTranslation("common");
	const [error, setError] = useState(undefined);
	const [isValidToken, setIsValidToken] = useState(false);
	const [isActivated, setIsActivated] = useState(false);
	const { token } = props;
	useEffect(() => {
		(async () => {
			try {
				const resp = await userActivationCheck(token);
				setIsValidToken(resp.activationHashFound);
				if (resp.activationHashFound) {
					const submitResponse = await userActivationSubmit(token);
					setIsActivated(submitResponse.userActivated);
				}
			}
			catch (error) {
				setError(error);
			}
		})();
	}, [token]);
	useEffect(() => {
		if (isActivated) {
			setTimeout(() => {
				window.location.href = localStorage.getItem("Portal_Session_Token")
					? "/"
					: "/login";
			}, 1500);
		}
	}, [isActivated]);
	return (
		<Card>
			<div className={ styles.container }>
				{
					!isValidToken
						? 	(
							<>
								<h2>{ t("invalidRequest") }</h2>
								<p>{ t("yourInvalidRequest") }</p>
							</>
						)
						: (
							<>
								{
									isActivated
										? 	(
											<>
												<h2>{ t("activation|success") }</h2>
												<p>{ t("activation|redirect") }</p>
											</>
										)
										: 	(
											<>
												<h2>{ t("activation|failure") }</h2>
												<p>{ t("activation|support") } <a href="mailto:info@dilewe.de">info@dilewe.de</a></p>
											</>
										)
								}
							</>
						)
				}
				{ error && <>{ error }</> }
			</div>
		</Card>
	);
};
export default ActivateAccount;
