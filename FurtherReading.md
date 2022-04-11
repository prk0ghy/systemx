# What does it do ???

---

### Some notes and useful info collected in an unordered format.
´npm run build tagungsbaende´

```bash
The script it will execute
          |
         \ /
          .
node ./index.mjs --clean-build -- "tagungsbaende"
  .
 / \
  |
This executes Node.js scripts

```

## Internal workings for commandline options

internally we use a method that converts all commandline options like this:

```JavaScript
// modules/common/options.mjs line 150ff
for (const arg in argv) {
	const optionName = arg.replace(/-[a-z]/g, $1 => `${$1.slice(1).toUpperCase()}`);
	if (Object.hasOwnProperty.call(options, optionName)) {
		options[optionName] = argv[arg];
	}
}
```
this causes command line options like
`--clean-build` to be converted to `cleanBuild`

# Benutzer anlegen in den Tagungsbänden
- (userLogin mit gemounteter contentpipeline)
- (tagungsbände = alter shop)
- --> über filesystem
`/var/www/html/dilewe.de/systemx/.systemx/storage/local_data.sqlite`
- --> runterladen, backup, öffnen
- --> in lokales systemx kopieren
- --> mit `/var/www/html/systemx/modules/userLogin/back_end/data/user.json` anlegen
`npm run dev:shop`
- --> user wird angelegt

# Gruppe hinzufügen
= Zeile mit userID und gruppenname in tabelle "UserGrouping" einfügen.

## Add a new Product to the userLogin Module

in file:
`/var/www/html/systemx/modules/userLogin/front_end/contexts/Products.js`
--> Add new json object
i.e. in Array products:
```JavaScript
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
```


# How to deploy a target

systemx@<defaulttarget>.<defaultmodule>.service

--> deploys a service from `modules/common/defaultTargets.mjs`

i.e. tagungsbände

```JavaScript

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
			},
			dev: {
				portal: {
					frontEndVariables: {
						api: {
							endpoint: "http://localhost:8020/portal-user"
						}
					}
				}
			}
		},
```

to deploy the "contentPipeline" with setting preview mode (dynamic site):

`ln -s /var/www/html/systemx/systemx@.service /ets/systemd/system/systemx@tagunsbaende.preview.system`


## contentPipeline Modes

### Previewe mode
--> when a user clicks on a site it will be generated from a GraphQL query

### Static mode
--> All sites will be built from graphql, the content will not change when editing in the graphql source
