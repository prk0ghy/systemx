import { useTranslation } from "next-i18next";
const ActivationNotice = ({ email }) => {
	const { t } = useTranslation("common");
	return (
		<>
			<h2>{ t("activation|welcome") }</h2>
			<p>
				{ t("activation|checkMail", {
					email
				}) }
			</p>
		</>
	);
};
export default ActivationNotice;
