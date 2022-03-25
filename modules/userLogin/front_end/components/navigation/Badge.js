import styles from "./Badge.module.css";
import cx from "classnames";
import Picture from "../generics/Picture";
import Link from "next/link";
const Badge = ({
	className,
	details = false,
	product
}) => {
	const {
		description,
		name,
		preview,
		date
	} = product;
	const productUrl = details
		? `/product/$(product.id)}`
		: product.contentUri;
	const isEvent = date !== "";
	const titleField = isEvent
		? name + " " + date
		: name;
	const picture = {
		...preview,
		alt: description
	};
	return (
		<li className={ cx(styles.libraryItem, className) }>
			<Link href={ productUrl }>
				<a className={ styles.libraryLink } title={ titleField }>
					{ isEvent
						? (
							<>
								<div className={ styles.title }>
									{ name.length > 40
										? name.slice(0, 40) + "..."
										: name
									}
								</div>
								<label>
									{ date.length > 13
										? date.slice(0, 13) + "..."
										: date
									}
								</label>
							</>
						)
						: <label>{ name }</label>
					}
					<Picture className={ styles.image } { ...picture }/>
				</a>
			</Link>
		</li>
	);
};
export default Badge;
