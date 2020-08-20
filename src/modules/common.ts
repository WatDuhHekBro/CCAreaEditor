export interface GenericJSON
{
	[key: string]: any;
}

export abstract class HTMLWrapper<T extends HTMLElement>
{
	protected element: T;
	
	constructor(element: T)
	{
		this.element = element;
	}
	
	public attach<K extends HTMLElement>(wrapper: HTMLWrapper<K>)
	{
		this.element.appendChild(wrapper.element);
		return this;
	}
	
	public attachElement(element: HTMLElement)
	{
		this.element.appendChild(element);
		return this;
	}
	
	public attachTo(element: HTMLElement)
	{
		element.appendChild(this.element);
	}
}

export class GenericTab extends HTMLWrapper<HTMLDivElement>
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

interface TableOptions
{
	readonly onadd?: (element: HTMLDivElement, index: number, clickedByUser: boolean) => void;
	readonly onremove?: (index: number) => void;
	readonly onswap?: (index1: number, index2: number) => void;
}

export class Table extends HTMLWrapper<HTMLTableElement>
{
	public readonly button: HTMLButtonElement;
	private readonly onadd: (element: HTMLDivElement, index: number, clickedByUser: boolean) => void;
	private readonly onremove: (index: number) => void;
	private readonly onswap: (index1: number, index2: number) => void;
	private tmpIndex: number;
	
	constructor(options?: TableOptions)
	{
		super(document.createElement("table"));
		this.button = create("button", {
			text: "+",
			events: {
				click: () => this.addRow(true)
			}
		});
		this.onadd = options?.onadd ?? (() => {});
		this.onremove = options?.onremove ?? (() => {});
		this.onswap = options?.onswap ?? (() => {});
		this.tmpIndex = -1;
	}
	
	public addRow(clickedByUser = false)
	{
		const self = this;
		const box = create("div", {
			classes: ["left"]
		});
		const row = this.element.appendChild(create("tr", {
			append: [
				create("td", {
					classes: ["collapse"],
					append: create("button", {
						text: "-",
						events: {
							click(this: HTMLButtonElement) {
								const row = (this.parentElement?.parentElement as HTMLTableRowElement|undefined);
								
								if(!row)
									throw "This event was called outside of a table!";
								
								const index = row.rowIndex;
								self.element.removeChild(row);
								self.onremove(index);
							}
						}
					})
				}),
				create("td", {
					classes: ["collapse"],
					append: create("input", {
						attributes: {
							type: "checkbox"
						},
						events: {
							click(this: HTMLInputElement) {
								const row = (this.parentElement?.parentElement as HTMLTableRowElement|undefined);
								
								if(!row)
									throw "This event was called outside of a table!";
								
								const index = row.rowIndex;
								
								if(self.tmpIndex === -1)
									self.tmpIndex = index;
								else
								{
									self.onswap(self.tmpIndex, index);
									const otherRow = self.element.rows[self.tmpIndex];
									(otherRow.children[1].children[0] as HTMLInputElement).checked = false;
									this.checked = false;
									self.tmpIndex = -1;
									const tmp = create("span");
									
									// swap "index" and "self.tmpIndex"
									row.after(tmp);
									otherRow.after(row);
									tmp.after(otherRow);
									self.element.removeChild(tmp);
								}
							}
						}
					})
				}),
				create("td", {
					append: box
				})
			]
		}));
		this.onadd(box, row.rowIndex, clickedByUser);
	}
	
	public getRow(index: number)
	{
		return this.element.rows[index];
	}
	
	public clearRows()
	{
		while(this.element.firstChild)
			this.element.removeChild(this.element.firstChild);
	}
	
	public getTable()
	{
		return this.element;
	}
}

export function addGeneric(array: any[], element: any, index?: number)
{
	if(index !== undefined && index < array.length)
		array.splice(index, 0, element);
	else
		array.push(element);
}

export function moveGeneric(array: any[], from: number, to: number)
{
	array.splice(to, 0, array.splice(from, 1)[0]);
}

export function removeGeneric(array: any[], index?: number)
{
	if(index !== undefined)
		array.splice(index, 1);
	else
		array.pop();
}

interface createElementOptions
{
	text?: string;
	classes?: string[];
	attributes?: {[property: string]: string};
	events?: {[name: string]: ((ev: Event) => any)};
	append?: HTMLElement|HTMLElement[];
};

export function create<K extends keyof HTMLElementTagNameMap>(tag: K, options?: createElementOptions): HTMLElementTagNameMap[K];
export function create(tag: string, options?: createElementOptions): HTMLElement
{
	const element = document.createElement(tag);
	
	if(options?.text)
		element.innerText = options.text;
	if(options?.classes)
		for(const className of options.classes)
			element.classList.add(className);
	if(options?.attributes)
		for(const name in options.attributes)
			element.setAttribute(name, options.attributes[name]);
	if(options?.events)
		for(const event in options.events)
			element.addEventListener(event, options.events[event]);
	if(options?.append)
	{
		if(Array.isArray(options.append))
			for(const child of options.append)
				element.appendChild(child);
		else
			element.appendChild(options.append);
	}
	
	return element;
}

/**
 * Allows you to store a template string with variable markers and parse it later.
 * - Use `%name%` for variables
 * - `%%` = `%`
 * - If the invalid token is null/undefined, nothing is changed.
 */
export function parseVars(line: string, definitions: {[key: string]: string}, invalid: string|null|undefined = ""): string
{
	let result = "";
	let inVariable = false;
	let token = "";
	
	for(const c of line)
	{
		if(c === '%')
		{
			if(inVariable)
			{
				if(token === "")
					result += '%';
				else
				{
					if(token in definitions)
						result += definitions[token];
					else if(invalid === undefined || invalid === null)
						result += `%${token}%`;
					else
						result += invalid;
					
					token = "";
				}
			}
			
			inVariable = !inVariable;
		}
		else if(inVariable)
			token += c;
		else
			result += c;
	}
	
	return result;
}