import styles from "./LibraryItem.module.css";
import cx from "classnames";
import Badge from "./Badge";
import Link from "next/dist/client/link";
const LibraryItem = ({
	className,
	showImage = false,
	product
}) => {
	const {
		name,
		preview,
		contentUri
	} = product;
	return (
		<li className={ cx(styles.libraryItem, className) }>
			{ showImage
				? <Badge picture={ preview }/>
				: (
					<Link href={ `/content${contentUri}` }>
						<a>
							<label>{ name }</label>
						</a>
					</Link>
				)
			}
		</li>
	);
};
export default LibraryItem;
