import Renderer from "../display/renderer";
import {Area, currentArea, setCurrentArea} from "../structures/area";
import {Floor} from "../structures/floor";
import {elements, setActiveTab, currentTab} from "./inspector";
import {floors} from "./inspector/area";
import {setHandleActive, setHandleInactive, maps, connections, icons, landmarks, tabs} from "./inspector/floor";
import {mapName} from "./inspector/selection";
import renderer from "../display/renderer";
import {lexicon} from "../modules/lang";

export enum VIEWS {TILES, CONNECTIONS, RESULT};
const AMOUNT_OF_VIEWS = Object.keys(VIEWS).length / 2;
export let currentFloor: Floor|undefined;
export let currentFloorIndex = 0;
export let currentMode = VIEWS.TILES;
export let selected = 0;
export let currentTabOffset = 0;
let connectionMapBindToggle = false;
const indexesToDisplayActiveTables = [[0], [1], [2, 3]];

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
		currentFloorIndex = currentArea.getIndexByLevel(currentArea.defaultFloor ?? 0) ?? 0;
		currentFloor = currentArea.getFloorByIndex(currentFloorIndex);
		setFloorView(currentFloorIndex);
		Renderer.bind();
		floors.clearRows();
		
		for(let amount = currentArea.getAmountOfFloors(); amount--;)
			floors.addRow();
		
		setSelectedIndicator();
		setViewTables();
	}
	else
		console.warn("Tried to load an area without first initializing it!");
}

export function generateNewPalette()
{
	renderer.generateNewPalette();
	render();
}

export function switchFloor(delta: number)
{
	setFloorView(currentFloorIndex + delta);
}

export function setFloorView(index = currentFloorIndex)
{
	if(currentArea && currentFloor)
	{
		if(index >= 0 && index < currentArea.getAmountOfFloors())
		{
			currentFloor = currentArea.getFloorByIndex(index);
			currentFloorIndex = index;
			elements.level.value = currentFloor.level.toString();
			render();
			
			if(currentFloor.handle)
				setHandleActive(currentFloor.handle);
			else
				setHandleInactive();
			
			maps.clearRows();
			connections.clearRows();
			icons.clearRows();
			landmarks.clearRows();
			
			for(let i = 0; i < currentFloor.maps.length; i++)
				maps.addRow();
			for(let i = 0; i < currentFloor.connections.length; i++)
				connections.addRow();
			for(let i = 0; i < currentFloor.icons.length; i++)
				icons.addRow();
			for(let i = 0; i < currentFloor.landmarks.length; i++)
				landmarks.addRow();
			
			selected = currentMode === VIEWS.TILES ? 0 : -1;
			setSelectedIndicator();
		}
	}
}

export function addFloor()
{
	if(currentArea && currentFloor)
	{
		currentArea.addFloor();
		setFloorView();
	}
}

export function removeFloor(index: number)
{
	if(currentArea && currentFloor)
	{
		currentArea.removeFloor(index);
		
		if(currentArea.getAmountOfFloors() === 0)
		{
			currentArea.addFloor();
			elements.level.value = currentFloor.level.toString();
			floors.addRow();
		}
		else if(currentFloorIndex === currentArea.getAmountOfFloors())
			currentFloorIndex--;
		
		setFloorView();
	}
}

export function swapFloors(index1: number, index2: number)
{
	if(currentArea && currentFloor)
	{
		currentArea.swapFloors(index1, index2);
		setFloorView();
	}
}

export function addMap() {currentFloor?.addMap("", lexicon.untitled)}
export function removeMap(index: number) {
	currentFloor?.removeMap(index);
	render();
}
export function swapMaps(index1: number, index2: number) {currentFloor?.swapMaps(index1, index2)}

export function addConnection() {currentFloor?.addConnection(0, 0, 0, 0, 1, false)}
export function removeConnection(index: number) {
	currentFloor?.removeConnection(index);
	render();
}
export function swapConnections(index1: number, index2: number) {currentFloor?.swapConnections(index1, index2)}

export function addIcon() {currentFloor?.addIcon("arrow_up", 0, 0, 0)}
export function removeIcon(index: number) {
	currentFloor?.removeIcon(index);
	render();
}
export function swapIcons(index1: number, index2: number) {currentFloor?.swapIcons(index1, index2)}

export function addLandmark() {currentFloor?.addLandmark("landmark", 0, 0, 0)}
export function removeLandmark(index: number) {
	currentFloor?.removeLandmark(index);
	render();
}
export function swapLandmarks(index1: number, index2: number) {currentFloor?.swapLandmarks(index1, index2)}

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

export function resizeArea(options: {width?: number, height?: number, offsetX?: number, offsetY?: number})
{
	if(!currentArea)
		setCurrentArea(new Area({
			width: options.width,
			height: options.height
		}));
	else
		currentArea.resize(options.width ?? currentArea.getWidth(), options.height ?? currentArea.getHeight(), options.offsetX, options.offsetY);
	render();
}

export function moveConnection(x: number, y: number, avoidInspector = false)
{
	if(currentFloor && currentMode === VIEWS.CONNECTIONS)
	{
		const connection = currentFloor.getConnectionByIndex(selected);
		
		if(connection)
		{
			connection.tx = x;
			connection.ty = y;
			
			if(!avoidInspector)
			{
				elements.connectionX.value = x.toString();
				elements.connectionY.value = y.toString();
			}
			
			const button = connections.getRow(selected).children[2].children[0].children[0] as HTMLButtonElement|undefined;
			
			if(!button)
				throw "No button element is defined at Gateway.moveConnection!";
			
			button.innerText = `(${x}, ${y})`;
			render();
		}
	}
}

