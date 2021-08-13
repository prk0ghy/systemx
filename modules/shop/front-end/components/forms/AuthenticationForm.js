import Button from "components/inputs/Button";
import cx from "classnames";
import Form from "components/forms/Form";
import styles from "./AuthenticationForm.module.css";
const AuthenticationForm = ({
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
export default AuthenticationForm;
