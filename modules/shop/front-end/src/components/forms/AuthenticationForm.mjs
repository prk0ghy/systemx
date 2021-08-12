import Button from "components/inputs/Button.mjs";
import cx from "classnames";
import Form from "components/forms/Form.mjs";
import styles from "./AuthenticationForm.css";
export default ({
	children,
	className,
	description,
	submit,
	title
}) => {
	const authenticationClassName = cx(styles.authenticationForm, className);
	return (
		<div className={ authenticationClassName }>
			<h1 className={ styles.title }>{ title }</h1>
			<div className={ styles.description }>{ description }</div>
			<Form>
				{ children }
				<Button className={ styles.submit } kind="primary" type="submit">{ submit }</Button>
			</Form>
		</div>
	);
};
