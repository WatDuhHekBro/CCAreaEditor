class Config
{
	constructor()
	{
		for(let key in DEFINITIONS.SETTINGS)
			this[key] = DEFINITIONS.SETTINGS[key];
		
		this.loadSettings(window.localStorage.getItem('CCAE'));
	}
	
	// This makes it easy to import settings
	// Load a stringified JSON object containing settings.
	// Add settings that aren't present and also remove deprecated settings.
	// Do this by only copying keys that also exist in settings.
	loadSettings(options)
	{
		try
		{
			if(!options)
				throw "No settings detected! Generating default values.";
			
			options = JSON.parse(options);
			
			// This modifies settings based on what's in the local storage.
			// Any unused keys are essentially discarded.
			// Any missing keys are left to whatever the default is.
			// This also prevents soft comparison. So if a setting is 0, it'll copy over.
			for(let key in this)
				if(Object.keys(options).includes(key))
					this[key] = options[key];
		}
		catch(error) {console.log(error);}
		
		// Then, the new settings, or default settings, are stored into the local storage.
		window.localStorage.setItem('CCAE', JSON.stringify(this));
	}
	
	storeOption(option, value)
	{
		if(Object.keys(this).includes(option))
		{
			this[option] = value;
			window.localStorage.setItem('CCAE', JSON.stringify(this));
			return true;
		}
		
		return false;
	}
}