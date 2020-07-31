import {GenericJSON} from "./area";

export class LangLabel
{
	public langUid?: number;
	private languages: {[language: string]: string};
	
	constructor(data?: GenericJSON)
	{
		this.languages = {en_US: ""};
		this.langUid = data?.langUid;
		
		if(data)
			for(const lang in data)
				if(lang !== "langUid")
					this.languages[lang] = data[lang];
	}
	
	public get(language: string): string|null
	{
		const text = this.languages[language];
		
		if((text ?? null) === null)
			return null;
		else
			return text;
	}
	
	public set(language: string, value: string)
	{
		this.languages[language] = value;
	}
	
	public toJSON()
	{
		return Object.assign({}, this.languages, {langUid: this.langUid});
	}
}