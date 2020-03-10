// A single class to manage an area in order to separate it from code dealing with the document.
class Area
{
	// When the data is stringified, it'll skip over undefined keys unless it has a value. However, the order of these keys will remain.
	constructor(data = {})
	{
		this.name = data.name || undefined;
		this.width = data.width || 1;
		this.height = data.height || 1;
		this.floors = data.floors || [];
		this.chests = data.chests || 0;
		// defaultFloor only affects which floor you first see when you go to an area you're NOT currently in.
		this.defaultFloor = data.defaultFloor || 0;
		this.addFloor();
		this.setFloor();
	}
	
	addFloor(index = this.floors.length)
	{
		return this.floors.splice(index, 0, {
			level: 0,
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
	}
	
	// For efficiency, set the height then the width, so that you deal with less operations.
	setWidth(w = this.width)
	{
		// Resize Width //
		if(w < this.width)
			for(let f = 0, flen = this.floors.length; f < flen; f++)
				for(let i = 0, len = this.width; i < len; i++)
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