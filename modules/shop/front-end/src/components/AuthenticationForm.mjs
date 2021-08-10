import cx from "classnames";
import Button from "components/Button.mjs";
import Form from "components/Form.mjs";
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
			<p className={ styles.description }>{ description }</p>
			<Form>
				{ children }
				<Button className={ styles.submit } kind="primary" type="submit">{ submit }</Button>
			</Form>
		</div>
	);
};
