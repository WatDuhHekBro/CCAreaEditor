import Renderer from "./display/renderer";
import {inputViaDragAndDrop} from "./document/transfer";
import Inspector from "./document/inspector";
import * as Gateway from "./document/gateway";
import Settings from "./modules/config";

Renderer.attach();
document.body.appendChild(Inspector)
document.body.ondrop = inputViaDragAndDrop;
document.body.ondragover = event => event.preventDefault();

// @ts-ignore
Object.assign(window, {
	Renderer: Renderer,
	Gateway: Gateway,
	Settings: Settings
});