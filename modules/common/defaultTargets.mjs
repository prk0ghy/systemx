/* Just a way to separate out our default config from the rest of
 * the options, most new targets should just be added here, of course
 * care must be taken to ensure that no secrets are commited.
 */

const defaultTargets = {
    bdv: {
        graphqlEndpoint: "https://bdv.test-dilewe.de/api",
        httpPort: 8056
    },
    bm: {
        graphqlEndpoint: "https://bm.test-dilewe.de/api",
        httpPort: 8053
    },
    juramuseum: {
        disableMarkers: true,
        favicon: "juramuseum",
        graphqlEndpoint: "https://systemx-jura-museum.test-dilewe.de/api",
        httpPort: 8049,
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
        }
    },
    lasub: {
        graphqlEndpoint: "https://lasub.dilewe.de/api",
        httpPort: 8042,
        favicon: "lasub",
        disallowRobots: true,
        startTracking: true,
        jsVars: {
            trackingEndpoint: "https://tracking.dilewe.de/stats",
            galleryBackgroundOpacity: 0.95
        }
    },
    leipzig: {
        graphqlEndpoint: "https://archiv-buergerbewegung-leipzig.test-dilewe.de/api",
        httpPort: 8052
    },
    rdhessen: {
        graphqlEndpoint: "https://rdhessen.test-dilewe.de/api",
        httpPort: 8048,
        favicon: "rdhessen",
        title: "Infoportal Russlanddeutsche in Hessen"
    },
    stifterverband: {
        graphqlEndpoint: "https://stifterverband.test-dilewe.de/api",
        httpPort: 8050
    },
    tagungsbaende: {
        backLink: "https://tagungsbaende.dilewe.de/",
        graphqlEndpoint: "https://redaktion-tagungsbaende.test-dilewe.de/api",
        httpPort: 8051,
        usesStartpageReference: false,
        title: "mVet",
        portal: {
            frontEndVariables: {
                api: {
                    endpoint: "https://tagungsbaende.dilewe.de/portal-user"
                }
            },mounts: [
                {
                    url: "/resources/",
                    localDir: "/var/www/html/dilewe.de/tagungsbaende/web/tagungsbaende/resources/"
                },{
                    url: "/vogelinternistik2/",
                    localDir: "/var/www/html/dilewe.de/tagungsbaende/web/tagungsbaende/vogelinternistik2/",
                    userGroup: "vogelinternistik2"
                },{
                    url: "/anaesthesie_reptilien/",
                    localDir: "/var/www/html/dilewe.de/tagungsbaende/web/tagungsbaende/anaesthesie_reptilien/",
                    userGroup: "anaesthesie_reptilien"
                }
            ]
        }
    },
    missio: {
        graphqlEndpoint: "https://redaktion-missio.test-dilewe.de/api",
        httpPort: 8062,
        title: "mPublish Inklusion Missio"
    },
    geografie: {
        graphqlEndpoint: "https://redaktion-geografie.test-dilewe.de/api",
        httpPort: 8064,
        title: "mPublish Geografie"
    },
    lasubAdministration: {
        startTracking: false,
        startServer: false,
        startShop: false,
        startAdministration: true
    }
};
export default defaultTargets;