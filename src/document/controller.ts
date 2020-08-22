// Feast your eyes on this spaghetti code
import * as Gateway from "./gateway";
import {VIEWS} from "./gateway";

let primaryActive = false;
let secondaryActive = false;
let middleActive = false;
let boxStartX = 0;
let boxStartY = 0;
let lastBoxX = 0;
let lastBoxY = 0;
let hasMovedLeft = false;

export function bindController(element: HTMLElement)
{
	element.onmousedown = mouseEventStart;
	element.onmousemove = mouseEventMove;
	element.onmouseup = mouseEventStop;
	element.onmouseleave = mouseEventStop;
	window.onwheel = (event: WheelEvent) => {
		const shift = event.shiftKey;
		
		// Scroll Up //
		if(event.deltaY < 0)
		{
			if(shift)
				Gateway.switchFloor(1);
			else
				Gateway.switchZoom(1);
		}
		// Scroll Down //
		else if(event.deltaY > 0)
		{
			if(shift)
				Gateway.switchFloor(-1);
			else
				Gateway.switchZoom(-1);
		}
	};
	element.oncontextmenu = event => event.preventDefault();
	//window.oncontextmenu = (event: MouseEvent) => event.preventDefault();
	window.onkeydown = (event: KeyboardEvent) => {event.code in KeyMap && KeyMap[event.code](event.shiftKey)};
}

const KeyMap: {[key: string]: (shift: boolean) => void} = {
	Minus: () => Gateway.switchZoom(-1),
	Equal: () => Gateway.switchZoom(1),
	KeyQ: () => Gateway.switchFloor(-1),
	KeyE: () => Gateway.switchFloor(1),
	ArrowUp: shift => Gateway.panView(0, shift ? -100 : -50),
	ArrowDown: shift => Gateway.panView(0, shift ? 100 : 50),
	ArrowLeft: shift => Gateway.panView(shift ? -100 : -50, 0),
	ArrowRight: shift => Gateway.panView(shift ? 100 : 50, 0),
	KeyR: () => Gateway.resetView(),
	Digit1: () => Gateway.setView(VIEWS.TILES),
	Digit2: () => Gateway.setView(VIEWS.CONNECTIONS),
	Digit3: () => Gateway.setView(VIEWS.RESULT)
};

function mouseEventStart(event: MouseEvent)
{
	const x = event.offsetX;
	const y = event.offsetY;
	const tx = Math.floor(x / 8);
	const ty = Math.floor(y / 8);
	const shift = event.shiftKey;
	
	// Left Click //
	if(event.button === 0)
	{
		Gateway.select(x, y, VIEWS.CONNECTIONS);
		Gateway.select(x, y, VIEWS.RESULT);
		
		if(shift)
		{
			boxStartX = tx;
			boxStartY = ty;
			lastBoxX = tx;
			lastBoxY = ty;
			Gateway.setBoxPreview(tx, ty, tx, ty);
		}
		else
			Gateway.setTile(tx, ty);
		
		primaryActive = true;
		hasMovedLeft = false;
	}
	// Middle Click //
	else if(event.button === 1)
	{
		event.preventDefault();
		event.stopImmediatePropagation();
		MiddleButtonController.start(x, y);
		middleActive = true;
	}
	// Right Click //
	else if(event.button === 2)
	{
		secondaryActive = true;
		
		if(shift)
			Gateway.bind(x, y);
		else
			SecondaryButtonController.start(x, y);
	}
}

function mouseEventMove(event: MouseEvent)
{
	const x = event.offsetX;
	const y = event.offsetY;
	const tx = Math.floor(x / 8);
	const ty = Math.floor(y / 8);
	const shift = event.shiftKey;
	//console.log(event.button, event.buttons);
	
	if(primaryActive)
	{
		// onmousemove fires off hundres of times in milliseconds, so you have to restrict the amount of times the renderer has to render the canvas again.
		if(tx !== lastBoxX || ty !== lastBoxY)
		{
			if(shift)
			{
				lastBoxX = tx;
				lastBoxY = ty;
				Gateway.setBoxPreview(boxStartX, boxStartY, tx, ty);
				Gateway.resizeConnection(tx, ty);
			}
			else
			{
				Gateway.setTile(tx, ty);
				Gateway.moveConnection(tx, ty);
				Gateway.moveIcon(x, y);
			}
		}
		
		hasMovedLeft = true;
	}
	if(middleActive)
		MiddleButtonController.move(x, y);
	if(secondaryActive)
	{
		if(shift)
		{
			//...
		}
		else
			SecondaryButtonController.move(x, y);
	}
	
	lastBoxX = tx;
	lastBoxY = ty;
}

function mouseEventStop(event: MouseEvent)
{
	const x = event.offsetX;
	const y = event.offsetY;
	const tx = Math.floor(x / 8);
	const ty = Math.floor(y / 8);
	const shift = event.shiftKey;
	//console.log(event.button, event.buttons);
	
	if(primaryActive)
	{
		if(shift)
			Gateway.setBox(boxStartX, boxStartY, tx, ty);
		if(!hasMovedLeft)
			Gateway.rotateConnection();
	}
	if(middleActive)
		MiddleButtonController.stop(x, y);
	if(secondaryActive)
	{
		if(shift)
		{
			//...
		}
		else
			SecondaryButtonController.stop(x, y);
	}
	
	primaryActive = false;
	middleActive = false;
	secondaryActive = false;
}

const MiddleButtonController = {
	lastX: 0,
	lastY: 0,
	start(x: number, y: number)
	{
		this.lastX = x;
		this.lastY = y;
	},
	move(x: number, y: number)
	{
		const deltaX = (x - this.lastX);
		const deltaY = (y - this.lastY);
		Gateway.panView(deltaX, deltaY);
		this.lastX = x - deltaX;
		this.lastY = y - deltaY;
	},
	stop(x: number, y: number)
	{
		
	}
};

// right click should isolate whatever you selected so the user knows what they're dealing with
const SecondaryButtonController = {
	start(x: number, y: number)
	{
		Gateway.select(x, y);
		Gateway.highlight();
	},
	move(x: number, y: number)
	{
		
	},
	stop(x: number, y: number)
	{
		Gateway.render();
	}
};