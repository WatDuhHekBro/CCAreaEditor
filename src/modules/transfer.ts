import Area from "./area";

function inputViaDragAndDrop(event: DragEvent)
{
	event.preventDefault();
	
	if(!event.dataTransfer)
		return;
	
	for(const item of event.dataTransfer.items)
	{
		const file = item.getAsFile();
		
		if(!file)
			return;
		
		const reader = new FileReader();
		reader.readAsText(file, 'UTF-8');
		reader.onload = () => {
			try {Area.from(JSON.parse(reader.result as string))}
			catch {console.log(new Area())}
		};
	}
}

function inputViaFileUpload()
{
	/*
	// Check if file is undefined, ie if you exit the window instead of selecting a file.
	if(file)
	{
		filename = file.name;
		let reader = new FileReader();
		reader.readAsText(file, 'UTF-8');
		reader.onload = () => {
			try
			{
				data.setData(JSON.parse(event.target.result));
				data.setFloorView();
				setViewMode(mode);
				generateFloorButtons(FLOORS);
				setViewModeButtons(true);
			}
			catch(error) {console.error(error);}
		}
		reader.onerror = () => {console.error('Error with reading file.');}
	}
	*/
}

function inputViaTextField()
{
	
}

function outputViaDownload(contents: string, filename = "")
{
	const link = document.createElement('a');
	link.download = filename;
	link.href = window.URL.createObjectURL(new Blob([contents], {type: "text/plain"}));
	link.click();
	link.remove();
}

function outputViaTextField()
{
	/*
		this.input.select();
		this.input.setSelectionRange(0, 99999);
		document.execCommand("copy");
		this.input.blur();
	*/
	// this.input.focus();
}

export class FileUploader
{
	private element: HTMLTextAreaElement;
	
	constructor()
	{
		const field = document.createElement("textarea");
		field.oninput = event => console.log(event);
		field.cols = 100;
		field.rows = 10;
		field.placeholder = "Copy and paste a valid area JSON file here to load it into the editor.";
		this.element = field;
	}
	
	public bind()
	{
		document.body.appendChild(this.element);
	}
}

export class TextField
{
	private element: HTMLInputElement;
	
	constructor()
	{
		const field = document.createElement("input");
		field.type = "file";
		field.onchange = event => console.log(event);
		this.element = field;
	}
	
	public bind()
	{
		document.body.appendChild(this.element);
	}
}

export default function activate()
{
	document.body.ondrop = inputViaDragAndDrop;
	document.body.ondragover = event => event.preventDefault();
}