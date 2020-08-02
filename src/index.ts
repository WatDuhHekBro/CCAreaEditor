import Renderer from "./modules/renderer";
import {activateDragAndDrop, DownloadButton} from "./modules/transfer";
import * as Gateway from "./modules/gateway";

Renderer.attach();
activateDragAndDrop();
new DownloadButton().attach();

// @ts-ignore
Object.assign(window, {
	Renderer: Renderer,
	Gateway: Gateway
});