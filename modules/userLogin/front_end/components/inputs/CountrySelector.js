import countries from "i18n-iso-countries";
import { Field } from "formik";
import Error from "components/forms/Error";
import german from "i18n-iso-countries/langs/de.json";
import Labeled from "components/inputs/Labeled";
import styles from "./CountrySelector.module.css";
countries.registerLocale(german);
const data = countries.getNames("de");
const CountrySelector = ({
	label,
	name,
	...rest
}) => {
	const options = Object.entries(data).map(([key, value]) => (
		<option key={ key } value={ key }>{ value }</option>
	));
	return (
		<div className={ styles.countrySelector }>
			<Labeled label={ label }>
				<Field as="select" className={ styles.options } name={ name } { ...rest }>
					<option key="" value=""> -- Bitte wählen -- </option>
					{ options }
				</Field>
			</Labeled>
			<Error name={ name }/>
		</div>
	);
};
export default CountrySelector;
