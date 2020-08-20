import {GenericTab, create, Table} from "../../modules/common";
import lang, {LangLabel, HTMLLangLabel} from "../../modules/lang";
import * as Gateway from "../gateway";
import {currentArea} from "../../structures/area";
import {floors} from "./area";

export const elements = {
	level: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor && currentArea)
				{
					const floor = parseInt(this.value);
					Gateway.currentFloor.level = floor;
					const row = floors.getRow(Gateway.currentFloorIndex);
					const span = row?.children[2]?.children[0]?.children[0] as HTMLSpanElement|undefined;
					
					if(!span)
						throw "Invalid span type assertion at inspector.elements.level.events.input!"
					
					span.innerText = Gateway.currentFloor.getFloorName() + ' ';
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
				}
			}
		}
	}),
	container: create("span")
};

export function setHandleActive(handle: LangLabel)
{
	while(elements.container.firstChild)
		elements.container.removeChild(elements.container.firstChild);
	elements.container.appendChild(new HTMLLangLabel(handle).getElement());
	elements.container.style.display = "block";
	elements.button.innerText = lang("inspector.floor.handle.remove");
}

export function setHandleInactive()
{
	elements.container.style.display = "none";
	elements.button.innerText = lang("inspector.floor.handle.add");
}

export default new GenericTab()
	.attachElement(create("div", {
		append: [
			create("span", {
				text: lang("inspector.floor.level") + ' '
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
			create("span", {
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
			//...
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.floor.connections")
			}),
			//...
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.floor.icons")
			}),
			//...
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.floor.landmarks")
			}),
			//...
		]
	}));