//const CCAE = (() => {
	"use strict";
	
	////////////
	// Fields //
	////////////
	const CANVAS = document.getElementById("canvas");
	const PENCIL = CANVAS.getContext("2d");
	const CONTAINER = document.getElementById("container");
	const CURSOR = document.getElementById("cursor");
	const INPUT = document.getElementById("input");
	const FLOORS = document.getElementById("floors");
	const PALETTE = ['000000'];
	const INVERT = {
		'0': 'f',
		'1': 'e',
		'2': 'd',
		'3': 'c',
		'4': 'b',
		'5': 'a',
		'6': '9',
		'7': '8',
		'8': '7',
		'9': '6',
		'a': '5',
		'b': '4',
		'c': '3',
		'd': '2',
		'e': '1',
		'f': '0'
	};
	const MODE = {
		LOAD: 1,
		ISOLATE: 2,
		BOX: 3
	};
	const PIXELS = 8;
	const TILES = new Image();
	// [x, y, size-x, size-y, offset-x, offset-y]
	const TILEMAP = {
		enclosed: [40,0],
		open: [20,4],
		corner:
		{
			nw: [16,0],
			ne: [24,0],
			sw: [16,8],
			se: [24,8]
		},
		edge:
		{
			north: [20,0],
			east: [24,4],
			south: [20,8],
			west: [16,4]
		},
		tunnel:
		{
			horizontal: [[20,0,8,4],[20,12,8,4,0,4]],
			vertical: [[16,4,4,8],[28,4,4,8,4,0]]
		},
		// Cul-De-Sac opening in <direction>
		culdesac:
		{
			north: [[16,8,4,8],[28,8,4,8,4,0]],
			east: [[16,0,8,4],[16,12,8,4,0,4]],
			south: [[16,0,4,8],[28,0,4,8,4,0]],
			west: [[24,0,8,4],[24,12,8,4,0,4]]
		},
		// This section will be used in addition to the main set to fine-tune the look of the map.
		vertex:
		{
			nw: [32,0,4,4,0,0],
			ne: [36,0,4,4,4,0],
			sw: [32,4,4,4,0,4],
			se: [36,4,4,4,4,4]
		}
	};
	// Possibly eliminate width and height in favor of updating the template data, esp. for creating new maps without editing an existing one.
	let width = 10;
	let height = 10;
	let factor = 1;
	let filename = '';
	let data = {
		DOCTYPE: "AREAS_MAP",
		name: {},
		width: 0,
		height: 0,
		floors: [],
		chests: 0,
		defaultFloor: 0 // defaultFloor only affects which floor you first see when you go to an area you're NOT currently in.
	};
	let floor = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,0,0,1,1,1,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,1,1,1,0,1,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1,1,0,0,1,1,1,0,0,0,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,1,0,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1,1,1,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,1,1,0,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
	let mouse = null;
	let tpos = {x: 0, y: 0};
	let pos1 = null;
	let pos2 = null;
	let isMouseDown = false;
	let cursor = 0;
	let currentFloor = 0;
	let settings = {
		defaultLanguage: 'en_US',
		languages:
		{
			en_US: 'English',
			de_DE: 'German',
			zh_CN: 'Chinese',
			ja_JP: 'Japanese',
			ko_KR: 'Korean'
		}
	};
	
	////////////////////
	// Initialization //
	////////////////////
	try
	{
		if(!window.localStorage.getItem('CCAE'))
			throw "No settings detected! Generating default values.";
		
		let config = JSON.parse(window.localStorage.getItem('CCAE'));
		
		for(let key in settings)
			if(!config[key])
				config[key] = settings[key];
		
		settings = config;
	}
	catch(error)
	{
		console.log(error);
		window.localStorage.setItem('CCAE', JSON.stringify(settings));
	}
	
	TILES.src = 'tiles.png';
	
	generateTiles(MODE.LOAD);
	
	// left click = individual tiling
	// right click = boxing
	CANVAS.addEventListener("mousedown", () => {
		if(event.button === 0) // left click
		{
			if(!mouse)
				mouse = setInterval(() => {
					clickPrimary(tpos.x, tpos.y);
				}, 10);
		}
		else if(event.button === 2) // right click
			clickSecondary(event.offsetX, event.offsetY);
		
		isMouseDown = true;
	});
	
	window.addEventListener("mouseup", () => {
		isMouseDown = false;
	});
	
	CANVAS.addEventListener("mousemove", () => {
		tpos = {x: event.offsetX, y: event.offsetY};
	});
	
	CANVAS.addEventListener("mouseup", clear);
	// The function will loop continuously if you let go off of the canvas.
	CANVAS.addEventListener("mouseenter", () => {
		if(!isMouseDown)
			clear();
	});
	
	CANVAS.oncontextmenu = disable;
	
	// throw an error if width is not the same
	
	///////////////////
	// Usable Object //
	///////////////////
	/*return {
		update: update,
		system:
		{
			input: input,
			output: output
		},
		debug:
		{
			setTile: setTile,
			setSize: setSize,
			generateTiles: generateTiles,
			palette: PALETTE,
			floor: floor,
			getColor: getColor
		}
	};*/
	
	/////////////////////////////////
	// Document-Specific Functions //
	/////////////////////////////////
	
	function update()
	{
		generateButtons(CONTAINER, generateTiles() + 1);
		generateFloorButtons(FLOORS);
		select(0);
	}
	
	function setTile(x, y, value, modify = false)
	{
		PENCIL.fillStyle = typeof value === 'number' ? getColor(value) : value;
		PENCIL.fillRect(x * PIXELS * factor, y * PIXELS * factor, PIXELS * factor, PIXELS * factor);
		
		if(modify)
			floor[y][x] = value;
	}
	
	function setSize(x, y, f)
	{
		width = x || width;
		height = y || height;
		factor = f || factor;
		
		CANVAS.width = width * PIXELS * factor;
		CANVAS.height = height * PIXELS * factor;
	}
	
	// Also returns highest room number;
	function generateTiles(mode, ...args)
	{
		let highest = 0;
		setSize(floor[0].length, floor.length);
		
		for(var i = 0; i < floor.length; i++)
		{
			for(var j = 0; j < floor[i].length; j++)
			{
				let color = getColor(floor[i][j]);
				
				if(mode === MODE.LOAD)
					setTile(j, i, floor[i][j] === 0 ? '#000000' : '#ffffff');
				else if(mode === MODE.ISOLATE)
					setTile(j, i, floor[i][j] === args[0] ? '#ffffff' : '#000000');
				else if(mode === MODE.BOX)
					setTile(j, i, inBounds(j, i, pos1, pos2) ? cursor : floor[i][j], true);
				else
					setTile(j, i, floor[i][j], true);
				
				if(floor[i][j] > highest)
					highest = floor[i][j];
			}
		}
		
		return highest;
	}
	
	function generateTilesAdvanced()
	{
		for(let i = 0; i < floor.length; i++)
		{
			for(let j = 0; j < floor[i].length; j++)
			{
				if(floor[i][j] === 0)
					PENCIL.drawImage(TILES, 0, 0, 8, 8, j * PIXELS * factor, i * PIXELS * factor, 8, 8);
				else
				{
					let selected = floor[i][j];
					let directions = [];
					
					// If y is upmost, assume N is closed.
					directions[0] = i !== 0 && floor[i-1][j] === selected;
					// If y is downmost, assume S is closed.
					directions[1] = i !== floor.length-1 && floor[i+1][j] === selected;
					// If x is leftmost, assume W is closed.
					directions[2] = j !== 0 && floor[i][j-1] === selected;
					// If x is rightmost, assume E is closed.
					directions[3] = j !== floor[i].length-1 && floor[i][j+1] === selected;
					
					drawTile(j, i, directions);
					
					// Get extra directions for adding vertices. Since these CAN be compounded on each other, false = no vertex and true = has vertex.
					// Also note that tiles with vertices cannot be on the edge, because for a tile to have a vertex NW, sides N and W have to be open.
					// NW Corner if y is upmost and x is leftmost.
					directions[7] = i !== 0 && j !== 0 && floor[i-1][j-1] !== selected;
					// NE Corner if y is upmost and x is rightmost.
					directions[4] = i !== 0 && j !== floor[i].length-1 && floor[i-1][j+1] !== selected;
					// SW Corner if y is downmost and x is leftmost.
					directions[6] = i !== floor.length-1 && j !== 0 && floor[i+1][j-1] !== selected;
					// SE Corner if y is downmost and x is rightmost.
					directions[5] = i !== floor.length-1 && j !== floor[i].length-1 && floor[i+1][j+1] !== selected;
					
					drawTile2(j, i, directions);
				}
			}
		}
	}
	
	// [N,S,W,E] (false/0 = closed, true/1 = open), extended would be [N,S,W,E,NE,SE,SW,NW] (in the order of cardinal/intercardinal directions as per Wikipedia)
	/* [0,0,0,0] - TILEMAP.enclosed
	 * [1,1,1,1] - TILEMAP.open
	 * [0,1,0,1] - TILEMAP.corner.nw
	 * [0,1,1,0] - TILEMAP.corner.ne
	 * [1,0,0,1] - TILEMAP.corner.sw
	 * [1,0,1,0] - TILEMAP.corner.se
	 * [0,1,1,1] - TILEMAP.edge.north
	 * [1,0,1,1] - TILEMAP.edge.south
	 * [1,1,0,1] - TILEMAP.edge.west
	 * [1,1,1,0] - TILEMAP.edge.east
	 * [0,0,1,1] - TILEMAP.tunnel.horizontal
	 * [1,1,0,0] - TILEMAP.tunnel.vertical
	 * [1,0,0,0] - TILEMAP.culdesac.north
	 * [0,1,0,0] - TILEMAP.culdesac.south
	 * [0,0,1,0] - TILEMAP.culdesac.west
	 * [0,0,0,1] - TILEMAP.culdesac.east
	 * Vertices (* means that that direction isn't checked)
	 * [1,*,1,*,*,*,*,0] - TILEMAP.vertex.nw
	 * [1,*,*,1,0,*,*,*] - TILEMAP.vertex.ne
	 * [*,1,1,*,*,*,0,*] - TILEMAP.vertex.sw
	 * [*,1,*,1,*,0,*,*] - TILEMAP.vertex.se
	 */
	function drawTile(x, y, info)
	{
		let tm = [0,0];
		let composite = false;
		
		// octo-directional up here, though actually, octo-directional is probably for fine tuning (vertex on top of open tiles) so that'll be concurrent.
		if(!info[0] && !info[1] && !info[2] && !info[3])
			tm = TILEMAP.enclosed;
		else if(info[0] && info[1] && info[2] && info[3])
			tm = TILEMAP.open;
		else if(!info[0] && info[1] && !info[2] && info[3])
			tm = TILEMAP.corner.nw;
		else if(!info[0] && info[1] && info[2] && !info[3])
			tm = TILEMAP.corner.ne;
		else if(info[0] && !info[1] && !info[2] && info[3])
			tm = TILEMAP.corner.sw;
		else if(info[0] && !info[1] && info[2] && !info[3])
			tm = TILEMAP.corner.se;
		else if(!info[0] && info[1] && info[2] && info[3])
			tm = TILEMAP.edge.north;
		else if(info[0] && !info[1] && info[2] && info[3])
			tm = TILEMAP.edge.south;
		else if(info[0] && info[1] && !info[2] && info[3])
			tm = TILEMAP.edge.west;
		else if(info[0] && info[1] && info[2] && !info[3])
			tm = TILEMAP.edge.east;
		else if(!info[0] && !info[1] && info[2] && info[3])
		{
			tm = TILEMAP.tunnel.horizontal;
			composite = true;
		}
		else if(info[0] && info[1] && !info[2] && !info[3])
		{
			tm = TILEMAP.tunnel.vertical;
			composite = true;
		}
		else if(info[0] && !info[1] && !info[2] && !info[3])
		{
			tm = TILEMAP.culdesac.north;
			composite = true;
		}
		else if(!info[0] && info[1] && !info[2] && !info[3])
		{
			tm = TILEMAP.culdesac.south;
			composite = true;
		}
		else if(!info[0] && !info[1] && info[2] && !info[3])
		{
			tm = TILEMAP.culdesac.west;
			composite = true;
		}
		else if(!info[0] && !info[1] && !info[2] && info[3])
		{
			tm = TILEMAP.culdesac.east;
			composite = true;
		}
		
		if(composite)
		{
			PENCIL.drawImage(TILES, tm[0][0], tm[0][1], tm[0][2], tm[0][3], x * PIXELS * factor, y * PIXELS * factor, tm[0][2], tm[0][3]);
			PENCIL.drawImage(TILES, tm[1][0], tm[1][1], tm[1][2], tm[1][3], x * PIXELS * factor + tm[1][4], y * PIXELS * factor + tm[1][5], tm[1][2], tm[1][3]);
		}
		else
			PENCIL.drawImage(TILES, tm[0], tm[1], 8, 8, x * PIXELS * factor, y * PIXELS * factor, 8, 8);
	}
	
	// Merge with the above when cleaning up the code, and account for the multiple merging going on which can happen. If all sides are open but all corners are taken, apply vertices 4 times (per intercardinal direction).
	function drawTile2(x, y, info)
	{
		let tm = [0,0];
		
		if(info[0] && info[2] && info[7])
		{
			tm = TILEMAP.vertex.nw;
			PENCIL.drawImage(TILES, tm[0], tm[1], tm[2], tm[3], x * PIXELS * factor + tm[4], y * PIXELS * factor + tm[5], tm[2], tm[3]);
		}
		
		if(info[0] && info[3] && info[4])
		{
			tm = TILEMAP.vertex.ne;
			PENCIL.drawImage(TILES, tm[0], tm[1], tm[2], tm[3], x * PIXELS * factor + tm[4], y * PIXELS * factor + tm[5], tm[2], tm[3]);
		}
		
		if(info[1] && info[2] && info[6])
		{
			tm = TILEMAP.vertex.sw;
			PENCIL.drawImage(TILES, tm[0], tm[1], tm[2], tm[3], x * PIXELS * factor + tm[4], y * PIXELS * factor + tm[5], tm[2], tm[3]);
		}
		
		if(info[1] && info[3] && info[5])
		{
			tm = TILEMAP.vertex.se;
			PENCIL.drawImage(TILES, tm[0], tm[1], tm[2], tm[3], x * PIXELS * factor + tm[4], y * PIXELS * factor + tm[5], tm[2], tm[3]);
		}
	}
	
	// This is going to break with update(). Integrate this into update() later.
	function setViewMode(viewResult = false)
	{
		if(viewResult)
		{
			generateTilesAdvanced();
			//generateButtons(CONTAINER, 0);
		}
		else
		{
			generateTiles();
			//generateButtons(CONTAINER);
		}
	}
	
	function input(e)
	{
		try
		{
			let input = JSON.parse(e.value);
			
			if(input.constructor === Array && input[0].constructor === Array)
			{
				floor = input;
				generateTiles();
				update();
			}
			else
				throw "Your object must be a matrix of at least one row and one column!";
		}
		catch(error)
		{
			e.value = error + '\n\nCheck the console for details.';
			console.error(error);
		}
	}
	
	function inputData(input)
	{
		try
		{
			data = JSON.parse(input);
			
			for(let i = 0; i < data.floors.length; i++)
				if(data.floors[i].level === data.defaultFloor)
					setFloor(i);
			
			return true;
		}
		catch(error)
		{
			console.error(error);
			return false;
		}
	}
	
	function setFloor(num = 0)
	{
		currentFloor = num;
		floor = data.floors[num].tiles;
		update();
	}
	
	function generateNewPalette()
	{
		PALETTE.splice(1, PALETTE.length);
		update();
	}
	
	function upload(file)
	{
		filename = file.name;
		let reader = new FileReader();
		reader.readAsText(file, 'UTF-8');
		reader.onload = () => {inputData(event.target.result);}
		reader.onerror = () => {console.error('Error with reading file.');}
	}
	
	function pushChanges()
	{
		data.floors[currentFloor].tiles = floor;
		
		if(CURSOR.children[1] && data.floors[currentFloor].maps[cursor-1])
			data.floors[currentFloor].maps[cursor-1].name = getLangLabel(CURSOR.children[1]);
	}
	
	function download()
	{
		pushChanges();
		downloadFile(filename, JSON.stringify(data));
	}
	
	// ahuff44 @ https://stackoverflow.com/questions/8310657/how-to-create-a-dynamic-file-link-for-download-in-javascript
	function downloadFile(name, contents, mime_type = "text/plain")
	{
		const blob = new Blob([contents], {type: mime_type});
		const dlink = document.createElement('a');
		dlink.download = name;
		dlink.href = window.URL.createObjectURL(blob);
		dlink.click();
		dlink.remove();
	}
	
	function setText(e)
	{
		let parent = e.parentNode;
		
		if(e.value === '')
			delete parent.dataset[parent.children[1].value];
		else
			parent.dataset[parent.children[1].value] = e.value;
	}
	
	function setLang(e)
	{
		let parent = e.parentNode;
		parent.children[0].value = parent.dataset[e.value] || '';
	}
	
	function setLangUid(e)
	{
		let parent = e.parentNode;
		
		if(e.value === '')
			delete parent.dataset.langUid;
		else
			parent.dataset.langUid = e.value;
	}
	
	// div with class LangLabel
	function setLangLabel(e, description, data)
	{
		e.innerHTML = '';
		
		if(data)
			for(let key in data)
				e.dataset[key] = data[key];
		
		// Text Field //
		let add = document.createElement('input');
		add.type = 'text';
		add.setAttribute('oninput', 'setText(this)');
		
		if(description)
			add.placeholder = description;
		
		if(data)
			add.value = data[settings.defaultLanguage] || '';
		
		e.appendChild(add);
		
		// Language Options //
		add = document.createElement('select');
		add.setAttribute('onchange', 'setLang(this)');
		
		let tmp = [];
		
		if(data)
		{
			for(let key in data)
			{
				if(key !== 'langUid')
				{
					let choice = document.createElement('option');
					choice.value = key;
					choice.innerText = settings.languages[key] || key;
					
					if(key === settings.defaultLanguage)
						choice.selected = true;
					
					add.appendChild(choice);
					tmp.push(key);
				}
			}
		}
		
		for(let lang in settings.languages)
		{
			if(!tmp.includes(lang))
			{
				let choice = document.createElement('option');
				choice.value = lang;
				choice.innerText = settings.languages[lang];
				
				if(lang === settings.defaultLanguage)
					choice.selected = true;
				
				add.appendChild(choice);
			}
		}
		
		e.appendChild(add);
		
		// LangUid //
		add = document.createElement('input');
		add.type = 'number';
		add.setAttribute('oninput', 'setLangUid(this)');
		add.style.width = '50px';
		add.placeholder = 'langUid';
		
		if(data)
			add.value = data.langUid || '';
		
		e.appendChild(add);
		
		return e;
	}
	
	function getLangLabel(e)
	{
		let label = {};
		
		for(let key in e.dataset)
		{
			if(key === 'langUid')
				label.langUid = Number(e.dataset.langUid);
			else if(e.dataset[key] !== '')
				label[key] = e.dataset[key];
		}
		
		return label;
	}
	
	function setOverlay(setting = false)
	{
		document.getElementById("overlay").style.display = setting ? "block" : "none";
	}
	
	function output()
	{
		INPUT.value = JSON.stringify(floor);
	}
	
	function clickPrimary(x = 0, y = 0)
	{
		//console.log('primary', x, y);
		setTile(Math.floor(x/8), Math.floor(y/8), cursor, true);
	}
	
	function clickSecondary(x = 0, y = 0)
	{
		//console.log('secondary', x, y);
		if(!pos1)
		{
			pos1 = {x: Math.floor(x/8), y: Math.floor(y/8)};
			setTile(pos1.x, pos1.y, cursor);
		}
		else
		{
			pos2 = {x: Math.floor(x/8), y: Math.floor(y/8)};
			generateTiles(MODE.BOX);
			pos1 = null;
			pos2 = null;
		}
	}
	
	function inBounds(x, y, start, end)
	{
		// If start is to the left of or the same as end
		if(start.x <= end.x)
		{
			if(!(x >= start.x && x <= end.x))
				return false;
			
			// If start is above or the same as end
			if(start.y <= end.y)
				return y >= start.y && y <= end.y;
			// If start is below end
			else if(start.y > end.y)
				return y >= end.y && y <= start.y;
		}
		// If start is to the right of end
		else if(start.x > end.x)
		{
			if(!(x >= end.x && x <= start.x))
				return false;
			
			// If start is above or the same as end
			if(start.y <= end.y)
				return y >= start.y && y <= end.y;
			// If start is below end
			else if(start.y > end.y)
				return y >= end.y && y <= start.y;
		}
		else
			return false;
	}
	
	function clear()
	{
		if(mouse)
		{
			clearInterval(mouse);
			mouse = null;
		}
	}
	
	function disable() {event.preventDefault();}
	
	function generateButtons(e, limit = PALETTE.length)
	{
		e.innerHTML = '';
		
		for(let i = 0; i < limit; i++)
		{
			let button = document.createElement('button');
			
			button.innerText = i;
			button.style.backgroundColor = getColor(i);
			button.style.color = getColor(i, true);
			button.oncontextmenu = disable;
			button.onmousedown = () => {
				if(event.button === 2)
					generateTiles(MODE.ISOLATE, i);
				else
					select(i);
			};
			button.onmouseup = () => {
				if(event.button === 2)
					generateTiles();
			};
			/*button.onmouseleave = () => {
				generateTiles();
			};*/
			
			e.appendChild(button);
		}
		
		if(limit !== 0)
		{
			let button = document.createElement('button');
			button.innerText = '+';
			button.onclick = () => {
				generateButtons(e, limit + 1);
			};
			e.appendChild(button);
		}
		
		return e;
	}
	
	function generateFloorButtons(e)
	{
		e.innerHTML = '';
		
		for(let i = data.floors.length-1; i >= 0; i--)
		{
			let button = document.createElement('button');
			let name = data.floors[i].level;
			
			if(name === 0)
				name = 'GF';
			else if(name > 0)
				name = name + 'F';
			else if(name < 0)
				name = 'U' + -name;
			else
				name = 'Floor ' + name;
			
			button.innerText = name;
			button.onclick = () => {
				pushChanges();
				setFloor(i);
			};
			
			e.appendChild(button);
		}
		
		return e;
	}
	
	function select(index)
	{
		if(CURSOR.children[1] && data.floors[currentFloor].maps[cursor-1])
			data.floors[currentFloor].maps[cursor-1].name = getLangLabel(CURSOR.children[1]);
		
		cursor = index;
		CURSOR.innerHTML = `<div>Your cursor is: <span style="background-color:${getColor(index)}; color:${getColor(index, true)};">&nbsp; ${index} &nbsp;</span></div>`;
		
		if(index !== 0)
			CURSOR.appendChild(setLangLabel(document.createElement('div'), 'Map Name', (data.floors[currentFloor].maps[index-1] && data.floors[currentFloor].maps[index-1].name) || null));
	}
	
	///////////////////////
	// Utility Functions //
	///////////////////////
	
	function getColor(value, invert = false)
	{
		if(!PALETTE[value])
			PALETTE[value] = getRandom(0, 16777216).toString(16).padStart(6, '000000');
		
		return '#' + (invert ? inverseColor(PALETTE[value]) : PALETTE[value]);
	}
	
	// Get random integer between min (inclusive) and max (exclusive).
	function getRandom(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	// To get the inverse of a hex color, get the difference of each digit. For example, if you have F (15), you'd get 0.
	function inverseColor(hex)
	{
		if(hex.length !== 6)
			throw "Hex numbers need to have a length of exactly 6.";
		
		hex = hex.toLowerCase();
		let result = '';
		
		for(let c of hex)
		{
			result += INVERT[c];
			
			if(!INVERT[c])
				throw "Digit " + c + " is not valid.";
		}
		
		return result;
	}
//})();