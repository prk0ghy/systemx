import cx from "classnames";
import { Field } from "formik";
import Labeled from "components/inputs/Labeled";
import styles from "./Input.module.css";
const Input = ({
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
export default Input;
