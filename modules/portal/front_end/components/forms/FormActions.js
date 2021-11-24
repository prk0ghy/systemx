import { Children, cloneElement } from "react";
import styles from "./FormActions.module.css";
const FormActions = ({ children }) => (
	<ul className={ styles.formActions }>
		{
			Children.map(children, child => (
				<li className={ styles.action }>
					{ cloneElement(child) }
				</li>
			))
		}
	</ul>
);
export default FormActions;
