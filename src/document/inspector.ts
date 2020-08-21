import {create} from "../modules/common";
import lang from "../modules/lang";
import TransferTab, {elements as transferElements} from "./inspector/transfer";
import AreaTab, {elements as areaElements} from "./inspector/area";
import FloorTab, {elements as floorElements} from "./inspector/floor";
import SelectionTab, {elements as selectionElements} from "./inspector/selection";

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
		
		if(i === index)
			elements.title.innerText = lang(`inspector.${tabNames[i]}`);
	}
}

// This is so you don't have to write a bunch of verification code to access and modify element values (from the gateway).
export const elements = {title: create("h1"), ...transferElements, ...areaElements, ...floorElements, ...selectionElements};
const tabs = [TransferTab, AreaTab, FloorTab, SelectionTab];
const tabNames = ["transfer", "area", "floor", "selection"];

setActiveTab(0);

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
	],
	events: {
		wheel: event => event.stopPropagation(),
		keydown: event => event.stopPropagation()
	}
});