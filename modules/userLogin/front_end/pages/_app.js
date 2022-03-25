import { appWithTranslation } from "next-i18next";
import "../styles/index.css";
import Shell from "components/shell/Shell";
const Application = ({
	Component,
	pageProps
}) => (
	<Shell>
		<Component { ...pageProps }/>
	</Shell>
);
export default appWithTranslation(Application);
