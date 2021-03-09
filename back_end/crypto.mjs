import { createHash } from "crypto";
export const hash = content => createHash("md5").update(content).digest("hex");
