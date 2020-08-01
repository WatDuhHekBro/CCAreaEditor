import * as Gateway from "./gateway";

let primaryActive = false;
let secondaryActive = false;
let middleActive = false;

export function bindController(canvas: HTMLCanvasElement)
{
	canvas.onmousedown = mouseEventStart;
	canvas.onmousemove = mouseEventMove;
	canvas.onmouseup = mouseEventStop;
	canvas.onmouseleave = mouseEventStop;
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
	canvas.oncontextmenu = event => event.preventDefault();
	//window.oncontextmenu = (event: MouseEvent) => event.preventDefault();
	window.onkeydown = (event: KeyboardEvent) => {event.code in KeyMap && KeyMap[event.code]()};
}

const KeyMap: {[key: string]: () => void} = {
	Minus: () => Gateway.switchZoom(-1),
	Equal: () => Gateway.switchZoom(1),
	KeyQ: () => Gateway.switchFloor(-1),
	KeyE: () => Gateway.switchFloor(1),
	ArrowUp: () => Gateway.panView(0, -50),
	ArrowDown: () => Gateway.panView(0, 50),
	ArrowLeft: () => Gateway.panView(-50, 0),
	ArrowRight: () => Gateway.panView(50, 0),
	KeyR: () => Gateway.resetView()
};

function mouseEventStart(event: MouseEvent)
{
	const x = event.offsetX;
	const y = event.offsetY;
	const shift = event.shiftKey;
	
	// Left Click //
	if(event.button === 0)
	{
		PrimaryButtonController.start(x, y);
		primaryActive = true;
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
		SecondaryButtonController.stop(x, y);
		secondaryActive = true;
	}
}

function mouseEventMove(event: MouseEvent)
{
	const x = event.offsetX;
	const y = event.offsetY;
	//console.log(event.button, event.buttons);
	
	if(primaryActive)
		PrimaryButtonController.move(x, y);
	if(middleActive)
		MiddleButtonController.move(x, y);
	if(secondaryActive)
		SecondaryButtonController.move(x, y);
}

function mouseEventStop(event: MouseEvent)
{
	const x = event.offsetX;
	const y = event.offsetY;
	//console.log(event.button, event.buttons);
	
	if(primaryActive)
		PrimaryButtonController.stop(x, y);
	if(middleActive)
		MiddleButtonController.stop(x, y);
	if(secondaryActive)
		SecondaryButtonController.stop(x, y);
	
	primaryActive = false;
	middleActive = false;
	secondaryActive = false;
}

const PrimaryButtonController = {
	start(x: number, y: number)
	{
		//console.log(Math.floor(x / 8), Math.floor(y / 8));
	},
	move(x: number, y: number)
	{
		//console.log(Math.floor(x / 8), Math.floor(y / 8));
	},
	stop(x: number, y: number)
	{
		
	}
};

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
		
	},
	move(x: number, y: number)
	{
		
	},
	stop(x: number, y: number)
	{
		
	}
};