// Feast your eyes on this spaghetti code
import Renderer from "./renderer";

let canvas: HTMLCanvasElement;
let primaryActive = false;
let secondaryActive = false;
let middleActive = false;

export function setupController(incomingCanvas: HTMLCanvasElement)
{
	canvas = incomingCanvas;
	canvas.onmousedown = mouseEventStart;
	canvas.onmousemove = mouseEventMove;
	canvas.onmouseup = mouseEventStop;
	canvas.onmouseleave = mouseEventStop;
	window.onwheel = mouseEventWheel;
	canvas.oncontextmenu = event => event.preventDefault();
	//window.oncontextmenu = (event: MouseEvent) => event.preventDefault();
	//window.onkeydown = console.log;
}

function mouseEventStart(event: MouseEvent)
{
	const x = event.offsetX;
	const y = event.offsetY;
	
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

function mouseEventWheel(event: WheelEvent)
{
	if(event.deltaY < 0)
		WheelController.up();
	else if(event.deltaY > 0)
		WheelController.down();
}

const PrimaryButtonController = {
	start(x: number, y: number)
	{
		console.log(Math.floor(x / 8), Math.floor(y / 8));
	},
	move(x: number, y: number)
	{
		console.log(Math.floor(x / 8), Math.floor(y / 8));
	},
	stop(x: number, y: number)
	{
		
	}
};

const MiddleButtonController = {
	lastX: 0,
	lastY: 0,
	hasMovedAtLeastOnceDuringTheSpecifiedTimeframeWhichDifferentiatesBetweenASimpleClickAsOpposedToDraggingTheCanvasAcrossTheScreenAndStuff: false,
	start(x: number, y: number)
	{
		this.lastX = x;
		this.lastY = y;
		this.hasMovedAtLeastOnceDuringTheSpecifiedTimeframeWhichDifferentiatesBetweenASimpleClickAsOpposedToDraggingTheCanvasAcrossTheScreenAndStuff = false;
	},
	move(x: number, y: number)
	{
		const deltaX = (x - this.lastX);
		const deltaY = (y - this.lastY);
		Renderer.movePosition(deltaX, deltaY);
		this.lastX = x - deltaX;
		this.lastY = y - deltaY;
		this.hasMovedAtLeastOnceDuringTheSpecifiedTimeframeWhichDifferentiatesBetweenASimpleClickAsOpposedToDraggingTheCanvasAcrossTheScreenAndStuff = true;
	},
	stop(x: number, y: number)
	{
		if(!this.hasMovedAtLeastOnceDuringTheSpecifiedTimeframeWhichDifferentiatesBetweenASimpleClickAsOpposedToDraggingTheCanvasAcrossTheScreenAndStuff)
		{
			Renderer.resetPosition();
			Renderer.setZoom(1);
		}
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

const WheelController = {
	up()
	{
		Renderer.changeZoom(1);
	},
	down()
	{
		Renderer.changeZoom(-1);
	}
};