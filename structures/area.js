import Cube from "../modules/cube.js";
import LangLabel from "./langlabel.js";

// An area essentially extends the functionality of a cube to fit area data. However, I think it's better to make the cube a property along with others.
export default class Area
{
	constructor(width = 1, height = 1, floors = 1, defaultFloor = 0)
	{
		this.cube = new Cube(width, height, floors);
		this.currentFloor = null;
		this.name = new LangLabel();
		this.chests = 0;
		this.defaultFloor = defaultFloor; // The first floor you see when viewing the area from another area.
		this.setFloor(defaultFloor);
	}
	setFloor(floor)
	{
		
	}
	setTile()
	{
		
	}
	setBox()
	{
		
	}
	toString() // toJSON() or toData() --> Sort into a proper Area JSON
	{
		
	}
}