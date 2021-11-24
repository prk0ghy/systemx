import Button from "components/inputs/Button";
import { useCallback } from "react";
import { useRouter } from "next/router";

const ProductButton = ({
	productId
}) => {
	const router = useRouter();
	const onClick = useCallback(() => {
		router.push(`/product/${productId}`);
	}, [
		productId,
		router
	]);
	return (
		<Button onClick={ onClick }>Zur Auswahl</Button>
	);
};
export default ProductButton;
