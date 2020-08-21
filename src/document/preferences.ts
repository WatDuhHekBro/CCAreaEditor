import {create, parseVars} from "../modules/common";
import lang, {supportedLanguages, getLanguageNameByTag} from "../modules/lang";
import Settings from "../modules/config";

const languages = create("select", {
	events: {
		change() {
			setLanguage(this.value);
		}
	},
	append: create("option")
});

const status = create("div", {
	text: lang("preferences.language.note")
});

const input = create("input", {
	attributes: {
		type: "text",
		style: "width: 50px",
		placeholder: "en_US"
	}
});

for(const tag of supportedLanguages)
{
	languages.appendChild(create("option", {
		text: getLanguageNameByTag(tag),
		attributes: {
			value: tag
		}
	}));
}

languages.value = Settings.language;

export default create("div", {
	classes: ["ui", "sidebar"],
	append: [
		create("h1", {
			text: lang("preferences")
		}),
		create("h2", {
			text: lang("preferences.language")
		}),
		create("div", {
			append: [
				status,
				create("div", {
					append: [
						languages,
						input,
						create("button", {
							text: lang("preferences.language.submit"),
							events: {
								click() {
									setLanguage(input.value);
									languages.value = "";
									input.value = "";
								}
							}
						})
					]
				})
			]
		})
	],
	events: {
		wheel: event => event.stopPropagation(),
		keydown: event => event.stopPropagation()
	}
});

function setLanguage(code: string)
{
	const success = Settings.set("language", code);
	const message = parseVars(success ? lang("preferences.language.success") : lang("preferences.language.failure"), {
		language_name: getLanguageNameByTag(code),
		language_tag: code
	});
	status.innerText = message;
	setTimeout(() => status.innerText = lang("preferences.language.note"), 3000);
}