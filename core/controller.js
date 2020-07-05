import {canvas} from "./canvas.js";

const disable = () => {event.preventDefault()};
let x = 0;
let y = 0;

// This is the object which manages the CONTROLS of the canvas. Everything related to the controls like keyboard and mouse events goes here.
// As it's overlayed on top of the canvas' code, import this instead.
export default {
	
};

// Explaining the events...
// 
// -= In any mode =-
// - Scrolling will switch floors.
// - 
// - 
// - 
// 
// -= Tile Editing Mode =-
// - While you hold left click, it'll automatically set tiles wherever your mouse is.
// - Right clicking sets a box. This will be interrupted and reset by left clicking at any time.
//   - If you just tap right click, it'll draw a projection of what the box will be like, and then you can tap right click again to set the box.
//   - If you hold right click, it'll draw a projection again and will set when you release right click.
// 
// -= Connections Mode =-
// - While you hold left click, it'll automatically set and display where the connection will be.
// - Right clicking a connection will bring up an editable menu of it. (Position: Absolute, moves to wherever it was selected.)
//   - I went with this because while a list of maps works fine for the tile editor, you can't as easily pinpoint which connection goes where. Of course, you'll have an option to reorder connections if you really want, but that'll be in a separate menu.
//   - While in the menu, you can click the map you want and it'll automatically fetch the ID from that.
// 
// -=  =-
// - 
// - 
// - 
// - 
// 
// -=  =-
// - 
// - 
// - 
// - 