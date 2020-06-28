// Icons and landmarks share the same structure for the most part.
export default class Icon
{
	constructor()
	{
		this.icon = ""; // icon only
		this.id = ""; // landmark only
		this.x = 0;
		this.y = 0;
		this.map = 0;
		this.option = "DEFAULT"; // landmark only
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