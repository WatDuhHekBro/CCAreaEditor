import {HTMLWrapper, create} from "./common";
import {inputViaFileUpload, inputViaTextField, outputViaDownload, outputViaTextField} from "./transfer";
import * as Gateway from "./gateway";
import lang from "./lang";
import {currentArea} from "./area";

class GenericTab extends HTMLWrapper<HTMLDivElement>
{
	private enabled = true;
	
	constructor()
	{
		super(document.createElement("div"));
		this.setDisplay(false);
	}
	
	public setDisplay(state?: boolean)
	{
		const target = state ?? !this.enabled;
		this.enabled = target;
		this.element.style.display = target ? "block" : "none";
		return this;
	}
	
	public getElement()
	{
		return this.element;
	}
}

function createTabButton(text: string, callback: () => void)
{
	const e = document.createElement("span");
	e.innerText = text;
	e.onclick = callback;
	return e;
}

function setActiveTab(index: number)
{
	for(let i = 0; i < tabs.length; i++)
	{
		tabs[i]?.setDisplay(i === index);
		
		if (i === index)
			elements.title.innerText = lang(`inspector.${tabNames[i]}`);
	}
}

// This is so you don't have to write a bunch of verification code to access and modify element values (from the gateway).
export const elements = {
	title: create("h1"),
	textfield: create("input", {
		attributes: {
			type: "text",
			placeholder: lang("inspector.transfer.textfield.placeholder")
		},
		events: {
			input: inputViaTextField
		}
	}),
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

const tabs: GenericTab[] = [
	// Transfer Tab //
	new GenericTab()
		.attachElement(create("div", {
			text: lang("inspector.transfer.note")
		}))
		.attachElement(create("div", {
			append: [elements.textfield, create("button", {
				text: lang("inspector.transfer.textfield.copy"),
				events: {
					click: outputViaTextField(elements.textfield)
				}
			})]
		}))
		.attachElement(create("div", {
			append: [create("input", {
				attributes: {
					type: "file"
				},
				events: {
					change: inputViaFileUpload
				}
			}), create("span", {
				text: lang("inspector.transfer.upload.note")
			})]
		}))
		.attachElement(create("div", {
			append: create("button", {
				text: lang("inspector.transfer.download"),
				events: {
					click: outputViaDownload
				}
			})
		}))
		.setDisplay(),
	// Area Tab //
	new GenericTab()
		.attachElement(create("div", {
			append: [
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
				create("span", {
					text: lang("inspector.area.defaultFloor") + ' '
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
				})
				// inspector.area.floors.swap
				// inspector.area.floors.swap.success
				// inspector.area.floors.swap.failure
			]
		}))
		.attachElement(create("div", {
			append: create("p", {
				text: lang("inspector.area.note")
			})
		})),
	// Floor Tab //
	new GenericTab(),
	// Selection Tab //
	new GenericTab()
];

const tabNames = ["transfer", "area", "floor", "selection"];

export default create("div", {
	classes: ["ui"],
	append: [
		create("h1", {
			text: lang("inspector")
		}),
		create("div", {
			classes: ["separator"],
			append: [
				createTabButton(lang("inspector.tabs.transfer"), () => {
					setActiveTab(0);
				}),
				createTabButton(lang("inspector.tabs.area"), () => {
					setActiveTab(1);
				}),
				createTabButton(lang("inspector.tabs.floor"), () => {
					setActiveTab(2);
				}),
				createTabButton(lang("inspector.tabs.selection"), () => {
					setActiveTab(3);
				})
			]
		}),
		elements.title,
		tabs[0].getElement(),
		tabs[1].getElement(),
		tabs[2].getElement(),
		tabs[3].getElement()
	]
});

setActiveTab(0);