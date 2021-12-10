import { getNavigationHeader } from "./navigation.mjs";
import options from "../../../common/options.mjs";

const getHeader = async (targetName, pageURI) => {
    return `
        <div id="header-left">
            <button aria-label="menu" id="button-navigation"></button>
        </div>
        <div id="header-center">
            ${await getNavigationHeader(targetName, pageURI)}
        </div>
        <div id="header-right">
            ${options.backLink ? `<a href="${options.backLink}" class="back-button">Zur&uuml;ck</a>` : ""}
            <button id="button-settings"></button>
        </div>
    `;
};
export default getHeader;