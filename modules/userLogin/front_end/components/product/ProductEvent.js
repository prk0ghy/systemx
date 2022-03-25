import Icon from "./details/Icon";
import { formatPrice } from "root/format";
import styles from "./ProductEvent.module.css";
import ProductButtonDetails from "./ProductButtonDetails";
import Link from "next/link";
import Picture from "../generics/Picture";
const Event = ({ product }) => {
	const isEvent = product.date !== "";
	const {
		caption, date, name, preview, price
	} = product;
	const container = isEvent
		? "false"
		: "true";
	const productLink = `/product/${encodeURIComponent(product.id)}`;
	const productName = caption + " " + name;
	return (
		<div className={ styles.event } is-book={ container }>
			<div className={ styles.img }>
				<Picture { ...preview }/>
			</div>
			<Link href={ productLink } passHref>
				<div className={ styles.name }>{ productName }</div>
			</Link>
			<Link href={ productLink } passHref>
				<div className={ styles.more }>mehr erfahren</div>
			</Link>
			<Icon className={ styles.icon } product={ product }/>
			{ isEvent
				? <div className={ styles.date }>{ date }</div>
				: null
			}
			<div className={ styles.price }>{ formatPrice(price) }</div>
			<ProductButtonDetails product={ product }/>
		</div>
	);
};
export default Event;
