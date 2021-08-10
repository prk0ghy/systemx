import cx from "classnames";
import { Field } from "formik";
import Labeled from "components/Labeled.mjs";
import styles from "./Input.css";
export default ({
	className,
	label,
	...rest
}) => (
	<div className={ styles.input }>
		<Labeled label={ label }>
			<Field className={ cx(styles.field, className) } { ...rest }/>
		</Labeled>
	</div>
);
