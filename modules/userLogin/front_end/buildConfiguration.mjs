import configuration from "../../common/options.mjs";
import fs from "fs";
fs.promises.writeFile("config.js", `export default ${JSON.stringify(configuration.portal.frontEndVariables)};`);
