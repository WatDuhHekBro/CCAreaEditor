import {LangLabel} from "./lang";
import Matrix from "./matrix";
import Renderer from "./renderer";

// When the data is stringified, it'll skip over undefined keys unless it has a value. However, the order of these keys will remain.
export default class Area
{
	private DOCTYPE: string;
	private name: LangLabel;
	private width: number;
	private height: number;
	private floors: Floor[];
	private chests: number;
	private defaultFloor: number; // The first floor you see when viewing the area from another area. It only affects which floor you first see when you go to an area you're NOT currently in.
	//private currentFloor: Floor;
	
	constructor(data?: GenericJSON)
	{
		this.DOCTYPE = data?.DOCTYPE ?? "AREAS_MAP";
		this.name = data?.name ? new LangLabel(data?.name) : new LangLabel();
		this.width = data?.width ?? 1;
		this.height = data?.height ?? 1;
		this.floors = [];
		
		if(data?.floors)
		{
			for(const floor of data?.floors)
				this.floors.push(Floor.from(floor));
		}
		else
			this.addFloor();
		
		this.chests = data?.chests ?? 0;
		this.defaultFloor = data?.defaultFloor ?? 0;
		//this.currentFloor = this.defaultFloor;
		//this.setFloor(defaultFloor);
	}
	
	public static from(data: GenericJSON): Area
	{
		console.log(data);
		return new Area();
	}
	
	public setTile(x: number, y: number, map: number)
	{
		
	}
	
	public setCurrentFloor(floor: number)
	{
		
	}
	
	public addFloor(index?: number)
	{
		
	}
	
	public toJSON()
	{
		return {
			DOCTYPE: this.DOCTYPE,
			name: this.name,
			width: this.width,
			height: this.height,
			floors: this.floors,
			chests: this.chests,
			defaultFloor: this.defaultFloor
		};
	}
}

// I decided that it'd be better to just stick with using a matrix per floor. While you're going to be resizing the entire grid if you're modifying width or height, for floors, it'd be better to have it splice individual floors which will take the entire matrix with it. Also, methods like setTile in the area object will just call the current floor's setTile method.
class Floor
{
	private level: number; // The level property only determines the display of that level. So you can have -2 then -4, which will show up in that order. A defaultFloor property that doesn't match anything will just show a blank screen until you select a floor.
	private name?: LangLabel;
	private tiles: Matrix;
	private icons: Icon[];
	private maps: Map[]; // maps[0] describes tiles with a value of 1, as tiles with a value of 0 indicate that there is no map there.
	private connections: Connection[];
	private landmarks: Landmark[];
	private handle?: LangLabel; // new LangLabel(), overrides default F#
	
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
		floor.handle = data.handle;
		
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
		return "";
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
	
	public addMap(path: string, name: LangLabel)
	{
		this.maps.push(new Map({
			path: path,
			name: name
		}));
	}
	
	public addConnection(x: number, y: number, map1: number, map2: number, size: number, isVertical: boolean)
	{
		this.connections.push(new Connection({
			tx: x,
			ty: y,
			dir: isVertical ? "VERTICAL" : "HORIZONTAL",
			size: size,
			map1: map1,
			map2: map2
		}));
	}
	
	public addIcon(icon: string, x: number, y: number, map: number)
	{
		this.icons.push(new Icon({
			icon: icon,
			x: x,
			y: y,
			map: map
		}));
	}
	
	public addLandmark(id: string, x: number, y: number, map: number)
	{
		this.landmarks.push(new Landmark({
			id: id,
			x: x,
			y: y,
			map: map
		}));
	}
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

export interface GenericJSON
{
	[key: string]: any;
}