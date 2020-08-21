import {GenericTab, create} from "../../modules/common";
import lang from "../../modules/lang";
import {inputViaFileUpload, inputViaTextField, outputViaDownload, outputViaTextField} from "../transfer";

export const elements = {
	textfield: create("input", {
		attributes: {
			type: "text",
			placeholder: lang("inspector.transfer.textfield.placeholder")
		},
		events: {
			input: inputViaTextField
		}
	})
};

export default new GenericTab()
	.attachElement(create("div", {
		text: lang("inspector.transfer.note")
	}))
	.attachElement(create("div", {
		append: [elements.textfield, create("button", {
			text: lang("inspector.transfer.textfield.copy"),
			events: {
				click: outputViaTextField(elements.textfield)
			}
		})]
	}))
	.attachElement(create("div", {
		append: [create("input", {
			attributes: {
				type: "file"
			},
			events: {
				change: inputViaFileUpload
			}
		}), create("span", {
			text: lang("inspector.transfer.upload.note")
		})]
	}))
	.attachElement(create("div", {
		append: create("button", {
			text: lang("inspector.transfer.download"),
			events: {
				click: outputViaDownload
			}
		})
	}))
	.setDisplay();