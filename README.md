# CCAreaEditor
A tool that allows you to graphically edit areas. Extended from my general 2D Matrix renderer. Currently WIP!

# Controls
- Left Click: Draw Tile / Move Connection/Icon/Landmark
- Shift + Left Click: Draw Box / Rotate Connection / Extend Connection
- Middle Click: Pan
- Shift + Middle Click: Cycle View Modes
- Right Click: Select/Inspect
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
- `lang`: Holds the `LangLabel` class and initializes `lexicon.json` into a dictionary of `LangLabel`s.
- `lexicon.json`: The localization file. It's unlikely that this'll be expanded upon, but it can't hurt to add the functionality, right?
- `matrix`: The class that handles grid data.
- `palette`: Randomly generates a palette which stores colors for each numerical value.
- `renderer`: Manages everything related to displaying area data.
- `transfer`: Handles downloading and uploading area data.

# Possible Features
- Auto-saving
- History
- Custom Palette