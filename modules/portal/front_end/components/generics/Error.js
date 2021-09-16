import styles from "./Error.module.css";
import Translate from "root/translate";
const Error = ({ children, msg }) => {
	const text = Translate(msg) || msg;
	return (
		<div className={ styles.error }>
			{ text }
			{ children }
		</div>
	);
};
export default Error;
