class Canvas
{
	constructor(c)
	{
		this.canvas = c;
		this.pencil = c.getContext('2d');
		this.factor = 1;
		
		this.tiles = new Image();
		this.tiles.src = 'tiles.png';
		
		this.icons = new Image();
		this.icons.src = 'icons.png';
		
		let mouse = null;
		let tpos = {x: 0, y: 0};
		let pos1 = null;
		let pos2 = null;
		let isMouseDown = false;
	}
	
	setTile(x, y, value, modify = false)
	{
		this.pencil.fillStyle = typeof value === 'number' ? this.palette.getColor(value) : value;
		this.pencil.fillRect(x * 8, y * 8, 8, 8);
		
		if(modify)
			this.area.tiles[y][x] = value;
	}
	
	drawTile(x, y, info = [])
	{
		this.pencil.drawImage(
			this.tiles,
			info[0] || 0,
			info[1] || 0,
			info[2] || 8,
			info[3] || 8,
			(x * 8) + (info[4] || 0),
			(y * 8) + (info[5] || 0),
			info[2] || 8,
			info[3] || 8
		);
	}
	
	// x and y are absolute coordinates here, because icons aren't tied to the grid.
	drawIcon(x, y, info = [])
	{
		this.pencil.drawImage(
			this.icons,
			info[0] || 0,
			info[1] || 0,
			info[2] || 12,
			info[3] || 12,
			x + (info[4] || -6),
			y + (info[5] || -6),
			info[2] || 12,
			info[3] || 12
		);
	}
	
	setSize(x, y)
	{
		this.canvas.width = x * 8;
		this.canvas.height = y * 8;
	}
	
	setFactor(f)
	{
		this.factor = f || this.factor;
		
		if(this.factor <= 0)
			this.factor = 1;
		
		if(factor === 1)
		{
			this.canvas.style.width = '';
			this.canvas.style.height = '';
		}
		else
		{
			this.canvas.style.width = (this.factor * 100) + '%';
			this.canvas.style.height = (this.factor * 100) + '%';
		}
	}
	
	setArea(a)
	{
		this.area = a;
	}
	
	setPalette(p)
	{
		this.palette = p;
	}
	
	setCursor(index = -1)
	{
		this.cursor = index;
	}
	
	setMouseMode(mode)
	{
		if(mode === 1)
		{
			// left click = individual tiling
			// right click = boxing
			this.canvas.onmousedown = () => {
				if(event.button === 0) // left click
				{
					if(!this.mouse)
						this.mouse = setInterval(() => {
							this.setTile(Math.floor(this.tpos.x / this.factor / 8), Math.floor(this.tpos.y / this.factor / 8), this.cursor + 1, true);
						}, 10);
				}
				else if(event.button === 2) // right click
				{
					if(!this.pos1)
					{
						this.pos1 = {x: Math.floor(event.offsetX / this.factor / 8), y: Math.floor(event.offsetY / this.factor / 8)};
						this.setTile(this.pos1.x, this.pos1.y, this.cursor + 1, true);
					}
					else
					{
						this.pos2 = {x: Math.floor(event.offsetX / this.factor / 8), y: Math.floor(event.offsetY / this.factor / 8)};
						
						// The loop is done here rather than in generateTiles since this will only loop through values that are already inside the box rather than looping through the entire floor.
						// However, since pos1 could be behind or below pos2, you'll need to account for that.
						let x0 = this.pos1.x;
						let x1 = this.pos2.x;
						let y0 = this.pos1.y;
						let y1 = this.pos2.y;
						
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
								this.setTile(j, i, this.cursor + 1, true);
						
						this.pos1 = null;
						this.pos2 = null;
					}
				}
				
				this.isMouseDown = true;
			};
			
			window.onmouseup = () => {
				this.isMouseDown = false;
				this.clear();
			};
			
			this.canvas.onmousemove = () => {
				this.tpos = {x: event.offsetX, y: event.offsetY};
			};
			
			this.canvas.onmouseup = this.clear;
			
			// The function will loop continuously if you let go off of the canvas.
			this.canvas.onmouseenter = () => {
				if(!this.isMouseDown)
					this.clear();
			};
			
			this.canvas.oncontextmenu = this.disable;
		}
		else
		{
			window.onmouseup = null;
			this.canvas.onmousemove = null;
			this.canvas.onmouseup = null;
			this.canvas.onmouseenter = null;
			this.canvas.oncontextmenu = null;
			
			if(!mode)
			{
				this.canvas.onmousedown = null;
			}
			else if(mode === 2)
			{
				this.canvas.onmousedown = () => {
					if(event.button === 0)
						placeConnection(this.cursor, Math.floor(event.offsetX / this.factor / 8), Math.floor(event.offsetY / this.factor / 8), this.area.floor.connections[this.cursor].dir, this.area.floor.connections[this.cursor].size);
				};
			}
			else if(mode === 3)
			{
				this.canvas.onmousedown = () => {
					if(event.button === 0)
					{
						console.log('icon', event.offsetX, event.offsetY);
					}
				};
			}
		}
	}
	
