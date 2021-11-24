import cx from "classnames";
import Link from "next/link";
import styles from "./TextLink.module.css";
const TextLink = ({
	children,
	className,
	href,
	align
}) => (
	<Link href={ href }>
		<a align={ align } className={ cx(styles.textLink, className) }>{ children }</a>
	</Link>
);
export default TextLink;
