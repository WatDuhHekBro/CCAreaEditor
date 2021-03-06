# CCAreaEditor
A CrossCode modding tool that allows you to graphically edit areas.

# Controls
[T] = Tile, [C] = Connection, [I] = Icon, [L] = Landmark
- Left Click: Draw [T] / Rotate [C] / Move [CIL] / Set Location [CIL]
- Shift + Left Click: Draw Box / Extend [C]
- Middle Click: Pan
- Right Click: Select/Inspect
- Shift + Right Click: Link Selected [CIL] to Map (Alternates for [C] for both maps)
- Scroll Wheel: Zoom
- Shift + Scroll Wheel: Switch Floors

## Keyboard Keys
The most I'm willing to accommodate for is a laptop with only one button on its trackpad.
- Arrow Keys: Pan
- R: Reset View
- 1: Tile Editor
- 2: Connection Editor
- 3: View Final Result / [IL] Editor
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
- `display/renderer`: Manages everything related to displaying area data.
- `display/palette`: Randomly generates a palette which stores colors for each numerical value.
- `structures/area`: The class to manage floors. Also holds the current area.
- `structures/floor`: The class which controls a floor's data and displaying it.
- `structures/matrix`: The class that handles grid data.
- `modules/common`: Contains some common utility functions.
- `modules/config`: Uses `window.localStorage` to hold persistent settings.
- `modules/lang`: Holds the `LangLabel` class and initializes `lexicon.json` into a dictionary of `LangLabel`s.
- `modules/lexicon.json`: The localization file. It's unlikely that this'll be expanded upon, but it can't hurt to add the functionality, right?
- `document/gateway`: Contains a list of functions that serves as the glue between the renderer, the area data, and the controller.
- `document/inspector`: Exports a sidebar which lets you see and edit the area data. Split up into different tabs.
	- `document/inspector/transfer`: Transfers data into and out of the editor.
	- `document/inspector/area`: Edits the area settings and its floors.
	- `document/inspector/floor`: Edits the selected floor's settings and its maps/connections/icons/landmarks.
	- `document/inspector/selection`: Edits an individual map/connection/icon/landmark and is the most specific editing tab.
- `document/controller`: Lists in on the mouse clicks and keyboard keys that activate functions from the `gateway`.
- `document/preferences`: Exports a sidebar which lets the user edit persistent settings.
- `document/transfer`: Provides functions that handle downloading and uploading area data.

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

# Future Stuff
- Optimize rendering to no longer be horribly inefficient, especially with moving operations
- Hover effect for tile editor
- Floor Buttons
- Auto-saving
- History
- Custom Palette