import {GenericTab, create} from "../../modules/common";
import lang, {HTMLLangLabel, getCleanText} from "../../modules/lang";
import * as Gateway from "../gateway";
import Settings from "../../modules/config";
import {maps, icons, landmarks} from "./floor";

export const mapName = new HTMLLangLabel({
	callback(text, lang)
	{
		const index = Gateway.selected - 1;
		
		if(lang === Settings.language)
		{
			const button = maps.getRow(index).children[2].children[0].children[0] as HTMLButtonElement|undefined;
			
			if(!button)
				throw "No button element is defined at mapName.callback!";
			
			button.innerText = getCleanText(text);
		}
	}
});

export const elements = {
	mapName: mapName.getElement(),
	mapPath: create("input", {
		attributes: {
			type: "text"
		},
		events: {
			input() {
				if(Gateway.currentMode !== Gateway.VIEWS.TILES)
					throw "inspector.mapPath was edited without the tile editor being active!";
				else if(Gateway.currentFloor)
					Gateway.currentFloor.maps[Gateway.selected - 1].path = this.value;
			}
		}
	}),
	connectionX: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				Gateway.moveConnection(parseInt(this.value), parseInt(elements.connectionY.value), true);
			}
		}
	}),
	connectionY: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				Gateway.moveConnection(parseInt(elements.connectionX.value), parseInt(this.value), true);
			}
		}
	}),
	connectionDirection: create("select", {
		append: [
			create("option", {
				text: lang("inspector.selection.connection.direction.horizontal"),
				attributes: {
					value: "HORIZONTAL"
				}
			}),
			create("option", {
				text: lang("inspector.selection.connection.direction.vertical"),
				attributes: {
					value: "VERTICAL"
				}
			})
		],
		events: {
			input: () => Gateway.rotateConnection(true)
		}
	}),
	connectionSize: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				const offset = parseInt(this.value) - 1;
				
				if(offset < 0)
					this.value = '1';
				
				Gateway.resizeConnection(parseInt(elements.connectionX.value) + offset, parseInt(elements.connectionY.value) + offset, true);
			}
		}
	}),
	connectionMap1: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
					Gateway.currentFloor.connections[Gateway.selected].map1 = parseInt(this.value);
			}
		}
	}),
	connectionMap2: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
					Gateway.currentFloor.connections[Gateway.selected].map2 = parseInt(this.value);
			}
		}
	}),
	connectionCondition: create("input", {
		attributes: {
			type: "text"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
				{
					const condition: string|undefined = this.value !== "" ? this.value : undefined;
					Gateway.currentFloor.connections[Gateway.selected].condition = condition;
				}
			}
		}
	}),
	iconX: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
				{
					Gateway.currentFloor.icons[Gateway.selected].x = parseInt(this.value);
					Gateway.render();
				}
			}
		}
	}),
	iconY: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
				{
					Gateway.currentFloor.icons[Gateway.selected].y = parseInt(this.value);
					Gateway.render();
				}
			}
		}
	}),
	// The initialization code for this is in "display/renderer" because the icons have to initialize first.
	iconType: create("select", {
		events: {
			input() {
				if(Gateway.currentFloor)
				{
					Gateway.currentFloor.icons[Gateway.selected].icon = this.value;
					Gateway.render();
					const button = icons.getRow(Gateway.selected).children[2].children[0].children[0] as HTMLButtonElement|undefined;
					
					if(!button)
						throw "No button element is defined at mapName.iconType!";
					
					button.innerText = this.value;
				}
			}
		}
	}),
	iconMap: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
					Gateway.currentFloor.icons[Gateway.selected].map = parseInt(this.value);
			}
		}
	}),
	iconDataArea: create("input", {
		attributes: {
			type: "text"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
				{
					const icon = Gateway.currentFloor.icons[Gateway.selected];
					const area = this.value;
					const map = elements.iconDataMap.value;
					
					if(area === "" && map === "")
						icon.data = undefined;
					else
					{
						icon.data = {
							area: area,
							map: map
						};
					}
				}
			}
		}
	}),
	iconDataMap: create("input", {
		attributes: {
			type: "text"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
				{
					const icon = Gateway.currentFloor.icons[Gateway.selected];
					const area = elements.iconDataArea.value;
					const map = this.value;
					
					if(area === "" && map === "")
						icon.data = undefined;
					else
					{
						icon.data = {
							area: area,
							map: map
						};
					}
				}
			}
		}
	}),
	landmarkX: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
				{
					const index = ~Gateway.selected - 1;
					Gateway.currentFloor.landmarks[index].x = parseInt(this.value);
					Gateway.render();
				}
			}
		}
	}),
	landmarkY: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
				{
					const index = ~Gateway.selected - 1;
					Gateway.currentFloor.landmarks[index].y = parseInt(this.value);
					Gateway.render();
				}
			}
		}
	}),
	landmarkID: create("input", {
		attributes: {
			type: "text"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
				{
					const index = ~Gateway.selected - 1;
					Gateway.currentFloor.landmarks[index].id = this.value;
					const button = landmarks.getRow(index).children[2].children[0].children[0] as HTMLButtonElement|undefined;
					
					if(!button)
						throw "No button element is defined at mapName.landmarkID!";
					
					button.innerText = this.value;
				}
			}
		}
	}),
	landmarkMap: create("input", {
		attributes: {
			type: "number"
		},
		events: {
			input() {
				if(Gateway.currentFloor)
					Gateway.currentFloor.landmarks[~Gateway.selected - 1].map = parseInt(this.value);
			}
		}
	})
};

