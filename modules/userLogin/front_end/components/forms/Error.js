import { ErrorMessage } from "formik";
import styles from "./Error.module.css";
const Error = ({ name }) => (
	name
		? (
			<div className={ styles.error }>
				<ErrorMessage name={ name }/>
			</div>
		)
		: null
);
export default Error;
