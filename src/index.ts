import Renderer from "./modules/renderer";
import {activateDragAndDrop} from "./modules/transfer";
import * as Gateway from "./modules/gateway";

Renderer.attach();
activateDragAndDrop();

// @ts-ignore
Object.assign(window, {
	Renderer: Renderer,
	Gateway: Gateway
});