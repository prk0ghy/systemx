import countries from "i18n-iso-countries";
import { Field } from "formik";
import german from "i18n-iso-countries/langs/de.json";
import Labeled from "components/inputs/Labeled.mjs";
import styles from "./CountrySelector.css";
countries.registerLocale(german);
const data = countries.getNames("de");
export default ({
	label,
	...rest
}) => {
	const options = Object.entries(data).map(([key, value]) => (
		<option key={ key } value={ key }>{ value }</option>
	));
	return (
		<div className={ styles.countrySelector }>
			<Labeled label={ label }>
				<Field as="select" className={ styles.options } { ...rest }>
					{ options }
				</Field>
			</Labeled>
		</div>
	);
};
