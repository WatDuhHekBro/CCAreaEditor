import Renderer from "./display/renderer";
import {inputViaDragAndDrop} from "./document/transfer";
import Inspector from "./document/inspector";
import Preferences from "./document/preferences";
import {create} from "./modules/common";
import {version} from "../package.json";

const errors: object[] = [];
const errorBubbleMessage = "Welp, looks like the program dun goof'd! Sorry about that. In the meantime, click this bubble to copy the error message(s) and send it to me or open an issue on GitHub.";
const errorBubble = create("div", {
	text: "⚠️",
	classes: ["error"],
	attributes: {
		title: errorBubbleMessage
	},
	events: {
		click() {
			const element = create("input", {
				attributes: {
					value: JSON.stringify(errors)
				}
			});
			document.body.appendChild(element);
			element.select();
			element.setSelectionRange(0, 99999);
			document.execCommand("copy");
			element.blur();
			element.remove();
			alert("You've now copied your error messages to your clipboard. Send it to me or open an issue on GitHub.");
		}
	}
});

window.onerror = (message, source, line, column, error) => {
	errors.push({
		message: message,
		source: source,
		line: line,
		column: column,
		error: error?.stack
	});
	errorBubble.style.display = "block";
};

Renderer.attach();
document.body.appendChild(Inspector);
document.body.appendChild(Preferences);
document.body.ondrop = inputViaDragAndDrop;
document.body.ondragover = event => event.preventDefault();
document.body.appendChild(create("span", {
	text: `v${version}`,
	classes: ["version"]
}));
document.body.appendChild(errorBubble);