class Palette
{
	private readonly palette = [0];
	
	public getColor(index: number, invert = false): string
	{
		if(index < 0)
			throw new RangeError(`Index out of bounds at getColor(${index})!`);
		if(!(index in this.palette))
			this.palette[index] = Math.floor(Math.random() * (0xFFFFFF + 1));
		const color = this.palette[index];
		return '#' + (invert ? getInverse(color) : color).toString(16).padStart(6, '0');
	}
	
	public generateNewPalette()
	{
		this.palette.splice(1);
	}
}

// To get a color's inverse, invert all the bits.
// However, because JS, you need to specify a bit range.
function getInverse(color: number): number
{
	if(color > 0xFFFFFF || color < 0)
		throw new RangeError(`Color "${color}" provided to getInverse is not a valid RGB value!`);
	return ~color & 0xFFFFFF;
}

export default new Palette();