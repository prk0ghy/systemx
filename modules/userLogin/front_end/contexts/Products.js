import { createContainer } from "react-tracked";
import { useReducer } from "react";
import products from "userLoginCommon/productList";
const reduce = state => state;
export const {
	Provider: ProductsProvider,
	useTracked: useProducts
} = createContainer(() => {
	const dispatch = useReducer(reduce, null);
	return [{ products }, dispatch];
});
