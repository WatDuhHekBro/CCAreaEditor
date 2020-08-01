import {LangLabel, lexicon} from "./lang";
import Matrix from "./matrix";
import Renderer from "./renderer";
import {GenericJSON, addGeneric, moveGeneric, removeGeneric} from "./common";

// I decided that it'd be better to just stick with using a matrix per floor. While you're going to be resizing the entire grid if you're modifying width or height, for floors, it'd be better to have it splice individual floors which will take the entire matrix with it. Also, methods like setTile in the area object will just call the current floor's setTile method.
export class Floor
{
	public level: number; // The level property only determines the display of that level. So you can have -2 then -4, which will show up in that order. A defaultFloor property that doesn't match anything will just show a blank screen until you select a floor.
	public name?: LangLabel;
	private tiles: Matrix;
	private icons: Icon[];
	private maps: Map[]; // maps[0] describes tiles with a value of 1, as tiles with a value of 0 indicate that there is no map there.
	private connections: Connection[];
	private landmarks: Landmark[];
	public handle?: LangLabel; // new LangLabel(), overrides default F#
	
	constructor(level: number, widthOrGrid: number|Matrix, height?: number)
	{
		this.level = level;
		
		if(widthOrGrid.constructor === Matrix)
			this.tiles = widthOrGrid;
		else if(widthOrGrid.constructor === Number && height)
			this.tiles = new Matrix(widthOrGrid, height);
		else
			throw `Invalid constructor call to Floor! new Floor(${level}, ${widthOrGrid}, ${height})`;
		
		this.icons = [];
		this.maps = [];
		this.connections = [];
		this.landmarks = [];
	}
	
	public static from(data: GenericJSON): Floor
	{
		const floor = new Floor(data.level, Matrix.from(data.tiles));
		
		if(data.handle)
			floor.handle = new LangLabel(data.handle);
		
		for(const map of data.maps)
			floor.maps.push(new Map(map));
		for(const connection of data.connections)
			floor.connections.push(new Connection(connection));
		for(const icon of data.icons)
			floor.icons.push(new Icon(icon));
		for(const landmark of data.landmarks)
			floor.landmarks.push(new Landmark(landmark));
		
		return floor;
	}
	
	public setTile(x: number, y: number, map: number)
	{
		// This check is here to automatically prevent a potential bug when loading an area into the game.
		// If you specify an area index but don't have a map specified for it, the game will crash (cannot read path of undefined).
		if(map > this.maps.length) // For example, you can place a tile of 1 as long as there's at least 1 map specified.
			throw `Error: Attempted to place a tile with the value of ${map}, but the maximum allowed index is ${this.maps.length}! If you want to use more maps, you have to do so by calling Floor.addMap(...)!`;
		this.tiles.set(x, y, map);
	}
	
	public getFloorName(): string
	{
		if(this.handle)
			return this.handle.getClean();
		else if(this.level === 0)
			return lexicon.floorGround.get();
		else if(this.level > 0)
			return Math.abs(this.level) + lexicon.floorUpper.get();
		else if(this.level < 0)
			return lexicon.floorLower.get() + Math.abs(this.level);
		else
			return "N/A";
	}
	
	public render(resultModeEnabled: boolean)
	{
		if(resultModeEnabled)
		{
			Renderer.generateTilesAdvanced(this.tiles);
			
			for(const connection of this.connections)
				Renderer.drawConnection(connection.tx, connection.ty, connection.dir === "VERTICAL", connection.size);
			for(const icon of this.icons)
				Renderer.drawIcon(icon.x, icon.y, icon.icon);
			for(const landmark of this.landmarks)
				Renderer.drawIcon(landmark.x, landmark.y, "landmark");
		}
		else
			Renderer.generateTiles(this.tiles);
	}
	
