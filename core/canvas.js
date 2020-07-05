import Palette from "../modules/palette.js";
import {TILEMAP, LOGO} from "./definitions.js";

if(!document.getElementById("canvas"))
	throw "Error: No canvas element specified!";

export const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const tiles = new Image();
tiles.src = "tiles.png";
const icons = new Image();
icons.src = "icons.png";

// This is the object which manages the DISPLAY of the canvas. Everything graphically-related goes here.
export default {
	//tilemap: TILEMAP,
	setTile(x, y, value)
	{
		context.fillStyle = Palette.getColor(value);
		context.fillRect(x * 8, y * 8, 8, 8);
	},
	drawTile(x, y, info = [])
	{
		context.drawImage(
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
	},
	// x and y are absolute coordinates here, because icons aren't tied to the grid.
	drawIcon(x, y, info = [])
	{
		context.drawImage(
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
	},
	setSize(x, y)
	{
		canvas.width = x * 8;
		canvas.height = y * 8;
	}
};

// Generate Title Screen //
/*canvas.width = LOGO[0].length * 8;
canvas.height = LOGO.length * 8;

for(let i = 0; i < LOGO.length; i++)
{
	for(let j = 0; j < LOGO[0].length; j++)
	{
		context.fillStyle = LOGO[i][j] === 0 ? "#000000" : "#ffffff";
		context.fillRect(j * 8, i * 8, 8, 8);
	}
}*/