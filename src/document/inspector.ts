import {create} from "../modules/common";
import lang from "../modules/lang";
import TransferTab, {elements as transferElements} from "./inspector/transfer";
import AreaTab, {elements as areaElements} from "./inspector/area";
import FloorTab, {elements as floorElements} from "./inspector/floor";
import SelectionTabs, {elements as selectionElements} from "./inspector/selection";
import {currentTabOffset} from "./gateway";

export let currentTab = 0;

function createTabButton(text: string, callback: () => void)
{
	const e = document.createElement("span");
	e.innerText = text;
	e.onclick = callback;
	return e;
}

export function setActiveTab(index: number)
{
	currentTab = index;
	
	for(let i = 0; i < tabs.length; i++)
	{
		tabs[i]?.setDisplay(i === index);
		
		if(i === index)
			elements.title.innerText = lang(`inspector.${tabNames[i]}`);
	}
}

// This is so you don't have to write a bunch of verification code to access and modify element values (from the gateway).
export const elements = {
	title: create("h1"),
	selected: create("span", {
		text: "N/A",
		classes: ["rainbow", "padded"]
	}),
	...transferElements,
	...areaElements,
	...floorElements,
	...selectionElements
};
const tabs = [TransferTab, AreaTab, FloorTab, ...SelectionTabs];
const tabNames = ["transfer", "area", "floor", "selection", "selection.map", "selection.connection", "selection.icon", "selection.landmark"];
const attachTabs: HTMLDivElement[] = [];
tabs.forEach(tab => attachTabs.push(tab.getElement()));

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
					setActiveTab(3 + currentTabOffset);
				})
			]
		}),
		elements.title,
		...attachTabs,
		create("div", {
			classes: ["fixed"],
			append: [
				create("span", {
					text: `${lang("inspector.floor.selected")}: `
				}),
				elements.selected
			]
		})
	],
	events: {
		wheel: event => event.stopPropagation(),
		keydown: event => event.stopPropagation()
	}
});