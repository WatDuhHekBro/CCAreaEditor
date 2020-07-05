const palette = ["000000"];
const invert = {
	"0": "f",
	"1": "e",
	"2": "d",
	"3": "c",
	"4": "b",
	"5": "a",
	"6": "9",
	"7": "8",
	"8": "7",
	"9": "6",
	"a": "5",
	"b": "4",
	"c": "3",
	"d": "2",
	"e": "1",
	"f": "0"
};

export default {
	getColor(value, invert = false)
	{
		if(isNaN(value))
			throw "Error: Palette must be called with a numerical value!";
		if(!palette[value])
			palette[value] = getRandom(0, 16777216).toString(16).padStart(6, "000000");
		return "#" + (invert ? invertColor(palette[value]) : palette[value]);
	},
	generateNewPalette()
	{
		palette.splice(1, palette.length);
	}
};

// To get the inverse of a hex color, get the difference of each digit. For example, if you have F (15), you'd get 0.
function invertColor(hex)
{
	if(hex.length !== 6)
		throw "Hex numbers need to have a length of exactly 6.";
	
	hex = hex.toLowerCase();
	let result = "";
	
	for(let c of hex)
	{
		result += invert[c];
		
		if(!invert[c])
			throw "Digit " + c + " is not valid.";
	}
	
	return result;
}

// Get random integer between min (inclusive) and max (exclusive).
function getRandom(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}