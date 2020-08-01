import {Area, currentArea, setCurrentArea} from "./area";

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
	if(file && file.name.endsWith(".json"))
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
	this.value = "Transferred into editor!";
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
		element.value = "Copied to clipboard!";
	}
}

export class FileUploader
{
	private element: HTMLInputElement;
	
	constructor()
	{
		const field = document.createElement("input");
		field.type = "file";
		field.onchange = inputViaFileUpload;
		this.element = field;
	}
	
	public attach()
	{
		document.body.appendChild(this.element);
	}
}

export class TextField
{
	private element: HTMLTextAreaElement;
	
	constructor()
	{
		const field = document.createElement("textarea");
		field.oninput = inputViaTextField;
		field.cols = 100;
		field.rows = 10;
		field.placeholder = "Copy and paste a valid area JSON file here to load it into the editor.";
		this.element = field;
	}
	
	public attach()
	{
		document.body.appendChild(this.element);
	}
}

export function activateDragAndDrop()
{
	document.body.ondrop = inputViaDragAndDrop;
	document.body.ondragover = event => event.preventDefault();
}