import {GenericTab, create} from "../../modules/common";
import lang, {HTMLLangLabel} from "../../modules/lang";
import * as Gateway from "../gateway";

export const mapName = new HTMLLangLabel();

export const elements = {
	mapName: mapName.getElement(),
	mapPath: create("input", {
		attributes: {
			type: "text"
		}
	}),
	connectionX: create("input", {
		attributes: {
			type: "number"
		}
	}),
	connectionY: create("input", {
		attributes: {
			type: "number"
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
			input() {
				console.log(this.value);
			}
		}
	}),
	connectionSize: create("input", {
		attributes: {
			type: "number"
		}
	}),
	connectionMap1: create("input", {
		attributes: {
			type: "number"
		}
	}),
	connectionMap2: create("input", {
		attributes: {
			type: "number"
		}
	}),
	connectionCondition: create("input", {
		attributes: {
			type: "text"
		}
	}),
	iconX: create("input", {
		attributes: {
			type: "number"
		}
	}),
	iconY: create("input", {
		attributes: {
			type: "number"
		}
	}),
	// The initialization code for this is in "display/renderer" because the icons have to initialize first.
	iconType: create("select", {
		events: {
			input() {
				console.log(this.value);
			}
		}
	}),
	iconMap: create("input", {
		attributes: {
			type: "number"
		}
	}),
	iconDataArea: create("input", {
		attributes: {
			type: "text"
		}
	}),
	iconDataMap: create("input", {
		attributes: {
			type: "text"
		}
	}),
	landmarkX: create("input", {
		attributes: {
			type: "number"
		}
	}),
	landmarkY: create("input", {
		attributes: {
			type: "number"
		}
	}),
	landmarkID: create("input", {
		attributes: {
			type: "text"
		}
	}),
	landmarkMap: create("input", {
		attributes: {
			type: "number"
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
					href: "https://github.com/WatDuhHekBro/CCAreaEditor#controls"
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