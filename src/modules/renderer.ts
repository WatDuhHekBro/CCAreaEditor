import Palette from "./palette";
import Matrix from "./matrix";

const tiles = new Image();
tiles.src = "tiles.png";
const icons = new Image();
icons.src = "icons.png";

class Renderer
{
	private readonly canvas: HTMLCanvasElement;
	private readonly context: CanvasRenderingContext2D|null;
	
	constructor()
	{
		this.canvas = document.createElement("canvas");
		this.canvas.style.border = "1px solid #000000";
		this.context = this.canvas.getContext("2d");
		this.setSize(1, 1);
	}
	
	public setTile(x: number, y: number, value: number, isPureValue = false)
	{
		if(this.context && !this.isOutOfBounds(x, y))
		{
			this.context.fillStyle = isPureValue ? `#${value.toString(16).padStart(6, '0')}` : Palette.getColor(value);
			this.context.fillRect(x * 8, y * 8, 8, 8);
		}
	}
	
	// [x, y, sizeX, sizeY, offsetX, offsetY]
	public drawTile(x: number, y: number, data: number[][])
	{
		if(this.context && !this.isOutOfBounds(x, y))
		{
			for(const info of data)
			{
				this.context.drawImage(
					tiles,
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
		}
	}
	
	// [x (absolute), y (absolute), sizeX, sizeY, offsetX, offsetY]
	public drawIcon(x: number, y: number, tag: string)
	{
		if(!(tag in ICONMAP))
			throw `"${tag}" is not a valid icon name!`;
		else if(this.context && !this.isOutOfBounds(x / 8, y / 8))
		{
			const info = ICONMAP[tag];
			
			this.context?.drawImage(
				icons,
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
	}
	
	private isOutOfBounds(x: number, y: number)
	{
		return x < 0 ||
			x >= this.canvas.width / 8 ||
			y < 0 ||
			y >= this.canvas.height / 8;
	}
	
	private setSize(x: number, y: number)
	{
		this.canvas.width = x * 8;
		this.canvas.height = y * 8;
	}
	
	public generateTiles(matrix: Matrix, isolate?: number[])
	{
		this.setSize(matrix.getWidth(), matrix.getHeight());
		
		matrix.iterate((x, y, value) => {
			if(isolate)
				this.setTile(x, y, isolate.includes(value) ? 0xFFFFFF : 0, true);
			else
				this.setTile(x, y, value);
		});
	}
	
	public generateTilesAdvanced(matrix: Matrix, isolate?: number[])
	{
		const width = matrix.getWidth();
		const height = matrix.getHeight();
		this.setSize(width, height);
		
		for(let y = 0; y < height; y++)
		{
			for(let x = 0; x < width; x++)
			{
				const value = matrix.get(x, y);
				
				if(value === undefined)
				{
					console.warn(`Point (${x}, ${y}) was outside of the grid!`);
					continue;
				}
				else if(value === 0 || isolate?.includes(value))
					this.drawTile(x, y, TILEMAP.void);
				else
				{
					// If y is upmost, assume N is closed.
					const north = y !== 0 && matrix.get(x, y-1) === value;
					// If y is downmost, assume S is closed.
					const south = y !== height-1 && matrix.get(x, y+1) === value;
					// If x is leftmost, assume W is closed.
					const west = x !== 0 && matrix.get(x-1, y) === value;
					// If x is rightmost, assume E is closed.
					const east = x !== width-1 && matrix.get(x+1, y) === value;
					
					// Get extra directions for adding vertices. Since these CAN be compounded on each other, false = no vertex and true = has vertex.
					// Also note that tiles with vertices cannot be on the edge, because for a tile to have a vertex NW, sides N and W have to be open.
					// NW Corner if y is upmost and x is leftmost.
					const nw = x !== 0 && y !== 0 && matrix.get(x-1, y-1) !== value;
					// NE Corner if y is upmost and x is rightmost.
					const ne = x !== 0 && y !== width-1 && matrix.get(x+1, y-1) !== value;
					// SW Corner if y is downmost and x is leftmost.
					const sw = x !== height-1 && y !== 0 && matrix.get(x-1, y+1) !== value;
					// SE Corner if y is downmost and x is rightmost.
					const se = x !== height-1 && y !== width-1 && matrix.get(x+1, y+1) !== value;
					
					this.drawTile(x, y, TILEMAP.tiles[
						+north << 3 |
						+south << 2 |
						+west << 1 |
						+east
					]);
					
					// Octo-Directional //
					
					if(north && west && nw)
						this.drawTile(x, y, TILEMAP.vertex.nw);
					if(north && east && ne)
						this.drawTile(x, y, TILEMAP.vertex.ne);
					if(south && west && sw)
						this.drawTile(x, y, TILEMAP.vertex.sw);
					if(south && east && se)
						this.drawTile(x, y, TILEMAP.vertex.se);
				}
			}
		}
	}
	
	public drawConnection(x: number, y: number, isVertical = false, size = 1)
	{
		const direction = isVertical ? "vertical" : "horizontal";
		this.drawTile(x, y, TILEMAP.connection[direction].main);
		
		for(let i = 1; i < Math.max(1, size); i++)
		{
			let x0 = isVertical ? i : 0;
			let y0 = isVertical ? 0 : i;
			let x1 = isVertical ? i-1 : 0;
			let y1 = isVertical ? 0 : i-1;
			this.drawTile(x + x0, y + y0, TILEMAP.connection[direction].main);
			this.drawTile(x + x1, y + y1, TILEMAP.connection[direction].extend);
		}
	}
	
	public drawDebugConnection(x: number, y: number, isVertical = false, size = 1)
	{
		this.setTile(x, y, 0xFF0000, true);
		
		if(isVertical)
		{
			this.setTile(x + 1, y, 0x00FF00, true);
			
			for(let i = 1; i < size; i++)
			{
				this.setTile(x, y + i, 0x0000FF, true);
				this.setTile(x + 1, y + i, 0x0000FF, true);
			}
		}
		else
		{
			this.setTile(x, y + 1, 0x00FF00, true);
			
			for(let i = 1; i < size; i++)
			{
				this.setTile(x + i, y, 0x0000FF, true);
				this.setTile(x + i, y + 1, 0x0000FF, true);
			}
		}
	}
	
	/*public attach(controller:)
	{
		
	}*/
	
	public bind()
	{
		document.body.appendChild(this.canvas);
	}
}

export default new Renderer();

// [N,S,W,E] and [N,S,W,E,NE,SE,SW,NW] (0 = closed, 1 = open)
/* [0,0,0,0] - enclosed
 * [1,1,1,1] - open
 * [0,1,0,1] - corner.nw
 * [0,1,1,0] - corner.ne
 * [1,0,0,1] - corner.sw
 * [1,0,1,0] - corner.se
 * [0,1,1,1] - edge.north
 * [1,0,1,1] - edge.south
 * [1,1,0,1] - edge.west
 * [1,1,1,0] - edge.east
 * [0,0,1,1] - tunnel.horizontal
 * [1,1,0,0] - tunnel.vertical
 * [1,0,0,0] - culdesac.north
 * [0,1,0,0] - culdesac.south
 * [0,0,1,0] - culdesac.west
 * [0,0,0,1] - culdesac.east
 * Vertices (* means that that direction isn't checked)
 * [1,*,1,*,*,*,*,0] - vertex.nw
 * [1,*,*,1,0,*,*,*] - vertex.ne
 * [*,1,1,*,*,*,0,*] - vertex.sw
 * [*,1,*,1,*,0,*,*] - vertex.se
 */
const TILEMAP = {
	void: [[0, 0, 8, 8]],
	voidLarge: [[0, 0, 16, 16]],
	// The following entries are arranged in bitwise order (0 - 15 since there are 4 booleans).
	tiles:
	[
		// enclosed //
		[[40, 0]],
		// culdesac.east //
		[[16, 0, 8, 4], [16, 12, 8, 4, 0, 4]],
		// culdesac.west //
		[[24, 0, 8, 4], [24, 12, 8, 4, 0, 4]],
		// tunnel.horizontal //
		[[20, 0, 8, 4], [20, 12, 8, 4, 0, 4]],
		// culdesac.south //
		[[16, 0, 4, 8], [28, 0, 4, 8, 4, 0]],
		// corner.nw //
		[[16, 0]],
		// corner.ne //
		[[24, 0]],
		// edge.north //
		[[20, 0]],
		// culdesac.north //
		[[16, 8, 4, 8], [28, 8, 4, 8, 4, 0]],
		// corner.sw //
		[[16, 8]],
		// corner.se //
		[[24, 8]],
		// edge.south //
		[[20, 8]],
		// tunnel.vertical //
		[[16, 4, 4, 8], [28, 4, 4, 8, 4, 0]],
		// edge.west //
		[[16, 4]],
		// edge.east //
		[[24, 4]],
		// open //
		[[20, 4]]
	],
	// This section will be used in addition to the main set to fine-tune the look of the map.
	vertex:
	{
		nw: [[32, 0, 4, 4, 0, 0]],
		ne: [[36, 0, 4, 4, 4, 0]],
		sw: [[32, 4, 4, 4, 0, 4]],
		se: [[36, 4, 4, 4, 4, 4]]
	},
	connection:
	{
		vertical:
		{
			main: [[40, 8, 8, 2, 0, 6], [40, 10, 8, 3, 0, 8]],
			extend: [[17, 3, 8, 2, 4, 6], [17, 3, 8, 3, 4, 8]]
		},
		horizontal:
		{
			main: [[32, 8, 3, 8, 5, 0], [35, 8, 2, 8, 8, 0]],
			extend: [[17, 3, 3, 8, 5, 4], [17, 3, 2, 8, 8, 4]]
		}
	}
};

const ICONMAP: {[key: string]: number[]} = {
	arrow_up: [0, 0],
	arrow_down: [12, 0],
	arrow_left: [24, 0],
	arrow_right: [36, 0],
	floor_down: [48, 0],
	weapons: [60, 0],
	//???: [72,0],
	entrance: [84, 0],
	chest: [96, 0],
	//lea?: [108,0],
	area_up: [0, 12],
	area_down: [12, 12],
	area_left: [24, 12],
	area_right: [36, 12],
	shop: [48, 12],
	trader: [60, 12],
	quest_hub: [72, 12],
	landmark: [84, 12, 16, 16, -7, -8]
};