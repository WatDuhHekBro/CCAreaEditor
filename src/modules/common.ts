export interface GenericJSON
{
	[key: string]: any;
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