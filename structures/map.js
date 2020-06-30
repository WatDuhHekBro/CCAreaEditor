import LangLabel from "./langlabel.js";

const DUNGEON_OVERRIDE = ["", "DUNGEON", "NO_DUNGEON"];

export default class Map
{
	constructor()
	{
		this.path = "";
		this.name = new LangLabel();
		this.dungeon = "NO_DUNGEON"; // "DUNGEON"
		this.offset = {
			x: 0,
			y: 0
		};
		this.zMin = null; // 0
		this.zMax = null; // 0
	}
}