export default [
	// Nothing Selected //
	new GenericTab()
		.attachElement(create("div", {
			append: create("a", {
				text: lang("inspector.selection.none"),
				attributes: {
					href: "https://github.com/WatDuhHekBro/CCAreaEditor#controls",
					target: "_blank"
				}
			})
		})),
	// Map //
	new GenericTab()
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.map.name")
				}),
				elements.mapName
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.map.path")
				}),
				elements.mapPath,
				create("p", {
					text: lang("inspector.selection.map.path.note")
				})
			]
		})),
	// Connection //
	new GenericTab()
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.connection.position")
				}),
				create("span", {
					text: "("
				}),
				elements.connectionX,
				create("span", {
					text: ", "
				}),
				elements.connectionY,
				create("span", {
					text: ")"
				})
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.connection.direction")
				}),
				elements.connectionDirection
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.connection.size")
				}),
				elements.connectionSize
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.connection.maps")
				}),
				elements.connectionMap1,
				elements.connectionMap2
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.connection.condition")
				}),
				elements.connectionCondition
			]
		})),
	// Icon //
	new GenericTab()
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.icon.position")
				}),
				create("span", {
					text: "("
				}),
				elements.iconX,
				create("span", {
					text: ", "
				}),
				elements.iconY,
				create("span", {
					text: ")"
				})
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.icon.icon")
				}),
				elements.iconType
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.icon.map")
				}),
				elements.iconMap
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.icon.data")
				}),
				create("span", {
					text: `${lang("inspector.selection.icon.data.area")}: `
				}),
				elements.iconDataArea,
				create("br"),
				create("span", {
					text: `${lang("inspector.selection.icon.data.map")}: `
				}),
				elements.iconDataMap,
				create("p", {
					text: lang("inspector.selection.icon.data.note")
				})
			]
		})),
	// Landmark //
	new GenericTab()
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.landmark.position")
				}),
				create("span", {
					text: "("
				}),
				elements.landmarkX,
				create("span", {
					text: ", "
				}),
				elements.landmarkY,
				create("span", {
					text: ")"
				})
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.landmark.id")
				}),
				elements.landmarkID
			]
		}))
		.attachElement(create("div", {
			append: [
				create("h2", {
					text: lang("inspector.selection.landmark.map")
				}),
				elements.landmarkMap
			]
		}))
];