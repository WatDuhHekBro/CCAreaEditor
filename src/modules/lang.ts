import {GenericJSON, HTMLWrapper, create} from "./common";
import Settings from "./config";
import lexiconJSON from "./lexicon.json";

export class LangLabel
{
	public languages: {[language: string]: string};
	
	constructor(data?: GenericJSON)
	{
		this.languages = {en_US: ""};
		
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
		return this.languages;
	}
}

// This is the document element that'll let you send and receive LangLabel data. It will remain on the document, and to change the focus, you swap out the langlabel property.
export class HTMLLangLabel extends HTMLWrapper<HTMLDivElement>
{
	private input: HTMLInputElement;
	private menu: HTMLSelectElement;
	private langlabel: LangLabel;
	private tag: string;
	
	constructor(langlabel: LangLabel, placeholder: string)
	{
		super(document.createElement("div"));
		const self = this;
		this.input = create("input", {
			attributes: {
				type: "text",
				placeholder: placeholder
			},
			events: {
				input() {
					self.langlabel.languages[self.tag] = this.value;
					console.log(self);
				}
			}
		});
		this.menu = create("select", {
			events: {
				change() {
					self.tag = this.value;
					self.input.value = self.langlabel.get(self.tag);
				}
			}
		});
		this.langlabel = langlabel;
		this.tag = Settings.language;
		this.element.appendChild(this.input);
		this.element.appendChild(this.menu);
		this.createMenu();
	}
	
	public setLangLabel(langlabel: LangLabel)
	{
		this.langlabel = langlabel;
		
		while(this.menu.firstChild)
			this.menu.removeChild(this.menu.firstChild);
		
		this.input.value = "";
		this.createMenu();
	}
	
	private createMenu()
	{
		let found = false;
		
		// A generated LangLabel will show the existing language tags plus the user's current language.
		for(const tag in this.langlabel.languages)
		{
			const element = create("option", {
				text: getLanguageNameByTag(tag),
				attributes: {
					value: tag
				}
			});
			
			if(tag === Settings.language)
			{
				this.input.value = this.langlabel.get(tag);
				element.selected = true;
				found = true;
			}
			
			this.menu.appendChild(element);
		}
		
		if(!found)
		{
			const tag = Settings.language;
			const element = create("option", {
				text: getLanguageNameByTag(tag),
				attributes: {
					value: tag
				}
			});
			element.selected = true;
			this.menu.appendChild(element);
		}
	}
	
	public getElement()
	{
		return this.element;
	}
}

export function getLanguageNameByTag(tag: string): string
{
	return tag in lexiconJSON.languages ? lexicon.languages.get(tag) : tag;
}

// Initialize the lexicon into an indexable format //
export const supportedLanguages = lexiconJSON.supportedLanguages;
delete lexiconJSON.supportedLanguages;

const lexicon: {[key: string]: LangLabel} = {};
for(const key in lexiconJSON)
	lexicon[key] = new LangLabel((lexiconJSON as any)[key]);

export default function lang(tag: string, language?: string): string
{
	const label = lexicon[tag];
	
	if(label)
		return label.get(language);
	else
		return "N/A";
}

// Initialize Document Title //
document.title = lang("title");