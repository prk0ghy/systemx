import { createContainer } from "react-tracked";
import { useReducer } from "react";
const reduce = state => state;
export const {
	Provider: ProductsProvider,
	useTracked: useProducts
} = createContainer(() => {
	const state = {
		groups: [{
			name: "kapitel1",
			products: [{
				id: "abc"
			}]
		}]
	};
	const dispatch = useReducer(reduce, null);
	return [state, dispatch];
});
