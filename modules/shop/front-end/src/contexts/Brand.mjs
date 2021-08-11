import { createContainer } from "react-tracked";
import { useReducer } from "react";
const reduce = (state, action) => {
	switch (action.type) {
		case "ADD_ITEM": {
			return state;
		}
		default: {
			throw new Error("Unknown brand reduction");
		}
	}
};
export const {
	Provider: BrandProvider,
	useTracked: useBrand
} = createContainer(() => {
	const state = {
		assetBaseURL: "/assets/mvet",
		name: "mVet"
	};
	const dispatch = useReducer(reduce, null);
	return [state, dispatch];
});
