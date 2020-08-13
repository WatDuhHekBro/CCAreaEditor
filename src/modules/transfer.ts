import {Area, currentArea, setCurrentArea} from "./area";
import lang from "./lang";

let currentFileName = "area.json";

function parseAndSendToEditor(data: string)
{
	try {setCurrentArea(new Area(JSON.parse(data)))}
	catch {setCurrentArea(new Area())}
}

export function inputViaDragAndDrop(event: DragEvent)
{
	event.preventDefault();
	
	if(!event.dataTransfer)
		return;
	
	for(const item of event.dataTransfer.items)
	{
		const file = item.getAsFile();
		
		if(file && file.name.endsWith(".json"))
		{
			currentFileName = file.name;
			const reader = new FileReader();
			reader.readAsText(file, 'UTF-8');
			reader.onload = () => {parseAndSendToEditor(reader.result as string)};
		}
	}
}

export function inputViaFileUpload()
{
	const file = this.files?.[0];
	
	// Check if the file is undefined, which can happen if you exit the window instead of selecting a file.
	if(file?.name.endsWith(".json"))
	{
		const reader = new FileReader();
		currentFileName = file.name;
		reader.readAsText(file, "UTF-8");
		reader.onload = () => {parseAndSendToEditor(reader.result as string)};
	}
}

export function inputViaTextField()
{
	parseAndSendToEditor(this.value);
	this.blur();
	this.value = "";
	this.placeholder = lang("inspector.transfer.textfield.paste");
	setTimeout(() => this.placeholder = lang("inspector.transfer.textfield.placeholder"), 1500);
}

export function outputViaDownload()
{
	if(currentArea)
	{
		const link = document.createElement('a');
		link.download = currentFileName;
		link.href = window.URL.createObjectURL(new Blob([JSON.stringify(currentArea)], {type: "text/plain"}));
		link.click();
		link.remove();
	}
}

export function outputViaTextField(element: HTMLInputElement): () => void
{
	return function() {
		if(currentArea)
		{
			element.value = JSON.stringify(currentArea);
			element.select();
			element.setSelectionRange(0, 99999);
			document.execCommand("copy");
			element.blur();
			element.value = "";
			element.placeholder = lang("inspector.transfer.textfield.copy.status");
			setTimeout(() => element.placeholder = lang("inspector.transfer.textfield.placeholder"), 1500);
		}
	};
}