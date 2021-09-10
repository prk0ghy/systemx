import { createContainer } from "react-tracked";
import { useReducer } from "react";
const reduce = (state, action) => {
	const { data } = action;
	switch (action.type) {
		case "CONSENT_TO_PAY_PAL": {
			return {
				...state,
				hasOneTimePayPalConsent: true
			};
		}
		case "TOGGLE_SIDE_MENU": {
			return {
				...state,
				isSideMenuOpen: !state.isSideMenuOpen
			};
		}
		default: {
			throw new Error("Unknown bus reduction");
		}
	}
};
export const {
	Provider: BusProvider,
	useTracked: useBus
} = createContainer(() => useReducer(reduce, {
	hasOneTimePayPalConsent: false,
	isSideMenuOpen: false
}));
