interface Storage
{
	language: string;
	confirmClose: boolean;
}

class Settings
{
	// All properties will automatically save by using a custom setter.
	// This helps avoid forgetting to do Settings.save() while also avoiding dynamic indexing for type safety.
	private readonly storage: Storage;
	
	constructor()
	{
		// Initialize from local storage //
		let data;
		try {data = JSON.parse(window.localStorage.getItem("CCAE") ?? "{}")}
		catch(error) {data = {}}
		
		// Set properties and discard the rest //
		this.storage = {
			language: data.language ?? "en_US",
			confirmClose: data.confirmClose ?? true
		};
		
		// Overwrite malformed settings //
		this.save();
	}
	
	private save()
	{
		window.localStorage.setItem("CCAE", JSON.stringify(this.storage));
	}
	
	// Custom Accessors //
	get language() {return this.storage.language;}
	set language(value: string) {this.storage.language = value; this.save();}
	get confirmClose() {return this.storage.confirmClose;}
	set confirmClose(value: boolean) {this.storage.confirmClose = value; this.save();}
}

export default new Settings();