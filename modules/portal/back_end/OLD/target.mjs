import options from "../common/options.mjs";
import path from "path";
export const resourceDirectoryName = "resources";

const getTargetPath = targetName => path.join(options.distributionPath, targetName);
export const getResourcePath = targetName => path.join(getTargetPath(targetName), resourceDirectoryName);
