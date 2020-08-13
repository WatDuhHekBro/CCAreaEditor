import {Floor} from "./floor";
import {GenericJSON, addGeneric, moveGeneric, removeGeneric} from "./common";
import {loadArea} from "./gateway";
import {elements} from "./inspector"; // The idea here is that the inspector will be able to send and receive data once it's linked here.

// When the data is stringified, it'll skip over undefined keys unless it has a value. However, the order of these keys will remain.
// This is just a gateway to access/manage all the floors. Individual floor logic should be done on a floor instance itself, but operations for all floors (like resizing an area) should go through here.
export class Area
{
	private width: number;
	private height: number;
	private floors: Floor[];
	public defaultFloor?: number; // The first floor you see when viewing the area from another area. It only affects which floor you first see when you go to an area you're NOT currently in.
	
	constructor(data?: GenericJSON)
	{
		this.width = data?.width ?? 1;
		this.height = data?.height ?? 1;
		this.floors = [];
		
		if(data?.floors?.length > 0)
			for(const floor of data?.floors)
				this.floors.push(Floor.from(floor));
		else
			this.addFloor();
		
		this.defaultFloor = data?.defaultFloor;
		elements.width.value = this.width.toString();
		elements.height.value = this.height.toString();
		elements.defaultFloor.value = this.defaultFloor?.toString() ?? "";
	}
	
	public getFloorByIndex(index: number): Floor
	{
		if(index < 0 || index >= this.floors.length)
			throw `A floor by the index ${index} was attempted to be fetched but no floor by that index exists!`;
		return this.floors[index];
	}
	
	public getFloorByLevel(level: number): Floor|undefined
	{
		for(const floor of this.floors)
			if(level === floor.level)
				return floor;
		return undefined;
	}
	
	public getIndexByLevel(level: number): number|undefined
	{
		for(let i = 0; i < this.floors.length; i++)
			if(level === this.floors[i].level)
				return i;
		return undefined;
	}
	
	public resize(width: number, height: number, offsetX = 0, offsetY = 0)
	{
		if(width < 0 || height < 0)
			throw new RangeError(`You cannot resize the area to be less than 0 in width or height!`);
		
		for(const floor of this.floors)
			floor.resize(width, height, offsetX, offsetY);
		
		this.width = width;
		this.height = height;
		elements.width.value = width.toString();
		elements.height.value = height.toString();
	}
	
	public addFloor(index?: number)
	{
		let level = 0;
		
		if(this.floors.length > 0)
		{
			const i = index ?? this.floors.length;
			
			// [1] <-- Insert at index 1 or greater (append).
			if(i >= this.floors.length)
				level = this.floors[i-1].level + 1;
			// [1] <-- Insert at index 0 (result: [2, 1]).
			else
				level = this.floors[i].level - 1;
		}
		
		addGeneric(this.floors, new Floor(level, this.width, this.height), index);
	}
	public moveFloor(from: number, to: number) {moveGeneric(this.floors, from, to)}
	public removeFloor(index?: number) {removeGeneric(this.floors, index)}
	
	public getWidth()
	{
		return this.width;
	}
	
	public getHeight()
	{
		return this.height;
	}
	
	public getAmountOfFloors()
	{
		return this.floors.length;
	}
}

export let currentArea: Area|null = null; // Don't allow editing on the title screen.

export function setCurrentArea(area: Area)
{
	currentArea = area;
	loadArea();
}