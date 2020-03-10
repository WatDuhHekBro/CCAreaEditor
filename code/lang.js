class LangManager
{
	constructor()
	{
		
	}
	
	// Automatically gets the user's language setting and reverts to English if the label doesn't exist.
	getText(label, cut = false)
	{
		let found;
		
		// Eventually make it so that if there's any language, it'll switch over to that. <selected lang> --> <en_US> --> <the first lang you find afterwards>
		if(label)
			found = label[settings.language] || label.en_US;
		
		if(found === undefined)
		{
			// A label is still valid even if found doesn't include it, yet.
			if(!label)
				console.warn("Label is not defined!");
			found = 'X';
		}
		else if(cut)
		{
			if(found.includes('<<A'))
				found = found.substring(0, found.indexOf('<<A'));
			else if(found.includes('<<C'))
				found = found.substring(0, found.indexOf('<<C'));
		}
		
		return found;
	}
}