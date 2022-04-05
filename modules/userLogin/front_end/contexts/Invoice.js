import persistence, { save } from "root/persistence";
import { createContainer } from "react-tracked";
import { useReducer } from "react";
const reduce = (state, action) => {
	const { data } = action;
	switch (action.type) {
	case "SET_INVOICE": {
		const newState = {
			...state,
			invoice: data
		};
		save(persistence => {
			persistence.contexts.invoice = newState;
		});
		return newState;
	}
	case "CLEAR_INVOICE": {
		const newState = {
			...state,
			invoice: {}
		};
		save(persistence => {
			persistence.contexts.invoice = newState;
		});
		return newState;
	}
	default: {
		throw new Error("Invalid invoice reduction");
	}
	}
};
export const {
	Provider: InvoiceProvider,
	useTracked: useInvoice
} = createContainer(() => useReducer(reduce, persistence.contexts.invoice || {
	invoice: {}
}));
