import {createMatrix, resizeMatrix} from "./matrix.js";

// Basically serves as an array of matrices, hence a cube. It does NOT use a Matrix object, but rather, is based off of it.
export default class Cube
{
	constructor(width, height, depth, fill = 0)
	{
		this.layers = createCube(width, height, depth, fill);
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.fill = fill;
	}
	setTile(x, y, z, value)
	{
		if(isNaN(x) || isNaN(y) || isNaN(z))
			throw `Error: Non-numeric value given for Cube.setTile! The coordinates given were [${x}, ${y}].`;
		if(x < 0 || x >= this.width)
			throw `Error: Index out of bounds! The width of this cube is ${this.width}, but the index given was ${x}.`;
		if(y < 0 || y >= this.height)
			throw `Error: Index out of bounds! The height of this cube is ${this.height}, but the index given was ${y}.`;
		if(z < 0 || z >= this.depth)
			throw `Error: Index out of bounds! The depth of this cube is ${this.depth}, but the index given was ${z}.`;
		this.layers[z][y][x] = value;
	}
	setSize(width, height, depth)
	{
		if(isNaN(width) || isNaN(height) || isNaN(depth))
			throw `Error: Non-numeric value given for Cube.setSize! The parameters given were ${width} by ${height} by ${depth}.`;
		if(width < 0 || height < 0 || depth < 0)
			throw `Error: Negative sizes aren't allowed for Matrix.setSize! The parameters given were ${width} by ${height} by ${depth}.`;
		
		resizeCube(this.layers, this.width, this.height, this.depth, width, height, depth, this.fill);
		
		if(this.width !== width)
			this.width = width;
		if(this.height !== height)
			this.height = height;
		if(this.depth !== depth)
			this.depth = depth;
	}
}

export function createCube(width, height, depth, fill = 0)
{
	const cube = new Array(depth);
	
	for(let i = 0; i < cube.length; i++)
		cube[i] = createMatrix(width, height, fill);
	
	return cube;
}

export function resizeCube(cube, oldWidth, oldHeight, oldDepth, newWidth, newHeight, newDepth, fill = 0)
{
	// Increase depth
	if(oldDepth < newDepth)
	{
		cube.length = newDepth;
		
		for(let i = oldDepth; i < newDepth; i++)
			cube[i] = createMatrix(newWidth, newHeight, fill);
	}
	// Decrease depth
	else if(oldDepth > newDepth)
		cube.splice(newDepth);
	
	// Resize matrix
	if(oldWidth !== newWidth || oldHeight !== newHeight)
		for(let grid of cube)
			resizeMatrix(grid, oldWidth, oldHeight, newWidth, newHeight, fill);
}