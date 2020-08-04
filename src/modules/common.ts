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
	
	public attachTo(element: HTMLElement)
	{
		element.appendChild(this.element);
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