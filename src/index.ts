import Renderer from "./modules/renderer";
import {activateDragAndDrop, DownloadButton} from "./modules/transfer";
import Inspector from "./modules/inspector";
import * as Gateway from "./modules/gateway";
import Settings from "./modules/config";

Renderer.attach();
activateDragAndDrop();
Inspector/*.attach(new DownloadButton())*/.attachTo(document.body);

// @ts-ignore
Object.assign(window, {
	Renderer: Renderer,
	Gateway: Gateway,
	Settings: Settings
});