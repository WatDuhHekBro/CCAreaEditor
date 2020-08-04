import Renderer from "./renderer";
import {Area, currentArea, setCurrentArea} from "./area";
import {Floor} from "./floor";

export enum VIEWS {TILES, CONNECTIONS, RESULT};
const AMOUNT_OF_VIEWS = Object.keys(VIEWS).length / 2;
let currentFloor: Floor|undefined;
let currentFloorIndex = 0;
let currentMode = VIEWS.TILES;
let selected = 0;

// With functions like setBoxPreview and moveConnection, you really need to figure out a way to make it faster. Find some way to keep track of what changed so it's more efficient.
export function render(maps?: number[], select?: number)
{
	if(currentFloor)
	{
		if(currentMode === VIEWS.TILES)
		{
			currentFloor.render(false, {
				isolate: maps,
				select: select
			});
		}
		else if(currentMode === VIEWS.CONNECTIONS)
		{
			currentFloor.render(true, {
				debugConnectionsMode: true,
				isolate: maps,
				select: select
			});
		}
		else if(currentMode === VIEWS.RESULT)
		{
			currentFloor.render(true, {
				isolate: maps,
				select: select
			});
		}
	}
}

export function createArea(width: number, height: number)
{
	setCurrentArea(new Area({
		width: width,
		height: height
	}));
	loadArea();
}

export function loadArea()
{
	if(currentArea)
	{
		currentFloor = currentArea.getFloorByLevel(currentArea.defaultFloor ?? 0) ?? currentArea.getFloorByIndex(0);
		currentFloorIndex = currentArea.getIndexByLevel(currentArea.defaultFloor ?? 0) ?? 0;
		render();
		Renderer.bind();
	}
	else
		console.warn("Tried to load an area without first initializing it!");
}

export function setTile(x: number, y: number)
{
	if(currentFloor && currentMode === VIEWS.TILES)
	{
		currentFloor.setTile(x, y, selected);
		Renderer.setTile(x, y, selected);
	}
}

// Modifies the data THEN renders again.
export function setBox(x1: number, y1: number, x2: number, y2: number)
{
	if(currentFloor && currentMode === VIEWS.TILES)
	{
		// In order to make it easy to traverse these in a for loop, if the second point is before the first point, then swap the two.
		if(x2 < x1)
		{
			const tmp = x1;
			x1 = x2;
			x2 = tmp;
		}
		if(y2 < y1)
		{
			const tmp = y1;
			y1 = y2;
			y2 = tmp;
		}
		
		for(let y = y1; y <= y2; y++)
			for(let x = x1; x <= x2; x++)
				currentFloor.setTile(x, y, selected);
		
		render(); // You only need to render after setting all the tiles internally, which doubles as a check to make sure the function itself is working.
	}
}

// Only shows a preview of what you're going to be seeing.
export function setBoxPreview(x1: number, y1: number, x2: number, y2: number)
{
	if(currentFloor && currentMode === VIEWS.TILES)
	{
		render(); // You first need a clean render to avoid ghost tiles.
		
		if(x2 < x1)
		{
			const tmp = x1;
			x1 = x2;
			x2 = tmp;
		}
		if(y2 < y1)
		{
			const tmp = y1;
			y1 = y2;
			y2 = tmp;
		}
		
		for(let y = y1; y <= y2; y++)
			for(let x = x1; x <= x2; x++)
				Renderer.setTile(x, y, selected);
	}
}

export function moveConnection(x: number, y: number)
{
	if(currentFloor && currentMode === VIEWS.CONNECTIONS)
	{
		const connection = currentFloor.getConnectionByIndex(selected);
		
		if(connection)
		{
			connection.tx = x;
			connection.ty = y;
			render();
		}
	}
}

export function rotateConnection()
{
	if(currentFloor && currentMode === VIEWS.CONNECTIONS)
	{
		const connection = currentFloor.getConnectionByIndex(selected);
		
		if(connection)
		{
			const isVertical = connection.dir === "VERTICAL";
			connection.dir = isVertical ? "HORIZONTAL": "VERTICAL";
			render();
		}
	}
}

export function resizeConnection(x: number, y: number)
{
	if(currentFloor && currentMode === VIEWS.CONNECTIONS)
	{
		const connection = currentFloor.getConnectionByIndex(selected);
		
		if(connection)
		{
			const isVertical = connection.dir === "VERTICAL";
			const sizeX = Math.max(x - connection.tx + 1, 1);
			const sizeY = Math.max(y - connection.ty + 1, 1);
			connection.size = isVertical ? sizeX : sizeY;
			console.log(isVertical, sizeX, sizeY);
			render();
		}
	}
}

export function moveIcon(x: number, y: number)
{
	if(currentFloor && currentMode === VIEWS.RESULT)
	{
		const isLandmark = selected < -1;
		const icon = isLandmark ? currentFloor.getLandmarkByIndex(~selected - 1) : currentFloor.getIconByIndex(selected);
		
		if(icon)
		{
			icon.x = x;
			icon.y = y;
			render();
		}
	}
}

// Send in the absolute x and y and it'll resolve based on the current view.
export function select(x: number, y: number, modeRequired?: VIEWS)
{
	if(modeRequired && currentMode !== modeRequired)
		return;
	
	if(currentFloor)
	{
		const tx = Math.floor(x / 8);
		const ty = Math.floor(y / 8);
		
		if(currentMode === VIEWS.TILES)
			selected = currentFloor.getMapIndexByPosition(tx, ty);
		else if(currentMode === VIEWS.CONNECTIONS)
			selected = currentFloor.getConnectionIndexByPosition(tx, ty);
		else if(currentMode === VIEWS.RESULT)
			selected = currentFloor.getIconIndexByPosition(x, y);
	}
}

// Isolates the current selection. Use render() to reset it.
export function highlight()
{
	if(currentFloor)
	{
		// connections[0] or icons[0] = map index 1
		if(currentMode === VIEWS.TILES)
			render([selected], selected);
		else if(currentMode === VIEWS.CONNECTIONS)
		{
			const connection = currentFloor.getConnectionByIndex(selected);
			
			if(connection)
				render([connection.map1 + 1, connection.map2 + 1], selected);
		}
		else if(currentMode === VIEWS.RESULT)
		{
			const isLandmark = selected < -1;
			const icon = isLandmark ? currentFloor.getLandmarkByIndex(~selected - 1) : currentFloor.getIconByIndex(selected);
			
			if(icon)
				render([icon.map + 1], selected);
		}
	}
}

export function panView(deltaX: number, deltaY: number)
{
	Renderer.movePosition(deltaX, deltaY);
}

export function resetView()
{
	Renderer.resetPosition();
	Renderer.setZoom(1);
}

// Set a specific view or cycle through the views.
export function setView(mode?: VIEWS)
{
	if(typeof mode === "number" && mode in VIEWS)
		currentMode = mode;
	else
	{
		currentMode++;
		
		if(currentMode >= AMOUNT_OF_VIEWS)
			currentMode = 0;
	}
	
	selected = 0;
	render();
}

export function switchZoom(delta: number)
{
	Renderer.changeZoom(delta);
}

export function switchFloor(delta: number)
{
	if(currentArea && currentFloor)
	{
		const newIndex = currentFloorIndex + delta;
		
		if(newIndex >= 0 && newIndex < currentArea.getAmountOfFloors())
		{
			currentFloor = currentArea.getFloorByIndex(newIndex);
			currentFloorIndex = newIndex;
			render();
		}
	}
}