import {GenericTab, create, Table} from "../../modules/common";
import lang from "../../modules/lang";
import * as Gateway from "../gateway";
import {currentArea} from "../../structures/area";

export const elements = {
	width: create("input", {
		attributes: {
			type: "number",
			value: "1"
		}
	}),
	height: create("input", {
		attributes: {
			type: "number",
			value: "1"
		}
	}),
	offsetX: create("input", {
		attributes: {
			type: "number"
		}
	}),
	offsetY: create("input", {
		attributes: {
			type: "number"
		}
	}),
	defaultFloor: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(currentArea)
					currentArea.defaultFloor = parseInt(this.value);
				else
					this.value = "";
			}
		}
	})
};

export const floors = new Table({
	onadd: (element, index, clickedByUser) => {
		if(clickedByUser)
			Gateway.addFloor();
		element.appendChild(create("button", {
			text: (currentArea?.getFloorByIndex(index).getFloorName() ?? "N/A") + ' ',
			events: {
				click(this: HTMLButtonElement) {
					const row = this?.parentElement?.parentElement?.parentElement as HTMLTableRowElement|undefined;
					
					if(!row)
						throw "This event was called outside of a table!";
					
					Gateway.setFloorView(row.rowIndex);
				}
			}
		}));
	},
	onremove: Gateway.removeFloor,
	onswap: Gateway.swapFloors
}, true);

export default new GenericTab()
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.area.dimensions")
			}),
			create("span", {
				text: lang("inspector.area.width") + ' '
			}),
			elements.width,
			create("span", {
				text: ' ' + lang("inspector.area.height") + ' '
			}),
			elements.height,
			create("br"),
			create("span", {
				text: lang("inspector.area.offsetX") + ' '
			}),
			elements.offsetX,
			create("span", {
				text: ' ' + lang("inspector.area.offsetY") + ' '
			}),
			elements.offsetY,
			create("br"),
			create("button", {
				text: lang("inspector.area.confirm"),
				events: {
					click() {
						// In this case, || is fine because 0 isn't a useful value.
						Gateway.resizeArea({
							width: parseInt(elements.width.value) || undefined,
							height: parseInt(elements.height.value) || undefined,
							offsetX: parseInt(elements.offsetX.value) || undefined,
							offsetY: parseInt(elements.offsetY.value) || undefined
						});
						elements.offsetX.value = "";
						elements.offsetY.value = "";
					}
				}
			})
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.area.defaultFloor")
			}),
			elements.defaultFloor,
			create("p", {
				text: lang("inspector.area.defaultFloor.note")
			})
		]
	}))
	.attachElement(create("div", {
		append: [
			create("h2", {
				text: lang("inspector.area.floors")
			}),
			floors.getTable(),
			floors.button
		]
	}))
	.attachElement(create("div", {
		append: create("button", {
			text: lang("inspector.area.palette"),
			events: {
				click: Gateway.generateNewPalette
			}
		})
	}))
	.attachElement(create("div", {
		append: create("p", {
			text: lang("inspector.area.note")
		})
	}));