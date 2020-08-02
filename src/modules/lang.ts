import {GenericJSON} from "./common";
import Settings from "./config";
import lexiconJSON from "./lexicon.json";

export class LangLabel
{
	public langUid?: number;
	public languages: {[language: string]: string};
	
	constructor(data?: GenericJSON)
	{
		this.languages = {en_US: ""};
		this.langUid = data?.langUid;
		
		if(data)
			for(const lang in data)
				if(lang !== "langUid")
					this.languages[lang] = data[lang];
	}
	
	public get(language = Settings.language): string
	{
		if(language in this.languages)
			return this.languages[language];
		else
			return this.languages.en_US ?? "";
	}
	
	public getClean(language = Settings.language): string
	{
		let text = this.get(language);
		
		if(/<<[AC]/g.test(text))
			text = text.substring(0, text.search(/<<[AC]/g));
		
		return text;
	}
	
	public toJSON()
	{
		return Object.assign({}, this.languages, {langUid: this.langUid});
	}
}

// Initialize the lexicon into an indexable format //
export const supportedLanguages = lexiconJSON.supportedLanguages;
delete lexiconJSON.supportedLanguages;

export const lexicon: {[key: string]: LangLabel} = {};
for(const key in lexiconJSON)
	lexicon[key] = new LangLabel((lexiconJSON as any)[key]);

// Initialize Document Title //
document.title = lexicon.title.get();