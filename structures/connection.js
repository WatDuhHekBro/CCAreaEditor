export default class Connection
{
	constructor()
	{
		this.tx = 0;
		this.ty = 0;
		this.dir = "HORIZONTAL";
		this.size = 1;
		this.map1 = 0;
		this.map2 = 0;
		this.condition = "";
		this.offset = {
			x: 0,
			y: 0
		};
	}
}