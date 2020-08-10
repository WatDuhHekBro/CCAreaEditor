import {HTMLWrapper, create} from "./common";
import {inputViaFileUpload, inputViaTextField, outputViaDownload, outputViaTextField} from "./transfer";
import lang from "./lang";

class Inspector extends HTMLWrapper<HTMLDivElement>
{
	private titleTab: HTMLHeadingElement;
	private tabs: GenericTab[];
	private static readonly tabNames = ["transfer", "area", "floor", "selection"];
	
	constructor()
	{
		super(document.createElement("div"));
		this.element.classList.add("ui");
		
		const title = document.createElement("h1");
		title.innerText = lang("inspector");
		this.element.appendChild(title);
		
		const tabs = document.createElement("div");
		tabs.classList.add("separator");
		this.element.appendChild(tabs);
		this.tabs = [];
		
		this.titleTab = document.createElement("h1");
		this.element.appendChild(this.titleTab);
		
		const transferTab = new GenericTab();
		const textfield = create("input", {
			attributes: {
				type: "text",
				placeholder: lang("inspector.transfer.textfield.placeholder")
			},
			events: {
				input: inputViaTextField
			}
		});
		transferTab
			.attachElement(create("div", {
				text: lang("inspector.transfer.note")
			}))
			.attachElement(create("div", {
				append: [textfield, create("button", {
					text: lang("inspector.transfer.textfield.copy"),
					events: {
						click: outputViaTextField(textfield)
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
			}));
		this.attach(transferTab);
		this.tabs.push(transferTab);
		tabs.appendChild(createTabButton(lang("inspector.tabs.transfer"), () => {
			this.setActiveTab(0);
		}));
		
		const areaTab = new GenericTab();
		/*areaTab
			.attachElement(create("div", {
				
			}))
			.attachElement(create("div", {
				
			}))
			.attachElement(create("div", {
				
			}))*/
		this.attach(areaTab);
		this.tabs.push(areaTab);
		tabs.appendChild(createTabButton(lang("inspector.tabs.area"), () => {
			this.setActiveTab(1);
		}));
		
		const floorTab = new GenericTab();
		this.attach(floorTab);
		this.tabs.push(floorTab);
		tabs.appendChild(createTabButton(lang("inspector.tabs.floor"), () => {
			this.setActiveTab(2);
		}));
		
		const selectTab = new GenericTab();
		this.attach(selectTab);
		this.tabs.push(selectTab);
		tabs.appendChild(createTabButton(lang("inspector.tabs.selection"), () => {
			this.setActiveTab(3);
		}));
		
		this.setActiveTab(0);
	}
	
	private setActiveTab(index: number)
	{
		for(let i = 0; i < this.tabs.length; i++)
		{
			this.tabs[i]?.setDisplay(i === index);
			
			if(i === index)
				this.titleTab.innerText = lang(`inspector.${Inspector.tabNames[i]}`);
		}
	}
	
	//public setSelectMode
}

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
	}
}

function createTabButton(text: string, callback: () => void)
{
	const e = document.createElement("span");
	e.innerText = text;
	e.onclick = callback;
	return e;
}

export default new Inspector();