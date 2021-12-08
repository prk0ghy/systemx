import cx from "classnames";
import styles from "./ButtonLink.module.css";

const ButtonLink = ({
	children,
	className,
	onClick,
	...rest
}) => {
	const buttonClassName = cx(styles.button, className);
	return (
		<a className={ buttonClassName } onClick={ onClick } { ...rest }>
			{ children }
		</a>
	);
};
export default ButtonLink;
