import styles from "./Error.module.css";
const Error = ({
	children, msg
}) => {
	return (
		<div className={ styles.error }>
			{ msg }
			{ children }
		</div>
	);
};
export default Error;
