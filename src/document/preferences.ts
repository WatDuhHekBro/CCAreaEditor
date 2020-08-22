import {create, parseVars} from "../modules/common";
import lang, {supportedLanguages, getLanguageNameByTag} from "../modules/lang";
import Settings from "../modules/config";

const languages = create("select", {
	events: {
		change() {
			setLanguage(this.value);
		}
	}
});

const status = create("div", {
	text: lang("preferences.language.note")
});

const input = create("input", {
	attributes: {
		type: "text",
		style: "width: 50px",
		placeholder: Settings.language
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

const closeConfirmCheckbox = create("input", {
	attributes: {
		type: "checkbox"
	},
	events: {
		change() {
			Settings.confirmClose = this.checked;
		}
	}
});

closeConfirmCheckbox.checked = Settings.confirmClose;

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
		}),
		create("h2", {
			text: lang("preferences.confirmClose")
		}),
		create("div", {
			append: [
				create("div", {
					text: lang("preferences.confirmClose.note")
				}),
				create("div", {
					append: [
						create("span", {
							text: lang("preferences.confirmClose.option") + ' '
						}),
						closeConfirmCheckbox
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
	Settings.language = code;
	input.placeholder = code;
	status.innerText = parseVars(lang("preferences.language.success"), {
		language_name: getLanguageNameByTag(code),
		language_tag: code
	});
	setTimeout(() => status.innerText = lang("preferences.language.note"), 3000);
}