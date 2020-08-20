import {GenericTab} from "../inspector";
import {create, Table} from "../../modules/common";
import lang from "../../modules/lang";
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
	})
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
	.attachElement(create("div"))
	.attachElement(create("div"))
	.attachElement(create("div"))
	.attachElement(create("div"));