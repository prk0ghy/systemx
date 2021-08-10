import cx from "classnames";
import { Form } from "formik";
import styles from "./Form.css";
export default ({
	children,
	className,
	...rest
}) => (
	<Form className={ cx(styles.form, className)} { ...rest }>
		{ children }
	</Form>
);
