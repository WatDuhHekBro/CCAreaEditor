import {GenericTab, create, Table} from "../../modules/common";
import lang, {LangLabel, HTMLLangLabel} from "../../modules/lang";
import * as Gateway from "../gateway";
import {currentArea} from "../../structures/area";
import {floors} from "./area";

const handle = new HTMLLangLabel({callback: setFloorHeader});

export const elements = {
	level: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor && currentArea)
				{
					Gateway.currentFloor.level = parseInt(this.value);
					setFloorHeader();
				}
				else
					this.value = "";
			}
		}
	}),
	button: create("button", {
		text: lang("inspector.floor.handle.add"),
		events: {
			click() {
				if(Gateway.currentFloor)
				{
					let handle = Gateway.currentFloor.handle;
					
					if(handle)
					{
						Gateway.currentFloor.handle = undefined;
						setHandleInactive();
					}
					else
					{
						handle = new LangLabel();
						Gateway.currentFloor.handle = handle;
						setHandleActive(handle);
					}
					
					setFloorHeader();
				}
			}
		}
	}),
	container: handle.getElement()
};

export function setHandleActive(data: LangLabel)
{
	handle.setLangLabel(data);
	elements.container.style.display = "block";
	elements.button.innerText = lang("inspector.floor.handle.remove");
}

export function setHandleInactive()
{
	elements.container.style.display = "none";
	elements.button.innerText = lang("inspector.floor.handle.add");
}

function setFloorHeader()
{
	if(!Gateway.currentFloor)
		throw "setFloorHeader was called in the wrong context!";
	
	const row = floors.getRow(Gateway.currentFloorIndex);
	const span = row?.children[2]?.children[0]?.children[0] as HTMLSpanElement|undefined;
	
	if(!span)
		throw "Invalid span type assertion at inspector.elements.level.events.input!"
	
	span.innerText = Gateway.currentFloor.getFloorName() + ' ';
}

setHandleInactive();

export const maps = new Table({
	onadd: (element, index, clickedByUser) => {
		if(clickedByUser)
			Gateway.addMap();
		element.appendChild(create("button", {
			text: Gateway.currentFloor?.maps[index].name.getClean() || lang("untitled"),
			events: {
				mousedown(event) {
					if(Gateway.currentMode === Gateway.VIEWS.TILES)
					{
						const row = this?.parentElement?.parentElement?.parentElement as HTMLTableRowElement|undefined;
						
						if(!row)
							throw "This event was called outside of a table!";
						
						Gateway.selectByIndex(row.rowIndex + 1);
						
						if((event as MouseEvent).button === 2)
							Gateway.highlight();
					}
				},
				mouseup: () => Gateway.render(),
				mouseleave: () => Gateway.render(),
				contextmenu: event => event.preventDefault()
			}
		}))
	},
	onremove: Gateway.removeMap,
	onswap: Gateway.swapMaps
});

export const connections = new Table({
	onadd: (element, index, clickedByUser) => {
		if(clickedByUser)
			Gateway.addConnection();
		const connection = Gateway.currentFloor?.connections[index];
		element.appendChild(create("button", {
			text: `(${connection?.tx ?? 0}, ${connection?.ty ?? 0})`,
			events: {
				mousedown(event) {
					if(Gateway.currentMode === Gateway.VIEWS.CONNECTIONS)
					{
						const row = this?.parentElement?.parentElement?.parentElement as HTMLTableRowElement|undefined;
						
						if(!row)
							throw "This event was called outside of a table!";
						
						Gateway.selectByIndex(row.rowIndex);
						
						if((event as MouseEvent).button === 2)
							Gateway.highlight();
					}
				},
				mouseup: () => Gateway.render(),
				mouseleave: () => Gateway.render(),
				contextmenu: event => event.preventDefault()
			}
		}))
	},
	onremove: Gateway.removeConnection,
	onswap: Gateway.swapConnections
});

export const icons = new Table({
	onadd: (element, index, clickedByUser) => {
		if(clickedByUser)
			Gateway.addIcon();
		element.appendChild(create("button", {
			text: Gateway.currentFloor?.icons[index].icon ?? "arrow_up",
			events: {
				mousedown(event) {
					if(Gateway.currentMode === Gateway.VIEWS.RESULT)
					{
						const row = this?.parentElement?.parentElement?.parentElement as HTMLTableRowElement|undefined;
						
						if(!row)
							throw "This event was called outside of a table!";
						
						Gateway.selectByIndex(row.rowIndex);
						
						if((event as MouseEvent).button === 2)
							Gateway.highlight();
					}
				},
				mouseup: () => Gateway.render(),
				mouseleave: () => Gateway.render(),
				contextmenu: event => event.preventDefault()
			}
		}))
	},
	onremove: Gateway.removeIcon,
	onswap: Gateway.swapIcons
});

export const landmarks = new Table({
	onadd: (element, index, clickedByUser) => {
		if(clickedByUser)
			Gateway.addLandmark();
		element.appendChild(create("button", {
			text: Gateway.currentFloor?.landmarks[index].id ?? "",
			events: {
				mousedown(event) {
					if(Gateway.currentMode === Gateway.VIEWS.RESULT)
					{
						const row = this?.parentElement?.parentElement?.parentElement as HTMLTableRowElement|undefined;
						
						if(!row)
							throw "This event was called outside of a table!";
						
						Gateway.selectByIndex(~row.rowIndex - 1);
						
						if((event as MouseEvent).button === 2)
							Gateway.highlight();
					}
				},
				mouseup: () => Gateway.render(),
				mouseleave: () => Gateway.render(),
				contextmenu: event => event.preventDefault()
			}
		}))
	},
	onremove: Gateway.removeLandmark,
	onswap: Gateway.swapLandmarks
});

export default new GenericTab()
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.floor.level")
			}),
			elements.level,
			create("p", {
				text: lang("inspector.floor.level.note")
			})
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.floor.handle")
			}),
			create("p", {
				text: lang("inspector.floor.handle.note")
			}),
			elements.container,
			elements.button
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.floor.maps")
			}),
			maps.getTable(),
			maps.button
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.floor.connections")
			}),
			connections.getTable(),
			connections.button
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.floor.icons")
			}),
			icons.getTable(),
			icons.button
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.floor.landmarks")
			}),
			landmarks.getTable(),
			landmarks.button
		]
	}));