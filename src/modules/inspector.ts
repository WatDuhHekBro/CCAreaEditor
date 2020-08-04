import {HTMLWrapper} from "./common";
import {TextField, FileUploader, DownloadButton} from "./transfer";
import lang from "./lang";

class Inspector extends HTMLWrapper<HTMLDivElement>
{
	private isWindowed = false;
	private lastX = 0;
	private lastY = 0;
	private isActivelyMoving = false;
	private offsetX = 0;
	private offsetY = 0;
	
	constructor()
	{
		super(document.createElement("div"));
		this.element.classList.add("ui");
		this.element.classList.add("window");
		this.isWindowed = true;
		
		const title = document.createElement("h1");
		title.innerText = lang("inspector");
		this.element.appendChild(title);
		
		const tabs = document.createElement("div");
		this.element.appendChild(tabs);
		
		this.attach(new TransferTab());
		
		this.element.onmousedown = event => {
			if(event.button === 1)
			{
				event.preventDefault();
				event.stopImmediatePropagation();
				this.lastX = event.offsetX;
				this.lastY = event.offsetY;
				this.isActivelyMoving = true;
			}
		};
		this.element.onmousemove = event => {
			if(this.isActivelyMoving && this.isWindowed)
			{
				const x = event.offsetX;
				const y = event.offsetY;
				const deltaX = x - this.lastX;
				const deltaY = y - this.lastY;
				this.offsetX += deltaX;
				this.offsetY += deltaY;
				this.lastX = x - deltaX;
				this.lastY = y - deltaY;
				this.element.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
			}
		};
		this.element.onmouseup = event => {
			this.isActivelyMoving = false;
		};
		this.element.onmouseleave = event => {
			this.isActivelyMoving = false;
		};
	}
}

class GenericTab extends HTMLWrapper<HTMLDivElement>
{
	private enabled = true;
	
	constructor()
	{
		super(document.createElement("div"));
		this.toggle();
	}
	
	public toggle()
	{
		this.enabled = !this.enabled;
		this.element.style.display = this.enabled ? "block" : "none";
	}
}

class TransferTab extends GenericTab
{
	constructor()
	{
		super();
		this
		.attach(new TextField())
		.attach(new FileUploader())
		.attach(new DownloadButton())
		this.toggle();
	}
}

export default new Inspector();