class Settings
{
	[key: string]: any;
	public language: string;
	
	constructor()
	{
		// Initialize from local storage //
		let data;
		try {data = JSON.parse(window.localStorage.getItem("CCAE") ?? "{}")}
		catch(error) {data = {}}
		
		// Set properties and discard the rest //
		this.language = data.language ?? "en_US";
		
		// Overwrite malformed settings //
		this.save();
	}
	
	public set(key: string, value: any): boolean
	{
		if(key in this)
		{
			this[key] = value;
			this.save();
			return true;
		}
		else
			return false;
	}
	
	public save()
	{
		window.localStorage.setItem("CCAE", JSON.stringify(this));
	}
}

export default new Settings();