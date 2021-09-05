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
		authenticationPreviewHeight: 1089,
		authenticationPreviewURL: "/mvet/ui/authentication.jpg",
		authenticationPreviewWidth: 1936,
		homePreviewHeight: 1076,
		homePreviewURL: "/mvet/ui/home.jpg",
		homePreviewWidth: 1920,
		imprintPreviewHeight: 1078,
		imprintPreviewURL: "/mvet/ui/imprint.jpg",
		imprintPreviewWidth: 1920,
		logoHeight: 220,
		logoURL: "/mvet/ui/logo.png",
		logoWidth: 220,
		name: "mVet",
		privacyPreviewHeight: 1280,
		privacyPreviewURL: "/mvet/ui/privacy.jpg",
		privacyPreviewWidth: 1920,
		subjectMatter: "Tiermedizin",
		termsAndConditionsPreviewHeight: 1280,
		termsAndConditionsPreviewURL: "/mvet/ui/terms-and-conditions.jpg",
		termsAndConditionsPreviewWidth: 1920
	};
	const dispatch = useReducer(reduce, null);
	return [state, dispatch];
});
