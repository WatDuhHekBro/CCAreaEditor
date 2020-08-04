# CCAreaEditor
A tool that allows you to graphically edit areas. Extended from my general 2D Matrix renderer. Currently WIP!

# Controls
- Left Click: Draw Tile / Move Connection/Icon/Landmark
- Shift + Left Click: Draw Box / Rotate Connection / Extend Connection
- Middle Click: Pan
- Shift + Middle Click: Cycle View Modes
- Right Click: Select/Inspect
- Shift + Right Click: Link Selected Connection/Icon/Landmark to Map
- Scroll Wheel: Zoom
- Shift + Scroll Wheel: Switch Floors

## Keyboard Keys
The most I'm willing to accommodate for is a laptop with only one button on its trackpad.
- Arrow Keys: Pan
- R: Reset View
- 1: Tile Editor
- 2: Connection Editor
- 3: View Final Result / Icon/Landmark Editor
- F: Select/Inspect
- -/+: Zoom
- Q/E: Switch Floors

# Specifications
- When instantiating elements like the renderer, instead of relying on a reference from the DOM and then passing down it to the code, go the other way around and create an element which will be attached to the DOM.
- The only time you render the canvas without modifying the data first is when prevewing a result. Otherwise, it should accurately reflect what the data looks like.
- Windows:
	- Inspector: Lets you edit the selected element.
	- Floor Settings: Modify the floor level and handler, also lets you add, move, or remove maps, connections, and icons/landmarks.
	- Area Settings: Modify the size of the area (and other settings), create a new area / load an existing one, upload and download.
	- Preferences: Modify persistent settings, such as the user's language (affecting LangLabels).
	- Help: Shows the list of controls and other things the user should be aware of.

# List of Files
The entry point to the program is `src/index` which pretty much calls everything else in `src/modules/`.
- `area`: The class to manage floors. Also holds the current area.
- `common`: Contains some common utility functions.
- `config`: Uses `window.localStorage` to hold persistent settings.
- `controller`: Lists in on the mouse clicks and keyboard keys that activate functions from the `gateway`.
- `floor`: The class which controls a floor's data and displaying it.
- `gateway`: Contains a list of functions that serves as the glue between the renderer, the area data, and the controller.
- `inspector`: Exports an instance of a class which lets you see and edit the area data.
- `lang`: Holds the `LangLabel` class and initializes `lexicon.json` into a dictionary of `LangLabel`s.
- `lexicon.json`: The localization file. It's unlikely that this'll be expanded upon, but it can't hurt to add the functionality, right?
- `matrix`: The class that handles grid data.
- `palette`: Randomly generates a palette which stores colors for each numerical value.
- `renderer`: Manages everything related to displaying area data.
- `transfer`: Handles downloading and uploading area data.

# Unused Properties
- `area.DOCTYPE` (string = `AREAS_MAP`)
- `area.name` (LangLabel)
- `area.chests` (number): It's quite deceiving, but this is actually an unused property. It's stored in `database.json/areas/<area>` along with the name, description, etc.
- `floor.name` (LangLabel)
- `map.offset` (Vector): I can't guarantee that it won't affect anything, but it seems to have no effect when setting it to extremely high values.
- `map.dungeon` (string = `DUNGEON`|`NO_DUNGEON`): Overrides the dungeon provided by the database area? For the database entry, I think it affects the icon, but other than that, I have no clue what this is supposed to do.
- `map.zMin` (number|null): This along with `zMax` does seem to do... something. I have no clue what it's supposed to do, but it doesn't seem to be anything useful.
- `map.zMax` (number|null): Same as above.
- `landmark.option` (string = `DEFAULT`): This can be found in `sc.LANDMARK_OPTIONS` which only has one option and isn't even used in the code besides declaring that.

# Possible Features
- Auto-saving
- History
- Custom Palette