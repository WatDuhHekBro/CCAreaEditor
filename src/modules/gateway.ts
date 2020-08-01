import Renderer from "./renderer";
import {Area, currentArea, setCurrentArea} from "./area";
import {Floor} from "./floor";

let currentFloor: Floor|undefined;
let currentFloorIndex = 0;
let selectedMap = 0;

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
		currentFloor.render(false);
		Renderer.bind();
	}
	else
		console.warn("Tried to load an area without first initializing it!");
}

export function setTile(x: number, y: number)
{
	if(currentFloor)
	{
		currentFloor.setTile(x, y, selectedMap);
		Renderer.setTile(x, y, selectedMap);
	}
}

export function setBox(x1: number, x2: number, y1: number, y2: number, map: number)
{
	// set box on floor data
	// generateTiles
}

export function isolateMaps(maps: number[])
{
	currentFloor?.render(false, {
		isolate: maps
	});
}

export function setSelectedMap(map: number)
{
	selectedMap = map;
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

export function toggleView()
{
	
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
			currentFloor.render(false);
		}
	}
}

export function displayMenu()
{
	
}

export function displayAdvancedMenu()
{
	
}