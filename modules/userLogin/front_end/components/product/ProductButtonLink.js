import Button from "components/inputs/Button";
import { useTranslation } from "next-i18next";
import Link from "next/dist/client/link";
const ProductButton = ({ product }) => {
	const { t } = useTranslation("common");
	return (
		<Link href={ `/product/${encodeURIComponent(product.id)}` }>
			<Button>{ t("products|toSelection") }</Button>
		</Link>
	);
};
export default ProductButton;
