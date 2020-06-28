import Matrix from "../modules/matrix.js";

// I decided that it'd be better to just stick with using a matrix per floor. While you're going to be resizing the entire grid if you're modifying width or height, for floors, it'd be better to have it splice individual floors which will take the entire matrix with it. Also, methods like setTile in the area object will just call the current floor's setTile method.
export default class Floor
{
	constructor(width = 1, height = 1, level = 0)
	{
		this.level = level; // The level property only determines the display of that level. So you can have -2 then -4, which will show up in that order. A defaultFloor property that doesn't match anything will just show a blank screen until you select a floor.
		//this.name = new LangLabel();
		this.tiles = new Matrix(width, height);
		this.icons = [];
		this.maps = [];
		this.connections = [];
		this.landmarks = [];
		this.handle = undefined; // new LangLabel(), overrides default F#
		this.totalMaps = 0;
	}
	setTile()
	{
		
	}
	setBox()
	{
		
	}
	addMap()
	{
		
	}
}