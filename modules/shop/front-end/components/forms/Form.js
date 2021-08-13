import cx from "classnames";
import { Form as FormikForm } from "formik";
import styles from "./Form.module.css";
const Form = ({
	children,
	className,
	...rest
}) => (
	<FormikForm className={ cx(styles.form, className) } { ...rest }>
		{ children }
	</FormikForm>
);
export default Form;
