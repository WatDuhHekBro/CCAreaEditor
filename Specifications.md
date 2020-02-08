# The Goal
Up until now, I've mostly added functions without regard to how the code is organized. Unfortunately, functions don't exactly do what they appear to be. So my goal is to outline the structure of the code and when everything is called, for myself and anyone who wants to do stuff with the code. And along the way, this might also explain the structure of area files.

# The Usable Object: CCAE
There will be exactly one global object available which'll be made in order to declutter the global namespace.
- Inside, it first uses strict mode then initializes all the constants and variables in that order.
- Then, it'll run through the initialization code.
- After initialization, it'll return an object which is split into three sections:
	- `update`: ???
	- `system`: These are functions which are only meant to be called by document itself, often including itself into functions by sending `this` as a parameter. While users can call these functions, it's not recommended because things could break without a reference to an element or the function could be a part of a larger chain of functions that isn't called.
	- `debug`: This is meant to be the all-in-one function displaying all variables at once (so you don't have to log multiple variables). Also, whenever there's an error, this function will be called and be shown in the console.
- Below the fields and initialization which have to be placed before the return statement are the functions which make up the bulk of the code.

# The Layout of the Page
Before moving onto the functions, the design of the layout must first be established. This layout will be built on the idea of different editing modes.
- At the very top of the document is a simple line of text that will be removed when the script loads. Before your browser caches this site, it'll probably take a few seconds.
- Above the canvas are the top-level data points: name (isn't used in-game), width, height, the amount of chests, and the default floor (which only determines the level that players will see when they first zoom over to your area). This all appears on a single line.
- The second line right before the canvas is the floor-specific info, such as the level/elevation and the name (which probably doesn't matter). Optionally, there might be a specific handler which overrides what the default floor name would be.
- The canvas, which is where all the magic happens, will be placed in the top-center of the page.
	- The upper left corner will have the buttons to switch between the two viewing modes, marked `T` for "Tiles" and `R` for "Result".
	- The upper right corner will have the buttons which determine the floor you're viewing. These floor names are based on what you'd see in-game. *Note that it'll switch over and retain the viewing mode you're currently on but it'll reset the selected map in the first view or any editor you're on in the second view.*
- These set of buttons will be auxiliary buttons which do various things.
	- In the first view, there's one button, `Generate New Palette` which'll, as the name suggests, generate a new palette for each map.
	- In the second view, they'll allow you to switch between viewing mode, connections mode, and icons/landmarks mode.
- Below the canvas will be the buttons to...
	- Select the map in the first view.
	- Select the connection or icon/landmark in the second view.
- Below the buttons will be the cursor which displays what you've selected and the information bound to whatever you selected.
- This is the section of the page where the inputs and outputs are.
	- The first section will be a `textarea` where you can copy and paste an area JSON file as well as get the output which you can then copy paste back.
	- The second section will be a file upload and download section where you can upload an area JSON file as well as download the result.
	- The loading screen will have most of the buttons removed. So the third option is to create a new map, which'll disappear once you create or load a map.
- In the top-left corner of the page (would've been top-right but I'm too lazy to learn CSS), there'll be a settings icon which'll bring up an overlay where you can edit settings that'll persist even if you exit the page. More info on that in the section `About Local Storage`.

# The Two Views (also sorta turned into a manual)
1. The first view is where you edit the shape of the area. Each tile is a solid color based on the room number given, which is how the different rooms are made. This is where you'll be doing the bulk of the area editing, and where you probably have the most tools to use at once.
	- Left clicking changes the selected tile to whatever cursor is selected.
	- Right clicking allows you to mark two points which then fills in a rectangle with the selected cursor.
	- Middle clicking would've allowed you to move your view across the map if I had limited the canvas to a certain size. However, this isn't used as the canvas generates the full size.
	- The buttons below the canvas are marked with the same color as the indicated room number (with button zero being the "eraser").
		- Left clicking a button sets your cursor to draw whatever map you select, as well as displaying below the currently selected cursor the name of the map, which you can edit in any language you choose.
		- Right clicking a button, as long as you're holding right click, allows you to isolate the view of a map, useful for locating a map by its ID in a large map or if it has a similar color to another map. This is black and white to help you locate a map regardless of what its original color is.
2. The second view is where you see the resulting area, basically how it would look in-game. This view is more focused on the fine-tuning aspects, since you've already determined how the shape is from the first view, now you add the details such as connections, icons, and landmarks.
	- Clicking on the canvas, at least without ..., does nothing because it is set to act as default. So now you can actually right click on the canvas and save an image of it if you want to.
	- When you switch to the connections editor, you'll only see the boxes (no icons/landmarks) as well as solid tiles where the connections are.
		- Red tiles are the exact point where a connection is defined.
		- Green tiles are the implied length of a connection based on whether it's horizontal or vertical.
		- Blue tiles are based on how big a connection is. This is how connections can span multiple tiles rather than just one.
		- In the buttons section, you'll see buttons half-filled with each room it occupies and goes in the order that the connections are, meaning the order is essentially arbitrary.
		- In this mode, once you've selected a specific connection, you can left click to specify the red tile or the coordinates, and then from there, you edit the other numbers and the canvas will provide feedback.
		- When you select a connection, the two maps it occupies will be isolated. The two maps have no impact on the visuals, but you'll have to visit both maps for the connection to show up.
	- When you switch to the icons/landmarks editor, you'll see the boxes with every connection, but only one icon/landmark will show up at a time.
		- Again, the buttons section will display a list of icons and landmarks to select. Both icons and landmarks are given in the order that appears in the JSON file (or the order they were added in), meaning that it's pretty much arbitrary.
			- White buttons are icons.
			- Light blue buttons are landmarks.
		- In this mode, left clicking sets the icon/landmark to wherever the mouse cursor is. Keep in mind that icons/landmarks are based on **absolute** position rather than **tile** position, so you'll probably want to fine-tune the location by changing the numbers specifically. Left clicking is just to help you place an icon/landmark in the general area you want it to be in.

# About Local Storage
Everything about persisting settings is based on `window.localStorage`, which means that if you access the area editor from another domain, these settings will not remain the same. The settings are stored in a single key, `CCAE`, which has a stringified object which contain all the settings. When the page loads, one of the first things it does is load these persisting settings and generates missing keys if needed.
- `language`: The ISO language code (i.e. `en_US`) used to determine which language generated LangLabels automatically select, the format of floor names, and (maybe) the language all the text in the page would use. The last one is rather unlikely, but it wouldn't hurt to add support for it.
- `languages`: The set of ISO language code and language name pairs (i.e. `en_US` and `English`) which is used to determine which language options to generate a LangLabel with. While existing language tags will still show up, you must edit this setting to determine how new LangLabels will generate. For example, an existing `fr_FR` tag will still show up, but if you want to add French yourself, you'll have to edit this setting. This is the alternative to manually editing each tag in the JSON file.
- `palette`: Here is the custom palette you can set that'll predetermine the colors instead of having it be random. You can save the current palette or add/modify the settings' palette using hex color codes.
- `autosaved`: While the editor itself should have undo and redo buttons using `history`, autosaved will only track the latest change. Though constantly using `JSON.stringify` isn't good on performance. So while the other settings will automatically `JSON.stringify` since those are small values changed only when the user chooses, this constantly updates. So it'll be a browser leave event that triggers `JSON.stringify` on this.

Of course, you can purge your history/autosaved which'll allow you to create a new map.

# About Session Storage
From what it looks like, `window.sessionStorage` will persist as long as the specific browser tab you're on isn't closed. That means if you accidentally reload the page or click on a different link, you can go back and the data will still be there. However, since it isn't as useful as `window.localStorage`, it'll be used to store one thing mainly:
- `history`: This is an array of area JSON based on each change. It's quite perfect for session storage, since, as you'd imagine, this data would quickly get very large, so it isn't ideal for long-term storage. However, it's useful for when ya dun goofed. Again, you only use `JSON.stringify` when you leave the page.

# Functions (Coming Soon™)
`setTile`: ___. Also changes data depending on the selected cursor.
... The cursor variable will contain the selected map number, not the color. The color reflects the change you made to the data, not the other way around.
... Maybe show a grid option?
... Areas, internal pixel size is 8 for icons.
... Also explain your fields (constants and variables).