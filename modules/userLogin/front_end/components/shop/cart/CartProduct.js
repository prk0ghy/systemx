import { formatPrice } from "root/format";
import styles from "./CartProduct.module.css";
import { useCallback } from "react";
import { useCart } from "contexts/Cart";
const CartProduct = ({
	id,
	name,
	caption,
	price,
	readOnly = false
}) => {
	const [, dispatch] = useCart();
	const onClick = useCallback(() => {
		dispatch({
			data: {
				id
			},
			type: "REMOVE_ITEM"
		});
	}, [
		dispatch,
		id
	]);
	return (
		<div className={ styles.product }>
			{
				readOnly
					? null
					: <div className={ styles.remove } onClick={ onClick }/>
			}
			<div className={ styles.name }>{ name }</div>
			<div className={ styles.caption }>{ caption }</div>
			<div className={ styles.price }>{ formatPrice(price) }</div>
		</div>
	);
};
export default CartProduct;
