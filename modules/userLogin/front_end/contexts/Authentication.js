import { createContainer } from "react-tracked";
import { useReducer } from "react";
const reduce = (state, action) => {
	const { data } = action;
	switch (action.type) {
	case "SET_USER_DATA": {
		return {
			...state,
			user: data.user
		};
	}
	default: {
		throw new Error("Unknown authentication reduction");
	}
	}
};
export const {
	Provider: AuthenticationProvider,
	useTracked: useAuthentication
} = createContainer(() => useReducer(reduce, {
	user: null
}));
