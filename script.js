//const CCAE = (() => {
	"use strict";
	
	////////////
	// Fields //
	////////////
	const CANVAS = document.getElementById("canvas");
	const PENCIL = CANVAS.getContext("2d");
	const AUXILIARY = document.getElementById("auxiliary");
	const COMMAND = document.getElementById("command");
	const CURSOR = document.getElementById("cursor");
	const INPUT = document.getElementById("input");
	const FLOORS = document.getElementById("floors");
	const MODES = document.getElementById("modes");
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
	const PIXELS = 8;
	const TILES = new Image();
	// [x, y, size-x, size-y, offset-x, offset-y]
	const TILEMAP = {
		void: [0,0,8,8],
		void_large: [0,0,16,16],
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
		},
		connection:
		{
			vertical:
			{
				first: [40,8,8,2,0,6],
				second: [40,10,8,3,0,8],
				extend:
				{
					first: [17,3,8,2,4,6],
					second: [17,3,8,3,4,8]
				}
			},
			horizontal:
			{
				first: [32,8,3,8,5,0],
				second: [35,8,2,8,8,0],
				extend:
				{
					first: [17,3,3,8,5,4],
					second: [17,3,2,8,8,4]
				}
			}
		}
	};
	const ICONS = new Image();
	// [x, y, size-x, size-y, offset-x, offset-y]
	const ICONMAP = {
		arrow_up: [0,0],
		arrow_down: [12,0],
		arrow_left: [24,0],
		arrow_right: [36,0],
		floor_down: [48,0],
		weapons: [60,0],
		//???: [72,0],
		entrance: [84,0],
		chest: [96,0],
		//lea?: [108,0],
		area_up: [0,12],
		area_down: [12,12],
		area_left: [24,12],
		area_right: [36,12],
		shop: [48,12],
		trader: [60,12],
		quest_hub: [72,12],
		landmark: [84,12,16,16,-7,-8]
	};
	// Most of these aren't used, but if localization ever happened, having everything here would make it easier.
	const LEXICON = {
		title: {en_US: "CrossCode Area Editor"},
		loading: {en_US: "Please be patient."},
		cursor: {en_US: "Your cursor is: "},
		textbox: {en_US: "Copy and paste a valid area JSON file here to load it into the editor."},
		textbox_button: {en_US: "Get Changes"},
		download: {en_US: "Download Changes"},
		settings: {en_US: "Settings"},
		settings_desc: {en_US: "These are the settings that'll persist throughout every visit here. They will not be erased by leaving the page."},
		settings_generating: {en_US: "No settings detected! Generating default values."},
		floor:
		{
			upper:
			{
				en_US: 'F',
				de_DE: 'E',
				zh_CN: '层',
				ja_JP: '階',
				ko_KR: '층'
			},
			ground:
			{
				en_US: 'GF',
				de_DE: 'EG',
				zh_CN: '基层',
				ja_JP: '地階',
				ko_KR: 'GF' // I know right? This is just what I found in the localization files.
			},
			lower:
			{
				en_US: 'U',
				de_DE: 'U',
				zh_CN: 'U',
				ja_JP: '地下',
				ko_KR: 'U'
			}
		}
	};
	let palette = ['000000'];
	// Possibly eliminate width and height in favor of updating the template data, esp. for creating new maps without editing an existing one.
	let width = 10;
	let height = 10;
	let factor = 1;
	let filename = 'area.json';
	let data = {
		DOCTYPE: "AREAS_MAP",
		name: {},
		width: 10,
		height: 10,
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
	let cursor = -1;
	let currentFloor = 0;
	let settings = {
		language: 'en_US',
		languages:
		{
			en_US: 'English',
			de_DE: 'German',
			zh_CN: 'Chinese',
			ja_JP: 'Japanese',
			ko_KR: 'Korean'
		}
	};
	let mode = false;
	
	////////////////////
	// Initialization //
	////////////////////
	loadSettings(window.localStorage.getItem('CCAE'));
	
	TILES.src = 'tiles.png';
	ICONS.src = 'icons.png';
	
	// Generate Title Screen //
	setSize(floor[0].length, floor.length);
	
	for(let i = 0; i < floor.length; i++)
		for(let j = 0; j < floor[i].length; j++)
			setTile(j, i, floor[i][j] === 0 ? '#000000' : '#ffffff');
	
	// throw an error if width is not the same
	// "Your object must be a matrix of at least one row and one column!" input.constructor === Array && input[0].constructor === Array
	// Also throw an error if the sizes don't match
	
	///////////////////
	// Usable Object //
	///////////////////
	/*return {
		system:
		{
			input: input,
			output: output
		},
		debug: function(log = true)
		{
			if(log)
			{
				console.log('blah blah blah');
				//...
			}
			
			return {
				setTile: setTile,
				setSize: setSize,
				generateTiles: generateTiles,
				palette: palette,
				floor: floor,
				getColor: getColor
			};
		}
	};*/
	
	////////////////////
	// Core Functions //
	////////////////////
	
	function setTile(x, y, value, modify = false)
	{
		PENCIL.fillStyle = typeof value === 'number' ? getColor(value) : value;
		PENCIL.fillRect(x * PIXELS * factor, y * PIXELS * factor, PIXELS * factor, PIXELS * factor);
		
		if(modify)
			floor[y][x] = value;
	}
	
	function drawTile(x, y, info = [])
	{
		PENCIL.drawImage(
			TILES,
			info[0] || 0,
			info[1] || 0,
			info[2] || PIXELS,
			info[3] || PIXELS,
			(x * PIXELS * factor) + (info[4] || 0),
			(y * PIXELS * factor) + (info[5] || 0),
			info[2] || PIXELS,
			info[3] || PIXELS
		);
	}
	
	// x and y are absolute coordinates here, because icons aren't tied to the grid.
	function drawIcon(x, y, info = [])
	{
		PENCIL.drawImage(
			ICONS,
			info[0] || 0,
			info[1] || 0,
			info[2] || 12,
			info[3] || 12,
			(x * factor) + (info[4] || -6),
			(y * factor) + (info[5] || -6),
			info[2] || 12,
			info[3] || 12
		);
	}
	
	// Automatically gets the user's language setting and reverts to English if the label doesn't exist.
	function getText(label, cut = false)
	{
		let found;
		
		// Eventually make it so that if there's any language, it'll switch over to that. <selected lang> --> <en_US> --> <the first lang you find afterwards>
		if(label)
			found = label[settings.language] || label.en_US;
		
		if(found === undefined)
		{
			// A label is still valid even if found doesn't include it, yet.
			if(!label)
				console.warn("Label is not defined!");
			found = 'X';
		}
		else if(cut)
		{
			if(found.includes('<<A'))
				found = found.substring(0, found.indexOf('<<A'));
			else if(found.includes('<<C'))
				found = found.substring(0, found.indexOf('<<C'));
		}
		
		return found;
	}
	
	/////////////////////////////////
	// Document-Specific Functions //
	/////////////////////////////////
	
	function setViewMode(isResultMode = false)
	{
		if(isResultMode)
		{
			generateTilesAdvanced();
			drawConnections();
			drawIcons();
			drawLandmarks();
			setAuxiliaryButtons(true, true);
			setCommandButtons(true, true);
			resetCursor();
			setMouseMode(0);
			mode = true;
		}
		else
		{
			generateTiles();
			setAuxiliaryButtons(true, false);
			setCommandButtons(true, false);
			resetCursor();
			setMouseMode(1);
			mode = false;
		}
	}
	
	function setMouseMode(mode = 0)
	{
		if(mode === 1)
		{
			// left click = individual tiling
			// right click = boxing
			CANVAS.onmousedown = () => {
				if(event.button === 0) // left click
				{
					if(!mouse)
						mouse = setInterval(() => {
							setTile(Math.floor(tpos.x/8), Math.floor(tpos.y/8), cursor+1, true);
						}, 10);
				}
				else if(event.button === 2) // right click
				{
					if(!pos1)
					{
						pos1 = {x: Math.floor(event.offsetX/8), y: Math.floor(event.offsetY/8)};
						setTile(pos1.x, pos1.y, cursor+1, true);
					}
					else
					{
						pos2 = {x: Math.floor(event.offsetX/8), y: Math.floor(event.offsetY/8)};
						
						// The loop is done here rather than in generateTiles since this will only loop through values that are already inside the box rather than looping through the entire floor.
						// However, since pos1 could be behind or below pos2, you'll need to account for that.
						let x0 = pos1.x;
						let x1 = pos2.x;
						let y0 = pos1.y;
						let y1 = pos2.y;
						
						if(x0 > x1)
						{
							let tmp = x0;
							x0 = x1;
							x1 = tmp;
						}
						
						if(y0 > y1)
						{
							let tmp = y0;
							y0 = y1;
							y1 = tmp;
						}
						
						for(let i = y0; i <= y1; i++)
							for(let j = x0; j <= x1; j++)
								setTile(j, i, cursor+1, true);
						
						pos1 = null;
						pos2 = null;
					}
				}
				
				isMouseDown = true;
			};
			
			window.onmouseup = () => {
				isMouseDown = false;
			};
			
			CANVAS.onmousemove = () => {
				tpos = {x: event.offsetX, y: event.offsetY};
			};
			
			CANVAS.onmouseup = clear;
			
			// The function will loop continuously if you let go off of the canvas.
			CANVAS.onmouseenter = () => {
				if(!isMouseDown)
					clear();
			};
			
			CANVAS.oncontextmenu = disable;
		}
		else
		{
			window.onmouseup = null;
			CANVAS.onmousemove = null;
			CANVAS.onmouseup = null;
			CANVAS.onmouseenter = null;
			CANVAS.oncontextmenu = null;
			
			if(!mode)
			{
				CANVAS.onmousedown = null;
			}
			else if(mode === 2)
			{
				CANVAS.onmousedown = () => {
					if(event.button === 0)
						placeConnection(cursor, Math.floor(event.offsetX/8), Math.floor(event.offsetY/8), data.floors[currentFloor].connections[cursor].dir, data.floors[currentFloor].connections[cursor].size);
				};
			}
			else if(mode === 3)
			{
				CANVAS.onmousedown = () => {
					if(event.button === 0)
					{
						console.log('icon', event.offsetX, event.offsetY);
					}
				};
			}
		}
	}
	
	function setViewModeButtons(enabled = false)
	{
		MODES.innerHTML = '';
		
		if(enabled)
		{
			let button = document.createElement('button');
			button.innerText = 'T';
			button.onclick = () => {
				setViewMode(false);
			};
			MODES.appendChild(button);
			
			button = document.createElement('button');
			button.innerText = 'R';
			button.onclick = () => {
				setViewMode(true);
			};
			MODES.appendChild(button);
		}
	}
	
	function setAuxiliaryButtons(enabled = false, isResultMode = false)
	{
		AUXILIARY.innerHTML = '';
		
		if(enabled)
		{
			if(isResultMode)
			{
				let button = document.createElement('button');
				button.innerText = "View Final Result";
				button.onclick = () => {
					generateTilesAdvanced();
					drawConnections();
					drawIcons();
					drawLandmarks();
					setMouseMode(0);
				};
				AUXILIARY.appendChild(button);
				
				button = document.createElement('button');
				button.innerText = "Connections Editing";
				button.onclick = () => {
					generateTilesAdvanced();
					drawConnections(true);
					setMouseMode(0);
					setCommandButtons(true, true, 'connections');
				};
				AUXILIARY.appendChild(button);
				
				button = document.createElement('button');
				button.innerText = "Icons/Landmarks Editing";
				button.onclick = () => {
					generateTilesAdvanced();
					drawConnections();
					setMouseMode(3);
					setCommandButtons(true, true, 'icons');
				};
				AUXILIARY.appendChild(button);
			}
			else
			{
				let button = document.createElement('button');
				button.innerText = "Generate New Palette";
				button.onclick = () => {
					palette.splice(1, palette.length);
					setCommandButtons(true, false);
					resetCursor();
				};
				AUXILIARY.appendChild(button);
			}
		}
	}
	
	function setCommandButtons(enabled = false, isResultMode = false, mode)
	{
		COMMAND.innerHTML = '';
		
		if(enabled)
		{
			if(isResultMode)
			{
				if(mode === 'connections')
					generateConnectionButtons(COMMAND);
				else if(mode === 'icons')
					generateIconButtons(COMMAND);
			}
			else
				generateButtons(COMMAND, generateTiles()); // Redundant function call?
		}
	}
	
	function resetCursor()
	{
		cursor = -1;
		CURSOR.innerHTML = 'Your cursor is: <span style="background-color:#000000; color:#ffffff;">&nbsp; -1 &nbsp;</span>';
	}
	
	function setData(input)
	{
		try
		{
			// f is to still generate a floor (the first index) even if defaultFloor doesn't exist or never matches a floor level.
			data = JSON.parse(input);
			let f = 0;
			
			for(let i = 0; i < data.floors.length; i++)
				if(data.floors[i].level === data.defaultFloor)
					f = i;
			
			setFloor(f);
			generateFloorButtons(FLOORS);
			setViewModeButtons(true);
		}
		catch(error) {console.error(error);}
	}
	
	/*function getData()
	{
		save();
		return JSON.stringify(data);
	}*/
	
	function drawConnection(x, y, direction = 'VERTICAL', size = 1, debug = false)
	{
		if(debug)
		{
			setTile(x, y, '#ff0000');
			
			if(direction === 'HORIZONTAL')
			{
				setTile(x + 1, y, '#00ff00');
				
				for(let i = 1; i < size; i++)
				{
					setTile(x, y + i, '#0000ff');
					setTile(x + 1, y + i, '#0000ff');
				}
			}
			else if(direction === 'VERTICAL')
			{
				setTile(x, y + 1, '#00ff00');
				
				for(let i = 1; i < size; i++)
				{
					setTile(x + i, y, '#0000ff');
					setTile(x + i, y + 1, '#0000ff');
				}
			}
		}
		else
		{
			direction = direction.toLowerCase();
			drawTile(x, y, TILEMAP.connection[direction].first);
			drawTile(x, y, TILEMAP.connection[direction].second);
			
			for(let i = 1; i < Math.max(1, size); i++)
			{
				let x0 = direction === 'vertical' ? i : 0;
				let y0 = direction === 'horizontal' ? i : 0;
				let x1 = direction === 'vertical' ? i-1 : 0;
				let y1 = direction === 'horizontal' ? i-1 : 0;
				drawTile(x + x0, y + y0, TILEMAP.connection[direction].first);
				drawTile(x + x0, y + y0, TILEMAP.connection[direction].second);
				drawTile(x + x1, y + y1, TILEMAP.connection[direction].extend.first);
				drawTile(x + x1, y + y1, TILEMAP.connection[direction].extend.second);
			}
		}
	}
	
	function drawConnections(debug = false)
	{
		for(let i = 0; i < data.floors[currentFloor].connections.length; i++)
		{
			let c = data.floors[currentFloor].connections[i];
			drawConnection(c.tx, c.ty, c.dir, c.size, debug);
		}
	}
	
	function drawIcons()
	{
		for(let i = 0; i < data.floors[currentFloor].icons.length; i++)
		{
			let c = data.floors[currentFloor].icons[i];
			drawIcon(c.x, c.y, ICONMAP[c.icon]);
		}
	}
	
	function drawLandmarks()
	{
		for(let i = 0; i < data.floors[currentFloor].landmarks.length; i++)
		{
			let c = data.floors[currentFloor].landmarks[i];
			drawIcon(c.x, c.y, ICONMAP.landmark);
		}
	}
	
	function setSize(x, y, f)
	{
		width = x || width;
		height = y || height;
		factor = f || factor;
		
		CANVAS.width = width * PIXELS * factor;
		CANVAS.height = height * PIXELS * factor;
	}
	
	// Also returns highest room number.
	function generateTiles(isolate)
	{
		setSize(floor[0].length, floor.length);
		let highest = 0;
		
		for(var i = 0; i < floor.length; i++)
		{
			for(var j = 0; j < floor[i].length; j++)
			{
				if(isolate)
					setTile(j, i, isolate.includes(floor[i][j]) ? '#ffffff' : '#000000');
				else
					setTile(j, i, floor[i][j]);
				
				if(floor[i][j] > highest)
					highest = floor[i][j];
			}
		}
		
		return highest;
	}
	
	function generateTilesAdvanced(isolate)
	{
		setSize(floor[0].length, floor.length);
		
		for(let i = 0; i < floor.length; i++)
		{
			for(let j = 0; j < floor[i].length; j++)
			{
				if(floor[i][j] === 0 || (isolate && !isolate.includes(floor[i][j])))
					drawTile(j, i);
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
					
					drawTiles(j, i, directions);
				}
			}
		}
	}
	
	// [N,S,W,E] (false/0 = closed, true/1 = open), extended would be [N,S,W,E,NE,SE,SW,NW] (in the order of cardinal/intercardinal directions as per Wikipedia)
	// Accounts for the multiple merging going on which can happen. If all sides are open but all corners are taken, apply vertices 4 times (per intercardinal direction).
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
	function drawTiles(x, y, dir)
	{
		if(!dir[0] && !dir[1] && !dir[2] && !dir[3])
			drawTile(x, y, TILEMAP.enclosed);
		else if(dir[0] && dir[1] && dir[2] && dir[3])
			drawTile(x, y, TILEMAP.open);
		else if(!dir[0] && dir[1] && !dir[2] && dir[3])
			drawTile(x, y, TILEMAP.corner.nw);
		else if(!dir[0] && dir[1] && dir[2] && !dir[3])
			drawTile(x, y, TILEMAP.corner.ne);
		else if(dir[0] && !dir[1] && !dir[2] && dir[3])
			drawTile(x, y, TILEMAP.corner.sw);
		else if(dir[0] && !dir[1] && dir[2] && !dir[3])
			drawTile(x, y, TILEMAP.corner.se);
		else if(!dir[0] && dir[1] && dir[2] && dir[3])
			drawTile(x, y, TILEMAP.edge.north);
		else if(dir[0] && !dir[1] && dir[2] && dir[3])
			drawTile(x, y, TILEMAP.edge.south);
		else if(dir[0] && dir[1] && !dir[2] && dir[3])
			drawTile(x, y, TILEMAP.edge.west);
		else if(dir[0] && dir[1] && dir[2] && !dir[3])
			drawTile(x, y, TILEMAP.edge.east);
		else if(!dir[0] && !dir[1] && dir[2] && dir[3])
		{
			drawTile(x, y, TILEMAP.tunnel.horizontal[0]);
			drawTile(x, y, TILEMAP.tunnel.horizontal[1]);
		}
		else if(dir[0] && dir[1] && !dir[2] && !dir[3])
		{
			drawTile(x, y, TILEMAP.tunnel.vertical[0]);
			drawTile(x, y, TILEMAP.tunnel.vertical[1]);
		}
		else if(dir[0] && !dir[1] && !dir[2] && !dir[3])
		{
			drawTile(x, y, TILEMAP.culdesac.north[0]);
			drawTile(x, y, TILEMAP.culdesac.north[1]);
		}
		else if(!dir[0] && dir[1] && !dir[2] && !dir[3])
		{
			drawTile(x, y, TILEMAP.culdesac.south[0]);
			drawTile(x, y, TILEMAP.culdesac.south[1]);
		}
		else if(!dir[0] && !dir[1] && dir[2] && !dir[3])
		{
			drawTile(x, y, TILEMAP.culdesac.west[0]);
			drawTile(x, y, TILEMAP.culdesac.west[1]);
		}
		else if(!dir[0] && !dir[1] && !dir[2] && dir[3])
		{
			drawTile(x, y, TILEMAP.culdesac.east[0]);
			drawTile(x, y, TILEMAP.culdesac.east[1]);
		}
		else
			drawTile(x, y, [0,0]);
		
		// Octo-Directional //
		
		if(dir[0] && dir[2] && dir[7])
			drawTile(x, y, TILEMAP.vertex.nw);
		
		if(dir[0] && dir[3] && dir[4])
			drawTile(x, y, TILEMAP.vertex.ne);
		
		if(dir[1] && dir[2] && dir[6])
			drawTile(x, y, TILEMAP.vertex.sw);
		
		if(dir[1] && dir[3] && dir[5])
			drawTile(x, y, TILEMAP.vertex.se);
	}
	
	function setFloor(num = 0)
	{
		currentFloor = num;
		floor = data.floors[num].tiles;
		setViewMode(mode);
	}
	
	function upload(file)
	{
		// Check if file is undefined, ie if you exit the window instead of selecting a file.
		if(file)
		{
			filename = file.name;
			let reader = new FileReader();
			reader.readAsText(file, 'UTF-8');
			reader.onload = () => {setData(event.target.result);}
			reader.onerror = () => {console.error('Error with reading file.');}
		}
	}
	
	function pushChanges()
	{
		data.floors[currentFloor].tiles = floor;
		
		if(CURSOR.children[1] && data.floors[currentFloor].maps[cursor])
			data.floors[currentFloor].maps[cursor].name = getLangLabel(CURSOR.children[1]);
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
		add.oninput = function() {setText(this)};
		
		if(description)
			add.placeholder = description;
		
		if(data)
			add.value = data[settings.language] || '';
		
		e.appendChild(add);
		
		// Language Options //
		add = document.createElement('select');
		add.onchange = function() {setLang(this)};
		
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
					
					if(key === settings.language)
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
				
				if(lang === settings.language)
					choice.selected = true;
				
				add.appendChild(choice);
			}
		}
		
		e.appendChild(add);
		
		// LangUid //
		add = document.createElement('input');
		add.type = 'number';
		add.oninput = function() {setLangUid(this)};
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
	
	function output() {INPUT.value = JSON.stringify(data);}
	
	function clear()
	{
		if(mouse)
		{
			clearInterval(mouse);
			mouse = null;
		}
	}
	
	function disable() {event.preventDefault();}
	
	// Set the default limit based on something more concrete like the length of the maps?
	function generateButtons(e, limit = palette.length)
	{
		e.innerHTML = '';
		
		for(let i = -1; i < limit; i++)
		{
			let button = document.createElement('button');
			
			button.innerText = i;
			button.style.backgroundColor = getColor(i+1);
			button.style.color = getColor(i+1, true);
			button.oncontextmenu = disable;
			button.onmousedown = () => {
				if(event.button === 2)
					generateTiles([i+1]);
				else
					setCursorRoom(CURSOR, i);
			};
			button.onmouseup = () => {
				if(event.button === 2)
					generateTiles();
			};
			
			e.appendChild(button);
		}
		
		if(limit !== -1)
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
			let handle = data.floors[i].handle;
			let name = data.floors[i].level;
			
			if(handle)
				name = getText(handle, true);
			else if(name === 0)
				name = getText(LEXICON.floor.ground);
			else if(name > 0)
				name = name + getText(LEXICON.floor.upper);
			else if(name < 0)
				name = getText(LEXICON.floor.lower) + -name;
			
			button.innerText = name;
			button.onclick = () => {
				pushChanges();
				setFloor(i);
			};
			
			e.appendChild(button);
		}
		
		return e;
	}
	
	function generateConnectionButtons(e)
	{
		e.innerHTML = '';
		
		let button = document.createElement('button');
		button.innerText = '-1';
		button.style.backgroundColor = '#000000';
		button.style.color = '#ffffff';
		button.oncontextmenu = disable;
		button.onmousedown = () => {
			generateTilesAdvanced();
			drawConnections(true);
			setMouseMode(0);
			
			if(event.button !== 2)
				setCursorConnection(CURSOR, -1);
		};
		button.onmouseup = () => {
			if(event.button === 2)
				setMouseMode(2);
		};
		e.appendChild(button);
		
		for(let i = 0; i < data.floors[currentFloor].connections.length; i++)
		{
			let c = data.floors[currentFloor].connections[i];
			button = document.createElement('button');
			button.innerText = i;
			button.style.background = `linear-gradient(90deg, ${getColor(c.map1+1)} 50%, ${getColor(c.map2+1)} 50%)`;
			button.oncontextmenu = disable;
			button.onmousedown = () => {
				if(event.button === 2)
				{
					generateTilesAdvanced([c.map1+1, c.map2+1]);
					drawConnection(c.tx, c.ty, c.dir, c.size, true);
					setMouseMode(0);
				}
				else
				{
					generateTilesAdvanced();
					drawConnections(true);
					setMouseMode(2);
					setCursorConnection(CURSOR, i);
				}
			};
			button.onmouseup = () => {
				if(event.button === 2)
				{
					generateTilesAdvanced();
					drawConnections(true);
					setMouseMode(2);
				}
			};
			e.appendChild(button);
		}
		
		return e;
	}
	
	function setCursorRoom(e, index = -1)
	{
		if(e.children[1] && data.floors[currentFloor].maps[cursor])
			data.floors[currentFloor].maps[cursor].name = getLangLabel(e.children[1]);
		
		cursor = index;
		e.innerHTML = `Your cursor is: <span style="background-color:${getColor(index+1)}; color:${getColor(index+1, true)};">&nbsp; ${index} &nbsp;</span>`;
		
		if(index !== -1)
			e.appendChild(setLangLabel(document.createElement('div'), 'Map Name', (data.floors[currentFloor].maps[index] && data.floors[currentFloor].maps[index].name) || null));
	}
	
	function setCursorConnection(e, index = -1)
	{
		cursor = index;
		e.innerHTML = `Your cursor is: <span style="background-color:#000000; color:#ffffff;">&nbsp; ${index} &nbsp;</span>`;
		
		if(index !== -1)
		e.appendChild(setConnection(document.createElement('div'), index));
	}
	
	function setConnection(e, index)
	{
		e.appendChild(setValue(data.floors[currentFloor].connections[index], 'tx', 'number', index));
		e.appendChild(setValue(data.floors[currentFloor].connections[index], 'ty', 'number', index));
		e.appendChild(setValue(data.floors[currentFloor].connections[index], 'dir', 'text', index));
		e.appendChild(setValue(data.floors[currentFloor].connections[index], 'size', 'number', index));
		return e;
	}
	
	// (in an input node) setValue(data.floors[currentFloor].connections[i], 'tx', this.value)
	function setValue(obj, key, type, index)
	{
		let add = document.createElement('input');
		add.type = type;
		add.placeholder = key;
		add.classList.add('medium');
		add.value = obj[key] || '';
		add.oninput = function() {
			obj[key] = type === 'number' ? Number(this.value) : this.value;
			placeConnection(index, obj.tx, obj.ty, obj.dir, obj.size);
		};
		return add;
	}
	
	function placeConnection(index, x, y, dir, size)
	{
		data.floors[currentFloor].connections[index].tx = x;
		data.floors[currentFloor].connections[index].ty = y;
		data.floors[currentFloor].connections[index].dir = dir;
		data.floors[currentFloor].connections[index].size = size;
		generateTilesAdvanced();
		drawConnections(true);
		setCursorConnection(CURSOR, index);
	}
	
	function generateIconButtons(e)
	{
		e.innerHTML = '';
		
		for(let i = 0; i < data.floors[currentFloor].icons.length; i++)
		{
			let c = data.floors[currentFloor].icons[i];
			console.log(c);
		}
		
		for(let i = 0; i < data.floors[currentFloor].landmarks.length; i++)
		{
			let c = data.floors[currentFloor].landmarks[i];
			console.log(c);
		}
		
		return e;
	}
	
	// This makes it easy to import settings
	// Load a stringified JSON object containing settings.
	// Add settings that aren't present and also remove deprecated settings.
	// Do this by only copying keys that also exist in settings.
	function loadSettings(options)
	{
		try
		{
			if(!options)
				throw "No settings detected! Generating default values.";
			
			options = JSON.parse(options);
			
			// This modifies settings based on what's in the local storage.
			// Any unused keys are essentially discarded.
			// Any missing keys are left to whatever the default is.
			// This also prevents soft comparison. So if a setting is 0, it'll copy over.
			for(let key in settings)
				if(Object.keys(options).includes(key))
					settings[key] = options[key];
		}
		catch(error) {console.log(error)}
		
		// Then, the new settings, or default settings, are stored into the local storage.
		window.localStorage.setItem('CCAE', JSON.stringify(settings));
	}
	
	// Checks if option is a valid key, then stores the new value in both settings and the local storage.
	function storeOption(option, value)
	{
		if(Object.keys(settings).includes(option))
		{
			settings[option] = value;
			window.localStorage.setItem('CCAE', JSON.stringify(settings));
			return true;
		}
		
		return false;
	}
	
	///////////////////////
	// Utility Functions //
	///////////////////////
	
	function getColor(value, invert = false)
	{
		if(!palette[value])
			palette[value] = getRandom(0, 16777216).toString(16).padStart(6, '000000');
		
		return '#' + (invert ? inverseColor(palette[value]) : palette[value]);
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