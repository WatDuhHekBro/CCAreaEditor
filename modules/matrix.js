// This is a class that'll wrap around a matrix and setup utility functions for it.
// Of course, if you just want to create a matrix without this handler, use the functions below.
export default class Matrix
{
	constructor(width, height, fill = 0)
	{
		this.grid = createMatrix(width, height, fill);
		this.width = width;
		this.height = height;
		this.fill = fill;
	}
	// Set tile with error checking.
	setTile(x, y, value)
	{
		if(isNaN(x) || isNaN(y))
			throw `Error: Non-numeric value given for Matrix.setTile! The coordinates given were [${x}, ${y}].`;
		if(x < 0 || x >= this.width)
			throw `Error: Index out of bounds! The width of this matrix is ${this.width}, but the index given was ${x}.`;
		if(y < 0 || y >= this.height)
			throw `Error: Index out of bounds! The height of this matrix is ${this.height}, but the index given was ${y}.`;
		this.grid[y][x] = value;
	}
	// Resize the matrix and fill it with whatever you initialized it with.
	setSize(width, height)
	{
		if(isNaN(width) || isNaN(height))
			throw `Error: Non-numeric value given for Matrix.setSize! The parameters given were ${width} by ${height}.`;
		if(width < 0 || height < 0)
			throw `Error: Negative sizes aren't allowed for Matrix.setSize! The parameters given were ${width} by ${height}.`;
		
		resizeMatrix(this.grid, this.width, this.height, width, height, this.fill);
		
		if(this.width !== width)
			this.width = width;
		if(this.height !== height)
			this.height = height;
	}
}

export function createMatrix(width, height, fill = 0)
{
	const matrix = new Array(height);
	
	for(let i = 0; i < matrix.length; i++)
		matrix[i] = createArray(width, fill);
	
	return matrix;
}

// The order is height then width because if the height is decreasing, it's faster due to cutting away entire rows rather than changing rows that'll be deleted anyway.
export function resizeMatrix(matrix, oldWidth, oldHeight, newWidth, newHeight, fill = 0)
{
	// Increase height
	if(oldHeight < newHeight)
	{
		matrix.length = newHeight;
		
		for(let i = oldHeight; i < newHeight; i++)
			matrix[i] = createArray(newWidth, fill);
	}
	// Decrease height
	else if(oldHeight > newHeight)
		matrix.splice(newHeight);
	
	// Increase or decrease width
	if(oldWidth !== newWidth)
		for(let row of matrix)
			resizeArray(row, newWidth, fill);
}

export function createArray(length, fill = 0)
{
	const array = new Array(length);
	
	for(let i = 0; i < array.length; i++)
		array[i] = fill;
	
	return array;
}

export function resizeArray(array, newLength, fill = 0)
{
	// Increase length
	if(array.length < newLength)
	{
		const oldLength = array.length;
		array.length = newLength;
		
		for(let i = oldLength; i < newLength; i++)
			array[i] = fill;
	}
	// Decrease length
	else if(array.length > newLength)
		array.splice(newLength);
}