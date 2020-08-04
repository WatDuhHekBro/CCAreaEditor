import {Area, currentArea, setCurrentArea} from "./area";
import {HTMLWrapper} from "./common";
import lang from "./lang";

let currentFileName = "area.json";

function parseAndSendToEditor(data: string)
{
	try {setCurrentArea(new Area(JSON.parse(data)))}
	catch {setCurrentArea(new Area())}
}

function inputViaDragAndDrop(event: DragEvent)
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

function inputViaFileUpload()
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

function inputViaTextField()
{
	parseAndSendToEditor(this.value);
	this.value = lang("inspector.transfer.textfield.paste");
}

function outputViaDownload()
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

function outputViaTextField(element: HTMLTextAreaElement)
{
	if(currentArea)
	{
		element.value = JSON.stringify(currentArea);
		element.select();
		element.setSelectionRange(0, 99999);
		document.execCommand("copy");
		element.blur();
		element.value = lang("inspector.transfer.textfield.copy.status");
	}
}

export class FileUploader extends HTMLWrapper<HTMLInputElement>
{
	constructor()
	{
		super(document.createElement("input"));
		this.element.type = "file";
		this.element.onchange = inputViaFileUpload;
	}
}

export class TextField extends HTMLWrapper<HTMLInputElement>
{
	constructor()
	{
		super(document.createElement("input"));
		this.element.oninput = inputViaTextField;
		//this.element.placeholder = lang("inspector.transfer.textfield.placeholder");
	}
}

export class DownloadButton extends HTMLWrapper<HTMLButtonElement>
{
	constructor()
	{
		super(document.createElement("button"));
		this.element.onclick = outputViaDownload;
		this.element.innerText = lang("inspector.transfer.download");
	}
}

export function activateDragAndDrop()
{
	document.body.ondrop = inputViaDragAndDrop;
	document.body.ondragover = event => event.preventDefault();
}