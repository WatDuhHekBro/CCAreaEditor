import Exportable from "./modules/exportable.js";
window.Exportable = Exportable;
class a extends Exportable
{
	constructor()
	{
		super();
		console.log('test');
	}
}
window.a = a;
window.b = new a();