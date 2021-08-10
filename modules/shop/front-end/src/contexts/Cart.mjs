import { createContainer } from "react-tracked";
import { useReducer } from "react";
const reduce = (state, action) => {
	const { data } = action;
	switch (action.type) {
		case "ADD_ITEM": {
			return data;
		}
	}
};
export const {
	Provider: CartProvider,
	useTracked: useCart
} = createContainer(() => {
	const state = {
		items: []
	};
	const dispatch = useReducer(reduce, null);
	return [state, dispatch];
});
