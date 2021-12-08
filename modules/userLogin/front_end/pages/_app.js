import "wicg-inert";
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
export default Application;
