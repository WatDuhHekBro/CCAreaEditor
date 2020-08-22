import lang, {LangLabel} from "../modules/lang";
import Matrix from "./matrix";
import Renderer from "../display/renderer";
import {GenericJSON, addGeneric, moveGeneric, removeGeneric, swapGeneric} from "../modules/common";

// I decided that it'd be better to just stick with using a matrix per floor. While you're going to be resizing the entire grid if you're modifying width or height, for floors, it'd be better to have it splice individual floors which will take the entire matrix with it. Also, methods like setTile in the area object will just call the current floor's setTile method.
export class Floor
{
	public level: number; // The level property only determines the display of that level. So you can have -2 then -4, which will show up in that order. A defaultFloor property that doesn't match anything will just show a blank screen until you select a floor.
	private tiles: Matrix;
	public readonly icons: Icon[];
	public readonly maps: Map[]; // maps[0] describes tiles with a value of 1, as tiles with a value of 0 indicate that there is no map there.
	public readonly connections: Connection[];
	public readonly landmarks: Landmark[];
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
		this.tiles.set(x, y, map, true);
	}
	
	public getFloorName(): string
	{
		if(this.handle)
			return this.handle.getClean();
		else if(this.level === 0)
			return lang("floor.ground");
		else if(this.level > 0)
			return Math.abs(this.level) + lang("floor.upper");
		else if(this.level < 0)
			return lang("floor.lower") + Math.abs(this.level);
		else
			return "N/A";
	}
	
	// Renders this entire floor. The only time you'd be able to skip this is with setTile which is the one exception because its changes just stack upon each other.
	// For everything else, you'd need to redraw the canvas to avoid ghost elements lingering around.
	public render(resultModeEnabled: boolean, options?: RenderOptions)
	{
		Renderer.setRenderingMode(false);
		
		if(resultModeEnabled)
		{
			Renderer.generateTilesAdvanced(this.tiles, options?.isolate);
			Renderer.setRenderingMode(true);
			
			if(options?.debugConnectionsMode)
			{
				for(let i = 0; i < this.connections.length; i++)
				{
					const connection = this.connections[i];
					
					if(options.select === undefined || i === options.select)
						Renderer.drawDebugConnection(connection.tx, connection.ty, connection.dir === "VERTICAL", connection.size);
				}
			}
			else if(options?.isolate)
			{
				for(let i = 0; i < this.icons.length; i++)
				{
					const icon = this.icons[i];
					
					if(options.isolate.includes(icon.map + 1) && (options.select === undefined || i === options.select))
						Renderer.drawIcon(icon.x, icon.y, icon.icon);
				}
				for(let i = 0; i < this.landmarks.length; i++)
				{
					const landmark = this.landmarks[i];
					
					if(options.isolate.includes(landmark.map + 1))
						Renderer.drawIcon(landmark.x, landmark.y, "landmark");
				}
			}
			else
			{
				for(const connection of this.connections)
					Renderer.drawConnection(connection.tx, connection.ty, connection.dir === "VERTICAL", connection.size);
				for(const icon of this.icons)
					Renderer.drawIcon(icon.x, icon.y, icon.icon);
				for(const landmark of this.landmarks)
					Renderer.drawIcon(landmark.x, landmark.y, "landmark");
			}
		}
		else
			Renderer.generateTiles(this.tiles, options?.isolate);
	
		Renderer.setRenderingMode(true);
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
			name: name.languages
		}), index);
	}
	public moveMap(from: number, to: number) {moveGeneric(this.maps, from, to)}
	public swapMaps(index1: number, index2: number)
	{
		swapGeneric(this.maps, index1, index2);
		const a = index1 + 1;
		const b = index2 + 1;
		
		this.tiles.iterate((x, y, value) => {
			if(a === value)
				return b;
			else if(b === value)
				return a;
			else
				return value;
		});
	}
	public removeMap(index?: number)
	{
		removeGeneric(this.maps, index);
		const split = (index ?? this.maps.length - 1) + 1;
		this.tiles.iterate((x, y, value) => value === split ? 0 : (value > split ? value - 1 : value));
		
		for(const connection of this.connections)
		{
			connection.map1--;
			connection.map2--;
		}
		
		for(const icon of this.icons)
			icon.map--;
		
		for(const landmark of this.landmarks)
			landmark.map--;
	}
	
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
	public swapConnections(index1: number, index2: number) {swapGeneric(this.connections, index1, index2)}
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
	public swapIcons(index1: number, index2: number) {swapGeneric(this.icons, index1, index2)}
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
	public swapLandmarks(index1: number, index2: number) {swapGeneric(this.landmarks, index1, index2)}
	public removeLandmark(index?: number) {removeGeneric(this.landmarks, index)}
	
	public getMapIndexByPosition(x: number, y: number): number
	{
		return this.tiles.get(x, y) ?? -1;
	}
	
	public getConnectionIndexByPosition(x: number, y: number): number
	{
		for(let i = 0; i < this.connections.length; i++)
		{
			const connection = this.connections[i]
			const isVertical = connection.dir === "VERTICAL";
			const x1 = connection.tx;
			const y1 = connection.ty;
			const x2 = !isVertical ? x1 + 1 : x1 + connection.size - 1;
			const y2 = isVertical ? y1 + 1 : y1 + connection.size - 1;
			
			if(x >= x1 && x <= x2 && y >= y1 && y <= y2)
				return i;
		}
		
		return -1;
	}
	
	// Icons and landmarks are both intertwined. However, to separate between the two, landmarks will be bit flipped plus one (so -1 is kept as the not found index).
	public getIconIndexByPosition(x: number, y: number): number
	{
		for(let i = 0; i < this.icons.length; i++)
		{
			const icon = this.icons[i];
			const [x1, y1, x2, y2] = Renderer.getIconBounds(icon.x, icon.y, icon.icon);
			
			if(x >= x1 && x <= x2 && y >= y1 && y <= y2)
				return i;
		}
		
		for(let i = 0; i < this.landmarks.length; i++)
		{
			const landmark = this.landmarks[i];
			const [x1, y1, x2, y2] = Renderer.getIconBounds(landmark.x, landmark.y, "landmark");
			
			if(x >= x1 && x <= x2 && y >= y1 && y <= y2)
				return ~i - 1;
		}
		
		return -1;
	}
	
	public getMapByIndex(index: number): Map|undefined {return this.maps[index]}
	public getConnectionByIndex(index: number): Connection|undefined {return this.connections[index]}
	public getIconByIndex(index: number): Icon|undefined {return this.icons[index]}
	public getLandmarkByIndex(index: number): Landmark|undefined {return this.landmarks[index]}
}

interface RenderOptions
{
	isolate?: number[];
	debugConnectionsMode?: boolean;
	select?: number
}

class Map
{
	path: string;
	name: LangLabel;
	
	constructor(data?: GenericJSON)
	{
		this.path = data?.path ?? "";
		this.name = new LangLabel(data?.name);
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
	offset?: {x: number, y: number}; // It's possible to fine-tune the location of a connection by using this. I don't recommend using it though.
	
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
	
	constructor(data?: GenericJSON)
	{
		this.id = data?.id ?? "";
		this.x = data?.x ?? 0;
		this.y = data?.y ?? 0;
		this.map = data?.map ?? 0;
	}
}