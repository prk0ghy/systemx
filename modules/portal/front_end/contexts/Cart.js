import persistence, { save } from "root/persistence";
import { createContainer } from "react-tracked";
import { useReducer } from "react";
const reduce = (state, action) => {
	const { data } = action;
	switch (action.type) {
		case "ADD_ITEM": {
			const newItems = state.items.includes(data.id)
				? state.items
				: state.items.concat(data.id).sort();
			const newState = {
				...state,
				items: newItems
			};
			save(persistence => {
				persistence.contexts.cart = newState;
			});
			return newState;
		}
		case "REMOVE_ITEM": {
			const newItems = state.items.includes(data.id)
				? (() => {
					const occurenceIndex = state.items.indexOf(data.id);
					const before = state.items.slice(0, occurenceIndex);
					const after = state.items.slice(occurenceIndex + 1);
					return before.concat(after);
				})()
				: state.items;
			const newState = {
				...state,
				items: newItems
			};
			save(persistence => {
				persistence.contexts.cart = newState;
			});
			return newState;
		}
		default: {
			throw new Error("Invalid cart reduction");
		}
	}
};
export const {
	Provider: CartProvider,
	useTracked: useCart
} = createContainer(() => useReducer(reduce, persistence.contexts.cart || {
	items: []
}));
