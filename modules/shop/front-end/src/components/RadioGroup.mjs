import { Field } from "formik";
import Labeled from "./Labeled.mjs";
import styles from "./RadioGroup.css";
export default ({
	label,
	name,
	options,
	...rest
}) => {
	const labels = Object.entries(options).map(([key, value]) => (
		<label key={ key }>
			<Field className={ styles.radio } name={ name } type="radio" value={ key } { ...rest }/>
			{ value }
		</label>
	));
	return (
		<div className={ styles.radioGroup }>
			<Labeled label={ label }>
				<div className={ styles.group } role="group" aria-labelledby={ name }>
					{ labels }
				</div>
			</Labeled>
		</div>
	);
};
