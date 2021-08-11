import "./index.css";
import { hydrate, render } from "react-dom";
import Application from "components/Application.mjs";
const root = document.getElementById("root");
if (root.hasChildNodes()) {
	hydrate(<Application/>, root);
}
else {
	render(<Application/>, root);
}
