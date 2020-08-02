import Renderer from "./renderer";
import {Area, currentArea, setCurrentArea} from "./area";
import {Floor} from "./floor";

export enum VIEWS {TILES, CONNECTIONS, RESULT};
const AMOUNT_OF_VIEWS = Object.keys(VIEWS).length / 2;
let currentFloor: Floor|undefined;
let currentFloorIndex = 0;
let currentMode = VIEWS.TILES;
let selected = 0;

// glue everything together
// box method here
/*
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
*/

export function render(maps?: number[])
{
	if(currentFloor)
	{
		if(currentMode === VIEWS.TILES)
			currentFloor.render(false, {isolate: maps});
		else if(currentMode === VIEWS.CONNECTIONS)
		{
			currentFloor.render(true, {
				debugConnectionsMode: true,
				isolate: maps
			});
		}
		else if(currentMode === VIEWS.RESULT)
			currentFloor.render(true, {isolate: maps});
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
		currentFloor = currentArea.getFloorByLevel(currentArea.defaultFloor) ?? currentArea.getFloorByIndex(0);
		currentFloorIndex = currentArea.getIndexByLevel(currentArea.defaultFloor) ?? 0;
		render();
		Renderer.bind();
	}
	else
		console.warn("Tried to load an area without first initializing it!");
}

export function setTile(x: number, y: number)
{
	if(currentFloor)
	{
		currentFloor.setTile(x, y, selected);
		Renderer.setTile(x, y, selected);
	}
}

export function setBox(x1: number, x2: number, y1: number, y2: number, map: number)
{
	// set box on floor data
	// generateTiles
}

// Send in the absolute x and y and it'll resolve based on the current view.
export function select(x: number, y: number)
{
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
	
	console.log(selected);
}

export function moveConnection()
{
	
}

export function rotateConnection()
{
	
}

export function resizeConnection()
{
	
}

export function moveIcon(isLandmark = false)
{
	
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

export function displayMenu()
{
	
}

export function displayAdvancedMenu()
{
	
}