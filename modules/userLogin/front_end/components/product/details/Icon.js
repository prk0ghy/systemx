import styles from "./Icon.module.css";
const ProductButtonDetails = ({
	className,
	product
}) => {
	const isEvent = product.date !== "";
	return isEvent
		? <div className={ [styles.icon, styles.date, className].join(" ") }/>
		: <div className={ [styles.icon, styles.book, className].join(" ") }/>
	;
};
export default ProductButtonDetails;