	// DO NOT CALL THIS FROM ANYWHERE EXCEPT THE AREA CLASS! (Because of this, I'm assuming width and height are already checked for negative values.)
	// This will resize/move not only the tiles, but also move the connections, icons, and landmarks.
	// If the new location for an item is out of view, then delete it.
	public resize(width: number, height: number, offsetX = 0, offsetY = 0)
	{
		this.tiles.resize(width, height, offsetX, offsetY);
		
		if(offsetX !== 0 || offsetY !== 0)
		{
			const markedConnections: number[] = [];
			const markedIcons: number[] = [];
			const markedLandmarks: number[] = [];
			
			for(let i = 0; i < this.connections.length; i++)
			{
				const connection = this.connections[i];
				connection.tx += offsetX;
				connection.ty += offsetY;
				
				if(connection.tx < 0 || connection.ty < 0)
					markedConnections.push(i);
			}
			for(let i = 0; i < this.icons.length; i++)
			{
				const icon = this.icons[i];
				icon.x += offsetX * 8;
				icon.y += offsetY * 8;
				
				if(icon.x < 0 || icon.y < 0)
					markedIcons.push(i);
			}
			for(let i = 0; i < this.landmarks.length; i++)
			{
				const landmark = this.landmarks[i];
				landmark.x += offsetX * 8;
				landmark.y += offsetY * 8;
				
				if(landmark.x < 0 || landmark.y < 0)
					markedLandmarks.push(i);
			}
			
			for(const i of markedConnections)
				this.removeConnection(i);
			for(const i of markedIcons)
				this.removeIcon(i);
			for(const i of markedLandmarks)
				this.removeLandmark(i);
		}
	}
	
	public addMap(path: string, name: LangLabel, index?: number)
	{
		addGeneric(this.maps, new Map({
			path: path,
			name: name
		}), index);
	}
	public moveMap(from: number, to: number) {moveGeneric(this.maps, from, to)}
	public removeMap(index?: number) {removeGeneric(this.maps, index)}
	
	public addConnection(x: number, y: number, map1: number, map2: number, size: number, isVertical: boolean, index?: number)
	{
		addGeneric(this.connections, new Connection({
			tx: x,
			ty: y,
			dir: isVertical ? "VERTICAL" : "HORIZONTAL",
			size: size,
			map1: map1,
			map2: map2
		}), index);
	}
	public moveConnection(from: number, to: number) {moveGeneric(this.connections, from, to)}
	public removeConnection(index?: number) {removeGeneric(this.connections, index)}
	
	public addIcon(icon: string, x: number, y: number, map: number, index?: number)
	{
		addGeneric(this.icons, new Icon({
			icon: icon,
			x: x,
			y: y,
			map: map
		}), index);
	}
	public moveIcon(from: number, to: number) {moveGeneric(this.icons, from, to)}
	public removeIcon(index?: number) {removeGeneric(this.icons, index)}
	
	public addLandmark(id: string, x: number, y: number, map: number, index?: number)
	{
		addGeneric(this.landmarks, new Landmark({
			id: id,
			x: x,
			y: y,
			map: map
		}), index);
	}
	public moveLandmark(from: number, to: number) {moveGeneric(this.landmarks, from, to)}
	public removeLandmark(index?: number) {removeGeneric(this.icons, index)}
}

class Map
{
	path: string;
	name: LangLabel;
	offset: {x: number, y: number};
	dungeon: ""|"DUNGEON"|"NO_DUNGEON";
	zMin?: number|null;
	zMax?: number|null;
	
	constructor(data?: GenericJSON)
	{
		this.path = data?.path ?? "";
		this.name = new LangLabel(data?.name);
		this.offset = data?.offset ?? {x: 0, y: 0};
		this.dungeon = ["DUNGEON", "NO_DUNGEON"].includes(data?.dungeon) ? data?.dungeon : "";
		this.zMin = data?.zMin;
		this.zMax = data?.zMax;
	}
}

class Connection
{
	tx: number;
	ty: number;
	dir: "HORIZONTAL"|"VERTICAL";
	size: number;
	map1: number;
	map2: number;
	condition?: string;
	offset?: {x: number, y: number};
	
	constructor(data?: GenericJSON)
	{
		this.tx = data?.tx ?? 0;
		this.ty = data?.ty ?? 0;
		this.dir = ["HORIZONTAL", "VERTICAL"].includes(data?.dir) ? data?.dir : "HORIZONTAL";
		this.size = data?.size ?? 1;
		this.map1 = data?.map1 ?? 0;
		this.map2 = data?.map2 ?? 0;
		this.condition = data?.condition;
		this.offset = data?.offset;
	}
}

class Icon
{
	icon: string;
	x: number;
	y: number;
	map: number;
	data?: {area: string, map: string};
	
	constructor(data?: GenericJSON)
	{
		this.icon = data?.icon ?? "chest";
		this.x = data?.x ?? 0;
		this.y = data?.y ?? 0;
		this.map = data?.map ?? 0;
		this.data = data?.data;
	}
}

class Landmark
{
	id: string;
	x: number;
	y: number;
	map: number;
	option: string;
	
	constructor(data?: GenericJSON)
	{
		this.id = data?.id ?? "";
		this.x = data?.x ?? 0;
		this.y = data?.y ?? 0;
		this.map = data?.map ?? 0;
		this.option = data?.option ?? "DEFAULT";
	}
}