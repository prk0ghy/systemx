

# what does it do???

´npm run build tagungsbaende´

´´´bash
The script it will execute        
          |
         \ /
          .
node ./index.mjs --clean-build -- "tagungsbaende"
  .
 / \
  |
This executes Node.js scripts

´´´


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
