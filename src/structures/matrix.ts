export default class Matrix
{
	private width: number;
	private height: number;
	private data: Uint8Array;
	
	constructor(width: number, height: number)
	{
		this.width = width;
		this.height = height;
		this.data = new Uint8Array(width * height);
	}
	
	public static from(grid: number[][]): Matrix
	{
		const height = grid.length;
		const width = grid[0].length;
		const matrix = new Matrix(width, height);
		
		for(let i = 0; i < height; i++)
		{
			if(grid[i].length !== width)
				console.warn("This matrix does not have the same width throughout!", grid);
			for(let j = 0; j < width; j++)
				matrix.set(j, i, grid[i][j] ?? 0);
		}
		
		return matrix;
	}
	
	public get(x: number, y: number)
	{
		if(x >= 0 && x < this.width && y >= 0 && y < this.height)
			return this.data[this.width * y + x];
		else
			return undefined;
	}
	
	public set(x: number, y: number, value: number, suppressErrors = false)
	{
		if(x >= 0 && x < this.width && y >= 0 && y < this.height)
			this.data[this.width * y + x] = value;
		else if(!suppressErrors)
			throw new RangeError(`Index out of bounds! Called (${x}, ${y}) of width ${this.width} x height ${this.height}.`);
	}
	
	/** Resize and shift the current grid. It should be the only method that allocates memory for a new array. */
	public resize(width: number, height: number, offsetX = 0, offsetY = 0)
	{
		const grid = new Uint8Array(width * height);
		
		for(let i = 0; i < this.data.length; i++)
		{
			const x = i % this.width + offsetX;
			const y = Math.floor(i / this.width) + offsetY;
			
			if(x >= 0 && x < width && y >= 0 && y < height)
				grid[width * y + x] = this.data[i];
		}
		
		this.data = grid;
		this.width = width;
		this.height = height;
	}
	
	/** Iterate over the entire grid. Return a number to set a value at that location. */
	public iterate(callback: (x: number, y: number, value: number) => number|void)
	{
		for(let i = 0; i < this.data.length; i++)
		{
			const value = callback(i % this.width, Math.floor(i / this.width), this.data[i]);
			
			if(typeof value === "number")
				this.data[i] = value;
		}
	}
	
	public getWidth()
	{
		return this.width;
	}
	
	public getHeight()
	{
		return this.height;
	}
	
	public toJSON()
	{
		const grid: number[][] = new Array(this.height);
		
		for(let i = 0; i < this.height; i++)
			grid[i] = Array.from(this.data.slice(this.width * i, this.width * (i+1)));
		
		return grid;
	}
}