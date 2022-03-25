import dynamic from "next/dynamic";
import Button from "../inputs/Button";
import { useAuthentication } from "contexts/Authentication";
import { useCallback } from "react";
import { useCart } from "contexts/Cart";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
const ProductButton = ({ product }) => {
	const { t } = useTranslation("common");
	const {
		id, group, contentUri, price, comingSoon
	} = product;
	const router = useRouter();
	const [{ user }] = useAuthentication();
	const [{ items }, dispatch] = useCart();
	const hasAccess = Boolean(user?.groups[group]);
	const shopButtonText = price
		? items.includes(id)
			? t("cart|removeFromCart")
			: t("cart|addToCart")
		: comingSoon
			? t("cart|availableShortly")
			: user?.groups
				? t("cart|locked")
				: t("pleaseLogin");
	const buttonText = hasAccess
		? t("cart|viewContent")
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
		<Button kind="primary" onClick={ onClick }>{ buttonText }</Button>
	);
};
export default dynamic(() => Promise.resolve(ProductButton), {
	ssr: false
});
