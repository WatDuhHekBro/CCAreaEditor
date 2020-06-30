import Matrix from "../modules/matrix.js";
import Icon from "./icon.js";
import Map from "./map.js";
import Connection from "./connection.js";
import Landmark from "./landmark.js";

// I decided that it'd be better to just stick with using a matrix per floor. While you're going to be resizing the entire grid if you're modifying width or height, for floors, it'd be better to have it splice individual floors which will take the entire matrix with it. Also, methods like setTile in the area object will just call the current floor's setTile method.
export default class Floor
{
	constructor(width = 1, height = 1, level = 0)
	{
		this.level = level; // The level property only determines the display of that level. So you can have -2 then -4, which will show up in that order. A defaultFloor property that doesn't match anything will just show a blank screen until you select a floor.
		//this.name = new LangLabel();
		this.tiles = new Matrix(width, height);
		this.icons = [];
		this.maps = []; // maps[0] describes tiles with a value of 1, as tiles with a value of 0 indicate that there is no map there.
		this.connections = [];
		this.landmarks = [];
		this.handle = undefined; // new LangLabel(), overrides default F#
	}
	setTile(x, y, map)
	{
		if(map < 0)
			throw `Error: Attempted to place a tile with the value of ${map}, but negative values aren't allowed!`;
		// This check is here to automatically prevent a potential bug when loading an area into the game.
		// If you specify an area index but don't have a map specified for it, the game will crash (cannot read path of undefined).
		if(map > this.maps.length) // For example, you can place a tile of 1 as long as there's at least 1 map specified.
			throw `Error: Attempted to place a tile with the value of ${map}, but the maximum allowed index is ${this.maps.length}!`;
		this.tiles.setTile(x, y, map);
	}
	setBox(x1, y1, x2, y2, map)
	{
		if(isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2))
			throw `Error: Non-numeric value(s) given for Floor.setBox! x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`;
		
		let startX, endX, startY, endY;
		
		// Only if the second portion is greater does it switch the start and end, because otherwise, it'd that'd mess with the for loop.
		if(x1 > x2)
		{
			startX = x2;
			endX = x1;
		}
		else
		{
			startX = x1;
			endX = x2;
		}
		
		if(y1 > y2)
		{
			startY = y2;
			endY = y1;
		}
		else
		{
			startY = y1;
			endY = y2;
		}
		
		for(let y = startY; y <= endY; y++)
			for(let x = startX; x <= endX; x++)
				this.setTile(x, y, map);
	}
	// First add the map, then change its data.
	addMap()
	{
		this.maps.push(new Map());
	}
}