export function rotateConnection(avoidInspector = false)
{
	if(currentFloor && currentMode === VIEWS.CONNECTIONS)
	{
		const connection = currentFloor.getConnectionByIndex(selected);
		
		if(connection)
		{
			const isVertical = connection.dir === "VERTICAL";
			const newDirection = isVertical ? "HORIZONTAL" : "VERTICAL";
			connection.dir = newDirection;
			
			if(avoidInspector)
				elements.connectionDirection.value = newDirection;
			
			render();
		}
	}
}

export function resizeConnection(x: number, y: number, avoidInspector = false)
{
	if(currentFloor && currentMode === VIEWS.CONNECTIONS)
	{
		const connection = currentFloor.getConnectionByIndex(selected);
		
		if(connection)
		{
			const isVertical = connection.dir === "VERTICAL";
			const sizeX = Math.max(x - connection.tx + 1, 1);
			const sizeY = Math.max(y - connection.ty + 1, 1);
			const newSize = isVertical ? sizeX : sizeY;
			connection.size = newSize;
			
			if(!avoidInspector)
				elements.connectionSize.value = newSize.toString();
			
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
			
			if(isLandmark)
			{
				elements.landmarkX.value = x.toString();
				elements.landmarkY.value = y.toString();
			}
			else
			{
				elements.iconX.value = x.toString();
				elements.iconY.value = y.toString();
			}
			
			render();
		}
	}
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
	
	selected = currentMode === VIEWS.TILES ? 0 : -1;
	setSelectedIndicator();
	setViewTables();
	render();
}

function setViewTables()
{
	const tableIndexes = indexesToDisplayActiveTables[currentMode];
	
	for(let i = 0; i < tabs.length; i++)
	{
		const tab = tabs[i];
		tab.setDisplay(tableIndexes.includes(i));
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
		
		setSelectedIndicator();
	}
}

// Potentially more dangerous than select() but allows you to get map indexes that aren't present on the area.
export function selectByIndex(index: number)
{
	selected = index;
	setSelectedIndicator();
}

function setSelectedIndicator()
{
	let somethingSelected: boolean;
	let isLandmark = false;
	
	if(currentMode === VIEWS.TILES)
	{
		elements.selected.innerText = (selected - 1).toString();
		somethingSelected = selected !== 0;
	}
	else
	{
		elements.selected.innerText = selected === -1 ? "N/A" : (selected < -1 ? ~selected - 1 : selected).toString();
		somethingSelected = selected !== -1;
		isLandmark = selected < -1;
	}
	
	currentTabOffset = (somethingSelected ? currentMode + 1 : 0) + +isLandmark;
	
	if(currentTab >= 3)
		setActiveTab(3 + currentTabOffset);
	
	setSelectedData();
}

function setSelectedData()
{
	if(!currentFloor)
		throw "Gateway.setSelectedData was called outside of an active context!";
	
	// Map //
	if(currentTabOffset === 1 && currentMode === VIEWS.TILES)
	{
		const map = currentFloor.maps[selected - 1];
		mapName.setLangLabel(map.name);
		elements.mapPath.value = map.path;
	}
	// Connection //
	else if(currentTabOffset === 2 && currentMode === VIEWS.CONNECTIONS)
	{
		const connection = currentFloor.connections[selected];
		elements.connectionX.value = connection.tx.toString();
		elements.connectionY.value = connection.ty.toString();
		elements.connectionDirection.value = connection.dir;
		elements.connectionSize.value = connection.size.toString();
		elements.connectionMap1.value = connection.map1.toString();
		elements.connectionMap2.value = connection.map2.toString();
		elements.connectionCondition.value = connection.condition ?? "";
	}
	// Icon //
	else if(currentTabOffset === 3 && currentMode === VIEWS.RESULT)
	{
		const icon = currentFloor.icons[selected];
		elements.iconX.value = icon.x.toString();
		elements.iconY.value = icon.y.toString();
		elements.iconType.value = icon.icon;
		elements.iconMap.value = icon.map.toString();
		elements.iconDataArea.value = icon.data?.area ?? "";
		elements.iconDataMap.value = icon.data?.map ?? "";
	}
	// Landmark //
	else if(currentTabOffset === 4 && currentMode === VIEWS.RESULT)
	{
		const landmark = currentFloor.landmarks[~selected - 1];
		elements.landmarkX.value = landmark.x.toString();
		elements.landmarkY.value = landmark.y.toString();
		elements.landmarkID.value = landmark.id;
		elements.landmarkMap.value = landmark.map.toString();
	}
}

// Bind current selection with selected map.
export function bind(x: number, y: number)
{
	if(currentFloor && selected !== -1 && currentMode !== VIEWS.TILES)
	{
		const tx = Math.floor(x / 8);
		const ty = Math.floor(y / 8);
		const map = currentFloor.getMapIndexByPosition(tx, ty) - 1;
		
		if(currentMode === VIEWS.CONNECTIONS)
		{
			const connection = currentFloor.connections[selected];
			connectionMapBindToggle = !connectionMapBindToggle;
			
			if(connectionMapBindToggle)
			{
				connection.map1 = map;
				elements.connectionMap1.value = map.toString();
			}
			else
			{
				connection.map2 = map;
				elements.connectionMap2.value = map.toString();
			}
		}
		else if(currentMode === VIEWS.RESULT)
		{
			const isLandmark = selected < -1;
			const index = isLandmark ? ~selected - 1 : selected;
			
			if(isLandmark)
			{
				const landmark = currentFloor.landmarks[index];
				landmark.map = map;
				elements.landmarkMap.value = map.toString();
			}
			else
			{
				const icon = currentFloor.icons[index];
				icon.map = map;
				elements.iconMap.value = map.toString();
			}
		}
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

export function switchZoom(delta: number)
{
	Renderer.changeZoom(delta);
}