import persistence, { save } from "root/persistence";
import { createContainer } from "react-tracked";
import { useReducer } from "react";
import { findProduct } from "user-login-common/product";
const reduce = (state, action) => {
	const { data } = action;
	switch (action.type) {
	case "ADD_ITEM": {
		const newItems = state.items.includes(data.id)
			? state.items
			: state.items.concat(data.id).sort();
		const newState = {
			...state,
			items: newItems.filter(findProduct)
		};
		save(persistence => {
			persistence.contexts.cart = newState;
		});
		return newState;
	}
	case "CLEAR_ITEMS": {
		const newState = {
			...state,
			items: []
		};
		save(persistence => {
			persistence.contexts.cart = newState;
		});
		return newState;
	}
	case "REMOVE_ITEM": {
		const newItems = state.items.filter(v => v !== data.id).filter(findProduct);
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
