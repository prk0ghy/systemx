import configuration from "systemx-common/options.mjs";
import fs from "fs";
fs.promises.writeFile(
    "config.js", 
    `module.exports = ${JSON.stringify(configuration.portal.frontEndVariables, null, 4)};`
);
