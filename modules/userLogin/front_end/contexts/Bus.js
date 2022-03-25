import { createContainer } from "react-tracked";
import persistence, { save } from "root/persistence";
import { useReducer } from "react";
const reduce = (state, action) => {
	switch (action.type) {
	case "CONSENT_TO_PAY_PAL": {
		save(persistence => {
			persistence.hasPayPalConsent = true;
		});
		return {
			...state,
			hasPayPalConsent: true
		};
	}
	case "OPEN_HEADER": {
		return {
			...state,
			isMinimized: false
		};
	}
	case "CLOSE_HEADER": {
		return {
			...state,
			isMinimized: true
		};
	}
	case "TOGGLE_SIDE_MENU": {
		return {
			...state,
			isSideMenuOpen: !state.isSideMenuOpen
		};
	}
	case "CLOSE_SIDE_MENU": {
		return {
			...state,
			isSideMenuOpen: false
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
	hasPayPalConsent: persistence.hasPayPalConsent || false,
	isSideMenuOpen: false,
	isMinimized: false
}));
