let canvas: HTMLCanvasElement;
let factor: number;
let primaryActive = false;
let secondaryActive = false;
let middleActive = false;

export function setupController(incomingCanvas: HTMLCanvasElement, incomingFactor: number)
{
	canvas = incomingCanvas;
	factor = incomingFactor;
	canvas.onmousedown = mouseEventStart;
	canvas.onmousemove = mouseEventMove;
	canvas.onmouseup = mouseEventStop;
	canvas.onmouseleave = mouseEventStop;
	canvas.onwheel = event => {
		console.log(event.deltaY, event.deltaX);
	}
	canvas.oncontextmenu = event => event.preventDefault();
}

function mouseEventStart(event: MouseEvent)
{
	const x = Math.round(event.offsetX / factor);
	const y = Math.round(event.offsetY / factor);
	
	// Left Click //
	if(event.button === 0)
	{
		PrimaryButtonController.start(x, y);
		primaryActive = true;
	}
	// Middle Click //
	else if(event.button === 1)
	{
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
	const x = Math.round(event.offsetX / factor);
	const y = Math.round(event.offsetY / factor);
	
	if(primaryActive)
		PrimaryButtonController.move(x, y);
	if(middleActive)
		MiddleButtonController.move(x, y);
	if(secondaryActive)
		SecondaryButtonController.move(x, y);
}

function mouseEventStop(event: MouseEvent)
{
	const x = Math.round(event.offsetX / factor);
	const y = Math.round(event.offsetY / factor);
	
	PrimaryButtonController.stop(x, y);
	MiddleButtonController.stop(x, y);
	SecondaryButtonController.stop(x, y);
	
	primaryActive = false;
	middleActive = false;
	secondaryActive = false;
}

export function setControllerFactor(newFactor: number)
{
	factor = newFactor;
}

const PrimaryButtonController = {
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

const MiddleButtonController = {
	lastX: 0,
	lastY: 0,
	start(x: number, y: number)
	{
		this.lastX = x;
		this.lastY = y;
		console.log(x, y);
	},
	move(x: number, y: number)
	{
		const displayX = parseInt(canvas.style.left || '0') + (x - this.lastX);
		const displayY = parseInt(canvas.style.top || '0') + (y - this.lastY);
		canvas.style.left = displayX === 0 ? "" : `${x}px`;
		canvas.style.top = displayY === 0 ? "" : `${y}px`;
		this.lastX = x;
		this.lastY = y;
	},
	stop(x: number, y: number)
	{
		
	}
};

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