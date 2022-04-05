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
		name: "mVet",
		subjectMatter: "Tiermedizin",
		pictures: {
			authentication: {
				src: "/mvet/ui/authentication.jpg",
				height: 1089,
				width: 1936
			},
			checkout: {
				src: "/mvet/ui/shopping.jpg",
				height: 860,
				width: 1920,
				objectPosition: "50% 0%"
			},
			conference: {
				src: "/mvet/ui/home.jpg",
				width: 1920,
				height: 1076
			},
			home: {
				src: "/mvet/ui/snek.jpg",
				width: 1920,
				height: 540
			},
			imprint: {
				src: "/mvet/ui/imprint.jpg",
				width: 1920,
				height: 1078,
				objectPosition: "66% 0%"
			},
			logo: {
				src: "/mvet/ui/logo.svg",
				width: 220,
				height: 220
			},
			orderComplete: {
				src: "/mvet/ui/complete.jpg",
				width: 1920,
				height: 1280,
				objectPosition: "16% 50%"
			},
			privacy: {
				src: "/mvet/ui/privacy.jpg",
				width: 1920,
				height: 1280
			},
			termsAndConditions: {
				src: "/mvet/ui/terms-and-conditions.jpg",
				width: 1920,
				height: 1280
			}
		}
	};
	const dispatch = useReducer(reduce, null);
	return [state, dispatch];
});
