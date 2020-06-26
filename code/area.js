// A single class to manage an area in order to separate it from code dealing with the document.
class Area
{
	// When the data is stringified, it'll skip over undefined keys unless it has a value. However, the order of these keys will remain.
	constructor(data)
	{
		this.setData(data || {
			name: undefined,
			width: 1,
			height: 1,
			floors: [],
			chests: 0,
			defaultFloor: 0 // defaultFloor only affects which floor you first see when you go to an area you're NOT currently in.
		});
		
		this.addFloor();
		this.setFloor(0);
	}
	
	addFloor(index = this.floors.length)
	{
		return this.floors.splice(index, 0, {
			level: 0, // fix this, increment one by the previous floor (if it exists)
			name: undefined,
			tiles: this.fillTiles(),
			icons: [],
			maps: [],
			connections: [],
			landmarks: [],
			handle: undefined
		});
	}
	
	removeFloor(index = this.floors.length - 1)
	{
		return this.floors.splice(index, 1);
	}
	
	setFloor(f = 0)
	{
		this.currentFloor = f;
		this.floor = this.floors[f];
		this.tiles = this.floor.tiles;
	}
	
	setFloorView()
	{
		// f is to still generate a floor (the first index) even if defaultFloor doesn't exist or never matches a floor level.
		let f = 0;
		
		for(let i = 0; i < data.floors.length; i++)
			if(data.floors[i].level === data.defaultFloor)
				f = i;
		
		this.setFloor(f);
	}
	
	// For efficiency, set the height then the width, so that you deal with less operations.
	setWidth(w = this.width)
	{
		// Resize Width //
		if(w < this.width)
			for(let f = 0, flen = this.floors.length; f < flen; f++)
				for(let i = 0, len = this.height; i < len; i++)
					this.floors[f].tiles[i].splice(w, this.width - w);
		else if(w > this.width)
		{
			let fill = [];
			
			for(let amount = w - this.width; amount--;)
				fill.push(0);
			
			for(let f = 0, flen = this.floors.length; f < flen; f++)
				for(let i = 0, len = this.floors[f].tiles.length; i < len; i++)
					this.floors[f].tiles[i].splice(len, 0, ...fill);
		}
		
		// Set Width And Swap //
		let old = this.width;
		this.width = w;
		return old;
	}
	
	getWidth()
	{
		return this.width;
	}
	
	setHeight(h = this.height)
	{
		// Resize Height //
		if(h < this.height)
			for(let f = 0, flen = this.floors.length; f < flen; f++)
				this.floors[f].tiles.splice(h, this.height - h);
		else if(h > this.height)
		{
			let fill = [];
			let filleach = [];
			
			for(let amount = h; amount--;)
				filleach.push(0);
			
			for(let amount = h - this.height; amount--;)
				fill.push(filleach);
			
			for(let f = 0, flen = this.floors.length; f < flen; f++)
				this.floors[f].tiles.splice(h, 0, ...fill);
		}
		
		// Set Height And Swap //
		let old = this.width;
		this.height = h;
		return old;
	}
	
	getHeight()
	{
		return this.height;
	}
	
	setSelected(key, index)
	{
		if(key === 'map')
			this.selected = this.floor.maps[index];
		else if(key === 'connection')
			this.selected = this.floor.connections[index];
		else if(key === 'icon')
			this.selected = this.floor.icons[index];
		else if(key === 'landmark')
			this.selected = this.floor.landmarks[index];
		else
			delete this.selected;
	}
	
	addMap()
	{
		this.floor.maps.push({
			path: 'map.name',
			name: undefined
		});
	}
	
	addConnection()
	{
		this.floor.connections.push({
			tx: 0,
			ty: 0,
			dir: 'HORIZONTAL',
			size: 1,
			map1: 0,
			map2: 0
		});
	}
	
	addIcon()
	{
		this.floor.icons.push({
			icon: 'arrow_down',
			x: 0,
			y: 0,
			map: 0
		});
	}
	
	addLandmark()
	{
		this.floor.landmarks.push({
			id: 'landmark',
			x: 0,
			y: 0,
			map: 0,
			option: 'DEFAULT'
		});
	}
	
	removeMap(index = this.floor.maps.length - 1)
	{
		return this.floor.maps.splice(index, 1);
	}
	
	removeConnection(index = this.floor.connections.length - 1)
	{
		return this.floor.connections.splice(index, 1);
	}
	
	removeIcon(index = this.floor.icons.length - 1)
	{
		return this.floor.icons.splice(index, 1);
	}
	
	removeLandmark(index = this.floor.landmarks.length - 1)
	{
		return this.floor.landmarks.splice(index, 1);
	}
	
	fillTiles()
	{
		let column = [];
		let rows = [];
		
		for(let amount = this.width; amount--;)
			column.push(0);
		
		for(let amount = this.height; amount--;)
			rows.push(column);
		
		return rows;
	}
	
	setData(data)
	{
		this.name = data.name;
		this.width = data.width;
		this.height = data.height;
		this.floors = data.floors;
		this.chests = data.chests;
		this.defaultFloor = data.defaultFloor;
	}
	
	getData()
	{
		return {
			DOCTYPE: 'AREAS_MAP',
			name: this.name,
			width: this.width,
			height: this.height,
			floors: this.floors,
			chests: this.chests,
			defaultFloor: this.defaultFloor
		};
	}
}