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
	
	function generateButtons(e, limit)
	{
		e.innerHTML = '';
		limit = limit || PALETTE.length;
		
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
		
		let button = document.createElement('button');
		button.innerText = '+';
		button.onclick = () => {
			generateButtons(e, limit + 1);
		};
		e.appendChild(button);
		
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