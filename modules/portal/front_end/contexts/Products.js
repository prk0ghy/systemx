import { createContainer } from "react-tracked";
import { useReducer } from "react";
const reduce = state => state;
export const {
	Provider: ProductsProvider,
	useTracked: useProducts
} = createContainer(() => {
	const state = {
		products: [{
			caption: "Vogelinternistik II",
			description: `Mit Fällen zu den Schwerpunkten Neurologie, Dermatologie und Endokrinologie ergänzt sich das Angebot hervorragend mit dem ersten Teil.`,
			longDescription: `Aufgrund der hohen Nachfrage haben wir unser beliebtes Tagesseminar "Internistik beim Vogelpatienten" in die zweite Runde geschickt.

			Mit Fällen zu den Schwerpunkten Neurologie, Dermatologie und Endokrinologie ergänzt sich das Angebot hervorragend mit dem ersten Teil.

			Auch diesmal haben wir wieder versucht möglichst viele praxisrelevante Fälle aller Schwierigkeitsstufen zu kombinieren und natürlich ist auch das eine oder andere ausgefallene "Schmankerl" mit dabei.`,
			id: "vogelinternistik_ii",
			group: "vogelinternistik2",
			contentUri: "/vogelinternistik2/inhalt/startseite/index.html",
			name: "Tagesseminar",
			previewHeight: 863,
			previewURL: "/mvet/products/bird.jpg",
			previewWidth: 1381,
			price: null
		}]
	};
	const dispatch = useReducer(reduce, null);
	return [state, dispatch];
});
