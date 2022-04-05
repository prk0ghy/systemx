const products = [
	{
		caption: "Alle Tagungsbände",
		description: `hier finden Sie alle Tagungsbände als Einzelprodukt`,
		longDescription: `hier finden Sie alle Tagungsbände als Einzelprodukt`,
		id: "tagungsbaende",
		name: "Veranstaltungen und Tagungsbände",
		preview: {
			src: "/mvet/products/cameleon.jpg",
			width: 1920,
			height: 585,
			objectPosition: "25% 50%"
		},
		color: "#3E4162",
		comingSoon: false,
		price: null,
		children:
		[{
			caption: "Tagesseminar",
			description: `Praxisnahes Angebot zum Thema Anästhesie und Analgesie beim Vogelpatienten mit zahlreichen Anschauungsbeispielen.`,
			longDescription: `Praxisnahes Angebot zum Thema Anästhesie und Analgesie beim Vogelpatienten mit zahlreichen Anschauungsbeispielen.`,
			id: "tagesseminar_vogelnarkose",
			group: "tagesseminar_vogelnarkose",
			contentUri: "/vogelnarkose/inhalt/startseite/index.html",
			name: "Vogelnarkose",
			preview: {
				height: 863,
				src: "/mvet/products/owl-sleeping.jpg",
				width: 1381
			},
			color: "#6C707B",
			date: "",
			comingSoon: false,
			price: 0.03
		},
		{
			caption: "Exotenpraxis",
			description: `Das umfangreiche Exotenpraxis-Kompendium bietet nicht nur wichtige Informationen zu zahlreichen Tierarten und Krankheitsbildern, sondern auch interessante Einblicke in allgemeine Praxisabläufe.`,
			longDescription: `Das umfangreiche Exotenpraxis-Kompendium bietet nicht nur wichtige Informationen zu zahlreichen Tierarten und Krankheitsbildern, sondern auch interessante Einblicke in allgemeine Praxisabläufe.`,
			id: "exotenpraxis",
			group: "exotenpraxis",
			contentUri: "/exotenpraxis/inhalt/allgemeine-abläufe/index.html",
			name: "Exotenpraxis",
			preview: {
				height: 863,
				src: "/mvet/products/peacock-1920x1080.jpg",
				width: 1381
			},
			color: "#16767D",
			date: "",
			comingSoon: false,
			price: 0.01
		},
		{
			caption: "Summerschool",
			description: `Die Summerschool Echsen wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
			longDescription: `Die Summerschool Echsen wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
			id: "echsen",
			group: "echsen",
			contentUri: "/echsen/inhalt/einleitung/index.html",
			name: "Echsen",
			preview: {
				src: "/mvet/products/lizard-grey.jpg",
				width: 1381,
				height: 863
			},
			color: "#417648",
			date: "",
			comingSoon: false,
			price: 0.01
		},
		{
			caption: "Summerschool",
			description: `Die Summerschool Geflügel wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
			longDescription: `Die Summerschool Geflügel wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
			id: "gefluegel",
			group: "gefluegel",
			contentUri: "/gefluegel/inhalt/einleitung/index.html",
			name: "Geflügel",
			preview: {
				src: "/mvet/products/chicken.jpg",
				width: 1381,
				height: 863
			},
			color: "#7D3619",
			date: "",
			comingSoon: false,
			price: 0.01
		},
		{
			caption: "Vertiefung",
			description: `Diese Vertiefung zum Thema Vögel bietet Zusatzinformationen zu Themen wie Endokrinologie und Mangelerkrankungen.`,
			longDescription: `Diese Vertiefung zum Thema Vögel bietet Zusatzinformationen zu Themen wie Endokrinologie und Mangelerkrankungen.`,
			id: "voegel",
			group: "voegel",
			contentUri: "/voegel/inhalt/einleitung/index.html",
			name: "Vögel",
			preview: {
				src: "/mvet/products/songbird.jpg",
				width: 1381,
				height: 863
			},
			color: "#A25A12",
			date: "",
			comingSoon: false,
			price: 0.01
		},
		{
			caption: "Tagesseminar",
			description: `Eine Sammlung spannender Vorträge und Aufsätze zum Schwerpunktthema Dermatologie bei Reptilien – von Hautveränderungen bei Würfelnattern über die Salamanderpest bis zum „Lebenden Boden“.`,
			longDescription: `Eine Sammlung spannender Vorträge und Aufsätze zum Schwerpunktthema Dermatologie bei Reptilien – von Hautveränderungen bei Würfelnattern über die Salamanderpest bis zum „Lebenden Boden“.`,
			id: "dermatologie",
			group: "dermatologie",
			contentUri: "/dermatologie/inhalt/einleitung/index.html",
			name: "Dermatologie",
			preview: {
				src: "/mvet/products/lizard-green.jpg",
				height: 863,
				width: 1381
			},
			color: "#5F6043",
			date: "",
			comingSoon: false,
			price: null
		},
		{
			caption: "Winterschool",
			description: `Die Winterschool Amphibien & Evertebraten wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
			longDescription: `Die Winterschool Amphibien & Evertebraten wird von einem umfangreichen Tagungsband begleitet – von der Artbestimmung über Haltung, Ernährung, Anatomie und Diagnostik bis zur Behandlung verschiedenster Erkrankungen.`,
			id: "amphibien_wirbellose",
			group: "amphibien_wirbellose",
			contentUri: "/amphibien_wirbellose/inhalt/herzlich-willkommen-zum-mproceeding-der-ag-ark-winterschool-amphibien-und-evertebraten/index.html",
			name: "Amphibien & Evertebraten",
			preview: {
				src: "/mvet/products/frog.jpg",
				height: 863,
				width: 1381
			},
			color: "#68A603",
			date: "",
			comingSoon: false,
			price: null
		},
		{
			caption: "Winterschool",
			description: `Der Tagungsband zur Winterschool Zoovögel behandelt zahlreiche Tierarten sowie Tipps zum Transport, Monitoring, Quarantäne und vieles mehr.`,
			longDescription: `Der Tagungsband zur Winterschool Zoovögel behandelt zahlreiche Tierarten sowie Tipps zum Transport, Monitoring, Quarantäne und vieles mehr.`,
			id: "zoovoegel",
			group: "zoovoegel",
			contentUri: "/zoovoegel/inhalt/einleitung/index.html",
			name: "Zoovögel",
			preview: {
				src: "/mvet/products/flamingo.jpg",
				height: 863,
				width: 1381
			},
			color: "#D9464E",
			date: "",
			comingSoon: false,
			price: null
		},
		{
			caption: "Tagesseminar",
			description: `Zum Schwerpunktthema Bartagamen findet sich hier eine Übersicht der verschiedenen Arten und ihrer Haltung sowie detailliert beschriebener Krankheitsbilder.`,
			longDescription: `Zum Schwerpunktthema Bartagamen findet sich hier eine Übersicht der verschiedenen Arten und ihrer Haltung sowie detailliert beschriebener Krankheitsbilder.`,
			id: "bartagamen",
			group: "bartagamen",
			contentUri: "/bartagamen/inhalt/einleitung/index.html",
			name: "Bartagamen",
			preview: {
				src: "/mvet/products/lizard-green.jpg",
				height: 863,
				width: 1381
			},
			color: "#956820",
			date: "",
			comingSoon: false,
			price: null
		},
		{
			caption: "Tagesseminar",
			description: `Mit Fällen zu den Schwerpunkten Neurologie, Dermatologie und Endokrinologie ergänzt sich das Angebot hervorragend mit dem ersten Teil.`,
			longDescription: `Aufgrund der hohen Nachfrage haben wir unser beliebtes Tagesseminar "Internistik beim Vogelpatienten" in die zweite Runde geschickt.
			Mit Fällen zu den Schwerpunkten Neurologie, Dermatologie und Endokrinologie ergänzt sich das Angebot hervorragend mit dem ersten Teil.
			Auch diesmal haben wir wieder versucht möglichst viele praxisrelevante Fälle aller Schwierigkeitsstufen zu kombinieren und natürlich ist auch das eine oder andere ausgefallene "Schmankerl" mit dabei.`,
			id: "vogelinternistik2",
			group: "vogelinternistik2",
			contentUri: "/vogelinternistik2/inhalt/startseite/index.html",
			name: "Vogelinternistik II",
			preview: {
				src: "/mvet/products/bird.jpg",
				height: 863,
				width: 1381
			},
			date: "25.03.2022",
			proceedingsLink: "/product/amphibien_wirbellose",
			comingSoon: true,
			price: 0.02
		},
		{
			caption: "Tagesseminar",
			description: `Einzigartige Mischung aus Theorie und Praxis. Sabine Öfner und Hermann Kempf liefern Praxiswissen aus fast zwei Jahrzehnten einschlägiger Berufserfahrung.`,
			longDescription: `Einzigartige Mischung aus Theorie und Praxis. Sabine Öfner und Hermann Kempf liefern Praxiswissen aus fast zwei Jahrzehnten einschlägiger Berufserfahrung.`,
			id: "anaesthesie_reptilien",
			group: "anaesthesie_reptilien",
			contentUri: "/anaesthesie_reptilien/inhalt/herzlich-willkommen/index.html",
			name: "Anästhesie und Analgesie bei Reptilien, Amphibien und Wirbellosen",
			preview: {
				src: "/mvet/products/lizard.jpg",
				height: 863,
				width: 1381
			},
			date: "MO 22.3.2022 bis MI 24.3.2022",
			proceedingsLink: "/product/bartagamen",
			comingSoon: true,
			price: 0.02
		}]
	},
	{
		caption: "Tiermedizin",
		description: `Anders als Tierärzte, werden Händler in der Regel nicht mit den Langzeitfolgen ungeeigneter Haltungstechnik oder Futtermittel konfrontiert. Daher liegt es in der Verantwortung des reptilienkundigen Tiearztes mögliche Gefahrenquellen zu erkennen, zu benennen und zur Abschaffung zu raten.`,
		longDescription: `Anders als Tierärzte, werden Händler in der Regel nicht mit den Langzeitfolgen ungeeigneter Haltungstechnik oder Futtermittel konfrontiert. Daher liegt es in der Verantwortung des reptilienkundigen Tiearztes mögliche Gefahrenquellen zu erkennen, zu benennen und zur Abschaffung zu raten.`,
		id: "tiermedizin_vogelnarkose",
		group: "tiermedizin_vogelnarkose",
		contentUri: "/m-vet/inhalt/startseite/index.html",
		name: "Handbuch für Exotentiermediziner",
		preview: {
			src: "/mvet/products/turtle.jpg",
			height: 863,
			width: 1381,
			objectPosition: "25% 50%"
		},
		color: "#C8563C",
		comingSoon: false,
		price: 1.99
	}
];
export default products;
