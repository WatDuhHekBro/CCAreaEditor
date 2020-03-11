//const CCAE = (() => {
	"use strict";
	
	/////////////////////////////
	// Fields / Initialization //
	/////////////////////////////
	const AUXILIARY = document.getElementById("auxiliary");
	const COMMAND = document.getElementById("command");
	const CURSOR = document.getElementById("cursor");
	const INPUT = document.getElementById("input");
	const FLOORS = document.getElementById("floors");
	const MODES = document.getElementById("modes");
	const OPTIONS = document.getElementById("options");
	let filename = 'area.json';
	let data = new Area();
	let palette = new Palette();
	let canvas = new Canvas(document.getElementById('canvas'));
	// new Toolbar(); (buttons, auxiliary, command, cursor; basically everything below the canvas)
	// lang.js -> LangManager() (handles a static getText and also LangLabels)
	canvas.setArea(data);
	canvas.setPalette(palette);
	let cursor = -1;
	let settings = new Config();
	let mode = false;
	
	// Generate Title Screen //
	canvas.setSize(DEFINITIONS.LOGO.width, DEFINITIONS.LOGO.height);
	
	for(let t = DEFINITIONS.LOGO.tiles, i = 0, h = DEFINITIONS.LOGO.height; i < h; i++)
		for(let j = 0, w = DEFINITIONS.LOGO.width; j < w; j++)
			canvas.setTile(j, i, t[i][j] === 0 ? '#000000' : '#ffffff');
	
	///////////////////
	// Usable Object //
	///////////////////
	/*return {
		system:
		{
			input: input,
			output: output
		},
		debug: function()
		{
			console.log('blah blah blah');
			//...
		}
	};*/
	
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
			canvas.drawConnections(data.floor);
			canvas.drawIcons(data.floor);
			canvas.drawLandmarks(data.floor);
			setAuxiliaryButtons(true, true);
			setCommandButtons(true, true);
			resetCursor();
			canvas.setMouseMode(0);
			mode = true;
		}
		else
		{
			generateTiles();
			setAuxiliaryButtons(true, false);
			setCommandButtons(true, false);
			resetCursor();
			canvas.setMouseMode(1);
			mode = false;
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
		let floor = data.floor;
		AUXILIARY.innerHTML = '';
		
		if(enabled)
		{
			if(isResultMode)
			{
				let button = document.createElement('button');
				button.innerText = "View Final Result";
				button.onclick = () => {
					generateTilesAdvanced();
					canvas.drawConnections(floor);
					canvas.drawIcons(floor);
					canvas.drawLandmarks(floor);
					canvas.setMouseMode(0);
					setCommandButtons(false, true);
				};
				AUXILIARY.appendChild(button);
				
				button = document.createElement('button');
				button.innerText = "Connections Editing";
				button.onclick = () => {
					generateTilesAdvanced();
					canvas.drawConnections(floor, true);
					canvas.setMouseMode(0);
					setCommandButtons(true, true, 'connections');
				};
				AUXILIARY.appendChild(button);
				
				button = document.createElement('button');
				button.innerText = "Icons/Landmarks Editing";
				button.onclick = () => {
					generateTilesAdvanced();
					canvas.drawConnections(floor);
					canvas.setMouseMode(3);
					setCommandButtons(true, true, 'icons');
				};
				AUXILIARY.appendChild(button);
			}
			else
			{
				let button = document.createElement('button');
				button.innerText = "Generate New Palette";
				button.onclick = () => {
					palette.generateNewPalette();
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
	
	function setCursor(index = -1)
	{
		cursor = index;
		canvas.setCursor(index);
	}
	
	function resetCursor()
	{
		setCursor(-1);
		CURSOR.innerHTML = 'Your cursor is: <span style="background-color:#000000; color:#ffffff;">&nbsp; -1 &nbsp;</span>';
	}
	
	// Also returns highest room number.
	function generateTiles(isolate)
	{
		let floor = data.tiles;
		canvas.setSize(data.width, data.height);
		let highest = 0;
		
		for(var i = 0; i < floor.length; i++)
		{
			for(var j = 0; j < floor[i].length; j++)
			{
				if(isolate)
					canvas.setTile(j, i, isolate.includes(floor[i][j]) ? '#ffffff' : '#000000');
				else
					canvas.setTile(j, i, floor[i][j]);
				
				if(floor[i][j] > highest)
					highest = floor[i][j];
			}
		}
		
		return highest;
	}
	
	function generateTilesAdvanced(isolate)
	{
		let floor = data.tiles;
		canvas.setSize(data.width, data.height);
		
		for(let i = 0; i < floor.length; i++)
		{
			for(let j = 0; j < floor[i].length; j++)
			{
				if(floor[i][j] === 0 || (isolate && !isolate.includes(floor[i][j])))
					canvas.drawTile(j, i);
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
					
					let tile = DEFINITIONS.TILES[(directions[0] << 3) | (directions[1] << 2) | (directions[2] << 1) | directions[3]];
					
					if((tile[0] && tile[0].constructor === Array) || (tile[1] && tile[1].constructor === Array))
					{
						canvas.drawTile(j, i, tile[0]);
						canvas.drawTile(j, i, tile[1]);
					}
					else
						canvas.drawTile(j, i, tile);
					
					// Octo-Directional //
					
					if(directions[0] && directions[2] && directions[7])
						canvas.drawTile(j, i, DEFINITIONS.TILEMAP.vertex.nw);
					if(directions[0] && directions[3] && directions[4])
						canvas.drawTile(j, i, DEFINITIONS.TILEMAP.vertex.ne);
					if(directions[1] && directions[2] && directions[6])
						canvas.drawTile(j, i, DEFINITIONS.TILEMAP.vertex.sw);
					if(directions[1] && directions[3] && directions[5])
						canvas.drawTile(j, i, DEFINITIONS.TILEMAP.vertex.se);
				}
			}
		}
	}
	
	function upload(file)
	{
		// Check if file is undefined, ie if you exit the window instead of selecting a file.
		if(file)
		{
			filename = file.name;
			let reader = new FileReader();
			reader.readAsText(file, 'UTF-8');
			reader.onload = () => {
				try
				{
					data.setData(JSON.parse(event.target.result));
					data.setFloorView();
					setViewMode(mode);
					generateFloorButtons(FLOORS);
					setViewModeButtons(true);
				}
				catch(error) {console.error(error);}
			}
			reader.onerror = () => {console.error('Error with reading file.');}
		}
	}
	
	function pushChanges()
	{
		if(CURSOR.children[1] && data.floor.maps[cursor])
			data.floor.maps[cursor].name = getLangLabel(CURSOR.children[1]);
	}
	
	function download()
	{
		pushChanges();
		downloadFile(filename, JSON.stringify(data.getData()));
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
	
	function setOverlay(s)
	{
		if(s === 'options')
			document.getElementById('overlay_options').style.display = 'block';
		else
			document.getElementById('overlay_options').style.display = 'none';
		
		if(s === 'settings')
			document.getElementById('overlay_settings').style.display = 'block';
		else
			document.getElementById('overlay_settings').style.display = 'none';
	}
	
	function output() {INPUT.value = JSON.stringify(data.getData());}
	
	// Set the default limit based on something more concrete like the length of the maps?
	function generateButtons(e, limit = palette.palette.length)
	{
		e.innerHTML = '';
		
		for(let i = -1; i < limit; i++)
		{
			let button = document.createElement('button');
			
			button.innerText = i;
			button.style.backgroundColor = palette.getColor(i+1);
			button.style.color = palette.getColor(i+1, true);
			button.oncontextmenu = canvas.disable;
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
				name = getText(DEFINITIONS.LEXICON.floor.ground);
			else if(name > 0)
				name = name + getText(DEFINITIONS.LEXICON.floor.upper);
			else if(name < 0)
				name = getText(DEFINITIONS.LEXICON.floor.lower) + -name;
			
			button.innerText = name;
			button.onclick = () => {
				pushChanges();
				data.setFloor(i);
				setViewMode(mode);
			};
			
			e.appendChild(button);
		}
		
		return e;
	}
	
	function generateConnectionButtons(e)
	{
		let floor = data.floor;
		e.innerHTML = '';
		
		let button = document.createElement('button');
		button.innerText = '-1';
		button.style.backgroundColor = '#000000';
		button.style.color = '#ffffff';
		button.oncontextmenu = canvas.disable;
		button.onmousedown = () => {
			generateTilesAdvanced();
			canvas.drawConnections(floor, true);
			canvas.setMouseMode(0);
			
			if(event.button !== 2)
				setCursorConnection(CURSOR, -1);
		};
		button.onmouseup = () => {
			if(event.button === 2)
				canvas.setMouseMode(2);
		};
		e.appendChild(button);
		
		for(let i = 0; i < data.floor.connections.length; i++)
		{
			let c = data.floor.connections[i];
			button = document.createElement('button');
			button.innerText = i;
			button.style.background = `linear-gradient(90deg, ${palette.getColor(c.map1+1)} 50%, ${palette.getColor(c.map2+1)} 50%)`;
			button.oncontextmenu = canvas.disable;
			button.onmousedown = () => {
				if(event.button === 2)
				{
					generateTilesAdvanced([c.map1+1, c.map2+1]);
					canvas.drawConnection(c.tx, c.ty, c.dir, c.size, true);
					canvas.setMouseMode(0);
				}
				else
				{
					generateTilesAdvanced();
					canvas.drawConnections(floor, true);
					canvas.setMouseMode(2);
					setCursorConnection(CURSOR, i);
				}
			};
			button.onmouseup = () => {
				if(event.button === 2)
				{
					generateTilesAdvanced();
					canvas.drawConnections(floor, true);
					canvas.setMouseMode(2);
				}
			};
			e.appendChild(button);
		}
		
		return e;
	}
	
	function setCursorRoom(e, index = -1)
	{
		if(e.children[1] && data.floor.maps[cursor])
			data.floor.maps[cursor].name = getLangLabel(e.children[1]);
		
		setCursor(index);
		e.innerHTML = `Your cursor is: <span style="background-color:${palette.getColor(index+1)}; color:${palette.getColor(index+1, true)};">&nbsp; ${index} &nbsp;</span>`;
		
		if(index !== -1)
			e.appendChild(setLangLabel(document.createElement('div'), 'Map Name', (data.floor.maps[index] && data.floor.maps[index].name) || null));
	}
	
	function setCursorConnection(e, index = -1)
	{
		setCursor(index);
		e.innerHTML = `Your cursor is: <span style="background-color:#000000; color:#ffffff;">&nbsp; ${index} &nbsp;</span>`;
		
		if(index !== -1)
			e.appendChild(setConnection(document.createElement('div'), index));
	}
	
	function setConnection(e, index)
	{
		e.appendChild(setValue(data.floor.connections[index], 'tx', 'number', index));
		e.appendChild(setValue(data.floor.connections[index], 'ty', 'number', index));
		e.appendChild(setValue(data.floor.connections[index], 'dir', 'text', index));
		e.appendChild(setValue(data.floor.connections[index], 'size', 'number', index));
		return e;
	}
	
	// (in an input node) setValue(data.floor.connections[i], 'tx', this.value)
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
		data.floor.connections[index].tx = x;
		data.floor.connections[index].ty = y;
		data.floor.connections[index].dir = dir;
		data.floor.connections[index].size = size;
		generateTilesAdvanced();
		canvas.drawConnections(data.floor, true);
		setCursorConnection(CURSOR, index);
	}
	
	function generateIconButtons(e)
	{
		e.innerHTML = '';
		
		for(let i = 0; i < data.floor.icons.length; i++)
		{
			let c = data.floor.icons[i];
			console.log(c);
		}
		
		for(let i = 0; i < data.floor.landmarks.length; i++)
		{
			let c = data.floor.landmarks[i];
			console.log(c);
		}
		
		return e;
	}
	
	function generateInput(a)
	{
		let add = document.createElement('input');
		
		if(a)
		{
			add.type = a.type || 'text';
			add.placeholder = a.placeholder || a.key || '';
			add.classList.add('medium');
			add.value = a.object[a.key] || '';
			
			if(a.type === 'number')
				add.oninput = function() {
					a.object[a.key] = Number(this.value);
					a.callback && a.callback();
				};
			else
				add.oninput = function() {
					a.object[a.key] = this.value;
					a.callback && a.callback();
				};
		}
		
		return add;
	}
	
	// Broken Function
	/*function create()
	{
		canvas.setSize(1, 1);
		generateTiles();
		generateFloorButtons(FLOORS);
		setViewModeButtons(true);
		
		OPTIONS.innerHTML = '';
		OPTIONS.appendChild(generateInput({
			object: data,
			key: 'width',
			type: 'number',
			placeholder: 'width',
			callback: function() {
				canvas.setSize();
			}
		}));
		OPTIONS.appendChild(generateInput({
			object: data,
			key: 'height',
			type: 'number',
			placeholder: 'height',
			callback: function() {
				canvas.setSize();
			}
		}));
	}*/
//})();