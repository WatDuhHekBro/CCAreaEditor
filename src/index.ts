import Renderer from "./display/renderer";
import {inputViaDragAndDrop} from "./document/transfer";
import Inspector from "./document/inspector";
import Preferences from "./document/preferences";
import Settings from "./modules/config";
import {create} from "./modules/common";
import pkg from "../package.json";
import lang from "./modules/lang";

const errors: object[] = [];
const errorBubble = create("div", {
	text: "⚠️",
	classes: ["error"],
	attributes: {
		title: lang("error.message")
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
			alert(lang("error.copy"));
		}
	}
});

window.onerror = (message, source, line, column, error) => {
	errorBubble.style.display = "block";
	errors.push({
		message: message,
		source: source,
		line: line,
		column: column,
		error: error?.stack ?? error
	});
};

window.onbeforeunload = () => {
	if(Settings.confirmClose)
		return "yeetus deletus find salvation from jesus";
	else
		return;
};

// Document Initialization //
Renderer.attach();
document.body.appendChild(Inspector);
document.body.appendChild(Preferences);
document.body.ondrop = inputViaDragAndDrop;
document.body.ondragover = event => event.preventDefault();
document.body.appendChild(errorBubble);
document.body.appendChild(create("a", {
	text: `v${pkg.version}`,
	classes: ["version"],
	attributes: {
		href: "https://github.com/WatDuhHekBro/CCAreaEditor/blob/master/CHANGELOG.md",
		target: "_blank"
	}
}));