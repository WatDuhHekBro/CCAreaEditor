import Renderer from "./modules/renderer";
import {inputViaDragAndDrop} from "./modules/transfer";
import Inspector from "./modules/inspector";
import * as Gateway from "./modules/gateway";
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