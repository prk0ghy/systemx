import dynamic from "next/dynamic";
import { useAuthentication } from "contexts/Authentication";
import { useCallback } from "react";
import { useCart } from "contexts/Cart";

const Button = dynamic(() => import("components/inputs/Button"), {
	ssr: false
});

const ProductButton = ({
	product
}) => {
	const [{ user }] = useAuthentication();
	const {id, group, contentUri, price} = product;
	console.log(user);

	const [{ items }, dispatch] = useCart();
	const shopButtonText = price
		? items.includes(id)
			? "Aus dem Warenkorb"
			: "In den Warenkorb"
		: "Nicht verfügbar";
	const buttonText = user?.groups[group]
		? "Inhalt ansehen"
		: shopButtonText;

	const onClick = useCallback(() => {
		if (user?.groups[group]) {
			window.location = contentUri;
		}
		else {
			dispatch({
				data: {
					id
				},
				type: items.includes(id)
					? "REMOVE_ITEM"
					: "ADD_ITEM"
			});
		}
	}, [
		contentUri,
		dispatch,
		id,
		items,
		user,
		group
	]);

	return (
		<Button onClick={ onClick }>{ buttonText }</Button>
	);
};
export default ProductButton;
