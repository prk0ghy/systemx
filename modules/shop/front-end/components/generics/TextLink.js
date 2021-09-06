import Link from "next/link";
import styles from "./TextLink.module.css";
const TextLink = ({
	children,
	href,
	align
}) => (
	<Link href={ href }>
		<a align={ align } className={ styles.textLink }>{ children }</a>
	</Link>
);
export default TextLink;
