import { hydrate, render } from "react-dom";
import Application from "components/Application.mjs";
import styles from "./index.css";
const root = document.getElementById("root");
if (root.hasChildNodes()) {
	hydrate(<Application/>, root);
}
else {
	render(<Application/>, root);
}
