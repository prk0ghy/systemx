/* Just a way to separate out our default config from the rest of
 * the options, most new targets should just be added here, of course
 * care must be taken to ensure that no secrets are commited.
 */

const defaultTargets = {
	bdv: {
		graphqlEndpoint: "https://bdv.test-dilewe.de/api",
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8056
			}
		}
	},
	bm: {
		graphqlEndpoint: "https://bm.test-dilewe.de/api",
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8053
			}
		}
	},
	juramuseum: {
		disableMarkers: true,
		favicon: "juramuseum",
		graphqlEndpoint: "https://systemx-jura-museum.test-dilewe.de/api",
		jsVars: {
			galleryWrapAround: false,
			ytCaption: true,
			accessibility: false
		},
		cssVars: {
			backgroundBlue:  "rgba(0,0,0,0)",
			backgroundRed:   "rgba(0,0,0,0)",
			backgroundGreen: "rgba(0,0,0,0)",
			fontContent:     "Franklin",
			fontHeadlines:   "Franklin"
		},
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8049
			}
		}
	},
	lasub: {
		disallowRobots: true,
		favicon: "lasub",
		graphqlEndpoint: "https://lasub.dilewe.de/api",
		jsVars: {
			trackingEndpoint: "https://tracking.dilewe.de/stats",
			galleryBackgroundOpacity: 0.95
		},
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8042
			},
			tracking: {
				activeModule: "userTracking",
				httpPort: 9090
			},
			admin: {
				activeModule: 'administration',
				httpPort: 5000
			}
		}
	},
	leipzig: {
		graphqlEndpoint: "https://archiv-buergerbewegung-leipzig.test-dilewe.de/api",
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8052
			}
		}
	},
	rdhessen: {
		graphqlEndpoint: "https://rdhessen.test-dilewe.de/api",
		favicon: "rdhessen",
		navigationLinks: [{href: "https://mediathek.russlanddeutsche-hessen.de/", text: "Link zur Mediathek", target:"_blank"}],
		title: "Infoportal Russlanddeutsche in Hessen",
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8048
			}
		}
	},
	stifterverband: {
		graphqlEndpoint: "https://stifterverband.test-dilewe.de/api",
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8050
			}
		}
	},
	tagungsbaende: {
		backLink: "https://tagungsbaende.dilewe.de/",
		graphqlEndpoint: "https://redaktion-tagungsbaende.test-dilewe.de/api",
		usesStartpageReference: false,
		title: "mVet",
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8051
			},
			shop: {
				activeModule: "userLogin",
				httpPort: 8020
			}
		},
		portal: {
			frontEndVariables: {
				api: {
					endpoint: "https://tagungsbaende.dilewe.de/portal-user"
				},
				userDelete: {
					enabled: true
				}
			},mounts: [
				{
					url: "/resources/",
					localDir: "/var/www/html/dilewe.de/systemx/web/tagungsbaende/resources/"
				},{
					url: "/vogelinternistik2/",
					localDir: "/var/www/html/dilewe.de/systemx/web/tagungsbaende/vogelinternistik2/",
					userGroup: "vogelinternistik2"
				},{
					url: "/anaesthesie_reptilien/",
					localDir: "/var/www/html/dilewe.de/systemx/web/tagungsbaende/anaesthesie_reptilien/",
					userGroup: "anaesthesie_reptilien"
				}
			]
		}
	},
	missio: {
		graphqlEndpoint: "https://redaktion-missio.test-dilewe.de/api",
		title: "mPublish Inklusion Missio",
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8062
			}
		}
	},
	geografie: {
		graphqlEndpoint: "https://redaktion-geografie.test-dilewe.de/api",
		title: "mPublish Geografie",
		targets: {
			preview: {
				action: 'preview',
				httpPort: 8064
			}
		}
	}
};
export default defaultTargets;
