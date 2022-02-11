import { createContainer } from "react-tracked";
import { useReducer } from "react";
const reduce = state => state;
export const {
	Provider: ProductsProvider,
	useTracked: useProducts
} = createContainer(() => {
	const state = {
		products: [
			{
				caption: "Winterschool",
				description: `Die Winterschool Schlangen wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
				longDescription: `Die Winterschool Schlangen wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
				id: "schlangen",
				group: "schlangen",
				contentUri: "/schlangen/inhalt/startseite/index.html",
				name: "Schlangen",
				previewHeight: 863,
				previewURL: "/mvet/products/snake.jpg",
				previewWidth: 1381,
				color: "#919C0A",
				comingSoon: false,
				price: null
			},
			{
				caption: "Vogelnarkose",
				description: `Praxisnahes Angebot zum Thema Anästhesie und Analgesie beim Vogelpatienten mit zahlreichen Anschauungsbeispielen.`,
				longDescription: `Praxisnahes Angebot zum Thema Anästhesie und Analgesie beim Vogelpatienten mit zahlreichen Anschauungsbeispielen.`,
				id: "vogelnarkose",
				group: "vogelnarkose",
				contentUri: "/vogelnarkose/inhalt/startseite/index.html",
				name: "Tagesseminar",
				previewHeight: 863,
				previewURL: "/mvet/products/owl-sleeping.jpg",
				previewWidth: 1381,
				color: "#6C707B",
				comingSoon: false,
				price: null
			},
			{
				caption: "Exotenpraxis",
				description: `Das umfangreiche Exotenpraxis-Kompendium bietet nicht nur wichtige Informationen zu zahlreichen Tierarten und Krankheitsbildern, sondern auch interessante Einblicke in allgemeine Praxisabläufe.`,
				longDescription: `Das umfangreiche Exotenpraxis-Kompendium bietet nicht nur wichtige Informationen zu zahlreichen Tierarten und Krankheitsbildern, sondern auch interessante Einblicke in allgemeine Praxisabläufe.`,
				id: "exotenpraxis",
				group: "exotenpraxis",
				contentUri: "/exotenpraxis/inhalt/allgemeine-abläufe/index.html",
				name: "Exotenpraxis",
				previewHeight: 863,
				previewURL: "/mvet/products/peacock-1920x1080.jpg",
				previewWidth: 1381,
				color: "#16767D",
				price: null
			},
			{
				caption: "Echsen",
				description: `Die Summerschool Echsen wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
				longDescription: `Die Summerschool Echsen wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
				id: "echsen",
				group: "echsen",
				contentUri: "/echsen/inhalt/einleitung/index.html",
				name: "Summerschool",
				previewHeight: 863,
				previewURL: "/mvet/products/lizard-grey.jpg",
				previewWidth: 1381,
				color: "#417648",
				price: null
			},
			{
				caption: "Geflügel",
				description: `Die Summerschool Geflügel wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
				longDescription: `Die Summerschool Geflügel wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
				id: "gefluegel",
				group: "gefluegel",
				contentUri: "/gefluegel/inhalt/einleitung/index.html",
				name: "Summerschool",
				previewHeight: 863,
				previewURL: "/mvet/products/chicken.jpg",
				previewWidth: 1381,
				color: "#7D3619",
				price: null
			},
			{
				caption: "Vögel",
				description: `Diese Vertiefung zum Thema Vögel bietet Zusatzinformationen zu Themen wie Endokrinologie und Mangelerkrankungen.`,
				longDescription: `Diese Vertiefung zum Thema Vögel bietet Zusatzinformationen zu Themen wie Endokrinologie und Mangelerkrankungen.`,
				id: "voegel",
				group: "voegel",
				contentUri: "/voegel/inhalt/einleitung/index.html",
				name: "Vertiefung",
				previewHeight: 863,
				previewURL: "/mvet/products/songbird.jpg",
				previewWidth: 1381,
				color: "#A25A12",
				price: null
			},
			{
				caption: "Dermatologie",
				description: `Eine Sammlung spannender Vorträge und Aufsätze zum Schwerpunktthema Dermatologie bei Reptilien – von Hautveränderungen bei Würfelnattern über die Salamanderpest bis zum „Lebenden Boden“.`,
				longDescription: `Eine Sammlung spannender Vorträge und Aufsätze zum Schwerpunktthema Dermatologie bei Reptilien – von Hautveränderungen bei Würfelnattern über die Salamanderpest bis zum „Lebenden Boden“.`,
				id: "dermatologie",
				group: "dermatologie",
				contentUri: "/dermatologie/inhalt/einleitung/index.html",
				name: "Tagesseminar",
				previewHeight: 863,
				previewURL: "/mvet/products/lizard-green.jpg",
				previewWidth: 1381,
				color: "#5F6043",
				price: null
			},
			{
				caption: "Amphibien & Evertebraten",
				description: `Die Winterschool Amphibien & Evertebraten wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
				longDescription: `Die Winterschool Amphibien & Evertebraten wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
				id: "amphibien_wirbellose",
				group: "amphibien_wirbellose",
				contentUri: "/amphibien_wirbellose/inhalt/herzlich-willkommen-zum-mproceeding-der-ag-ark-winterschool-amphibien-und-evertebraten/index.html",
				name: "Winterschool",
				previewHeight: 863,
				previewURL: "/mvet/products/frog.jpg",
				previewWidth: 1381,
				color: "#68A603",
				price: null
			},
			{
				caption: "Zoovögel",
				description: `Der Tagungsband zur Winterschool Zoovögel behandelt zahlreiche Tierarten sowie Tipps zum Transport, Monitoring, Quarantäne und vieles mehr.`,
				longDescription: `Der Tagungsband zur Winterschool Zoovögel behandelt zahlreiche Tierarten sowie Tipps zum Transport, Monitoring, Quarantäne und vieles mehr.`,
				id: "zoovoegel",
				group: "zoovoegel",
				contentUri: "/zoovoegel/inhalt/einleitung/index.html",
				name: "Winterschool",
				previewHeight: 863,
				previewURL: "/mvet/products/flamingo.jpg",
				previewWidth: 1381,
				color: "#D9464E",
				price: null
			},
			{
				caption: "Bartagamen",
				description: `Zum Schwerpunktthema Bartagamen findet sich hier eine Übersicht der verschiedenen Arten und ihrer Haltung sowie detailliert beschriebener Krankheitsbilder.`,
				longDescription: `Zum Schwerpunktthema Bartagamen findet sich hier eine Übersicht der verschiedenen Arten und ihrer Haltung sowie detailliert beschriebener Krankheitsbilder.`,
				id: "bartagamen",
				group: "bartagamen",
				contentUri: "/bartagamen/inhalt/einleitung/index.html",
				name: "Tagesseminar",
				previewHeight: 863,
				previewURL: "/mvet/products/lizard-green.jpg",
				previewWidth: 1381,
				color: "#956820",
				price: null
			},
			{
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
			},
			{
				caption: "Anästhesie und Analgesie bei Reptilien, Amphibien und Wirbellosen",
				description: `Einzigartige Mischung aus Theorie und Praxis. Sabine Öfner und Hermann Kempf liefern Praxiswissen aus fast zwei Jahrzehnten einschlägiger Berufserfahrung.`,
				longDescription: `Einzigartige Mischung aus Theorie und Praxis. Sabine Öfner und Hermann Kempf liefern Praxiswissen aus fast zwei Jahrzehnten einschlägiger Berufserfahrung.`,
				id: "anaesthesie_reptilien",
				group: "anaesthesie_reptilien",
				contentUri: "/anaesthesie_reptilien/inhalt/herzlich-willkommen/index.html",
				name: "Tagesseminar",
				previewHeight: 863,
				previewURL: "/mvet/products/lizard.jpg",
				previewWidth: 1381,
				price: null
			}
		]
	};
	const dispatch = useReducer(reduce, null);
	return [state, dispatch];
});
