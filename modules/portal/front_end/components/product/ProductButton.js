import dynamic from "next/dynamic";
import { useAuthentication } from "contexts/Authentication";
import { useCallback } from "react";
import { useCart } from "contexts/Cart";
import { useRouter } from "next/router";

const Button = dynamic(() => import("components/inputs/Button"), {
	ssr: false
});

const ProductButton = ({
	product
}) => {
	const { id, group, contentUri, price } = product;
	const router = useRouter();
	const [{ user }] = useAuthentication();
	const [{ items }, dispatch] = useCart();
	const hasAccess = Boolean(user?.groups[group]);

	const shopButtonText = price
		? items.includes(id)
			? "Aus dem Warenkorb"
			: "In den Warenkorb"
		: "Bitte Einloggen";
	const buttonText = hasAccess
		? "Inhalt ansehen"
		: shopButtonText;

	const onClick = useCallback(() => {
		if (hasAccess) {
			window.location = contentUri;
		}
		else {
			if (price) {
				dispatch({
					data: {
						id
					},
					type: items.includes(id)
						? "REMOVE_ITEM"
						: "ADD_ITEM"
				});
			}
			else {
				router.push(`/login`);
			}
		}
	}, [
		contentUri,
		dispatch,
		id,
		hasAccess,
		items,
		price,
		router
	]);

	return (
		<Button onClick={ onClick }>{ buttonText }</Button>
	);
};
export default ProductButton;
