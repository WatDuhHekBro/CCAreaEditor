// [x, y, size-x, size-y, offset-x, offset-y]
const ICONS = {
	arrow_up: [0,0],
	arrow_down: [12,0],
	arrow_left: [24,0],
	arrow_right: [36,0],
	floor_down: [48,0],
	weapons: [60,0],
	//???: [72,0],
	entrance: [84,0],
	chest: [96,0],
	//lea?: [108,0],
	area_up: [0,12],
	area_down: [12,12],
	area_left: [24,12],
	area_right: [36,12],
	shop: [48,12],
	trader: [60,12],
	quest_hub: [72,12],
	landmark: [84,12,16,16,-7,-8]
};

// Icons and landmarks share the same structure for the most part.
export default class Icon
{
	constructor()
	{
		this.icon = "";
		this.x = 0;
		this.y = 0;
		this.map = 0;
		// area connection
		this.data = {
			area: "",
			map: ""
		};
	}
	toString()
	{
		
	}
}