	clear()
	{
		if(this.mouse)
		{
			clearInterval(this.mouse);
			this.mouse = null;
		}
	}
	
	disable()
	{
		event.preventDefault();
	}
	
	drawConnection(x, y, direction = 'VERTICAL', size = 1, debug = false)
	{
		if(debug)
		{
			this.setTile(x, y, '#ff0000');
			
			if(direction === 'HORIZONTAL')
			{
				this.setTile(x + 1, y, '#00ff00');
				
				for(let i = 1; i < size; i++)
				{
					this.setTile(x, y + i, '#0000ff');
					this.setTile(x + 1, y + i, '#0000ff');
				}
			}
			else if(direction === 'VERTICAL')
			{
				this.setTile(x, y + 1, '#00ff00');
				
				for(let i = 1; i < size; i++)
				{
					this.setTile(x + i, y, '#0000ff');
					this.setTile(x + i, y + 1, '#0000ff');
				}
			}
		}
		else
		{
			direction = direction.toLowerCase();
			this.drawTile(x, y, DEFINITIONS.TILEMAP.connection[direction].first);
			this.drawTile(x, y, DEFINITIONS.TILEMAP.connection[direction].second);
			
			for(let i = 1; i < Math.max(1, size); i++)
			{
				let x0 = direction === 'vertical' ? i : 0;
				let y0 = direction === 'horizontal' ? i : 0;
				let x1 = direction === 'vertical' ? i-1 : 0;
				let y1 = direction === 'horizontal' ? i-1 : 0;
				this.drawTile(x + x0, y + y0, DEFINITIONS.TILEMAP.connection[direction].first);
				this.drawTile(x + x0, y + y0, DEFINITIONS.TILEMAP.connection[direction].second);
				this.drawTile(x + x1, y + y1, DEFINITIONS.TILEMAP.connection[direction].extend.first);
				this.drawTile(x + x1, y + y1, DEFINITIONS.TILEMAP.connection[direction].extend.second);
			}
		}
	}
	
	drawConnections(floor, debug = false)
	{
		for(let i = 0; i < floor.connections.length; i++)
		{
			let c = floor.connections[i];
			this.drawConnection(c.tx, c.ty, c.dir, c.size, debug);
		}
	}
	
	drawIcons(floor)
	{
		for(let i = 0; i < floor.icons.length; i++)
		{
			let c = floor.icons[i];
			this.drawIcon(c.x, c.y, DEFINITIONS.ICONMAP[c.icon]);
		}
	}
	
	drawLandmarks(floor)
	{
		for(let i = 0; i < floor.landmarks.length; i++)
		{
			let c = floor.landmarks[i];
			this.drawIcon(c.x, c.y, DEFINITIONS.ICONMAP.landmark);
		}
	}
}