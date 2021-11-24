import cx from "classnames";
import Error from "components/forms/Error";
import { Field } from "formik";
import Labeled from "components/inputs/Labeled";
import styles from "./Input.module.css";
const Input = ({
	className,
	label,
	name,
	...rest
}) => (
	<div className={ styles.input }>
		<Labeled label={ label }>
			<Field className={ cx(styles.field, className) } name={ name } { ...rest }/>
			<Error name={ name }/>
		</Labeled>
	</div>
);
export default Input;
