import { Field } from "formik";
import Labeled from "./Labeled";
import styles from "./RadioGroup.module.css";
const RadioGroup = ({
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
				<div aria-labelledby={ name } className={ styles.group } role="group">
					{ labels }
				</div>
			</Labeled>
		</div>
	);
};
export default RadioGroup;
