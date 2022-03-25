import Button from "components/inputs/Button";
import ProductButton from "./ProductButton";
import Link from "next/dist/client/link";
import { useTranslation } from "next-i18next";
const ProductButtonDetails = ({ product }) => {
	const { t } = useTranslation("common");
	const isEvent = false;
	return isEvent
		? (
			<Link href={ `/product/${encodeURIComponent(product.id)}` }>
				<Button>{ t("products|participate") }</Button>
			</Link>
		)
		: <ProductButton product={ product }/>
	;
};
export default ProductButtonDetails;
