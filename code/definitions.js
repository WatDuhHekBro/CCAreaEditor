const DEFINITIONS = {
	SETTINGS:
	{
		language: 'en_US',
		languages:
		{
			en_US: 'English',
			de_DE: 'German',
			zh_CN: 'Chinese',
			ja_JP: 'Japanese',
			ko_KR: 'Korean'
		}
	},
	// [x, y, size-x, size-y, offset-x, offset-y]
	TILEMAP:
	{
		void: [0,0,8,8],
		void_large: [0,0,16,16],
		enclosed: [40,0],
		open: [20,4],
		corner:
		{
			nw: [16,0],
			ne: [24,0],
			sw: [16,8],
			se: [24,8]
		},
		edge:
		{
			north: [20,0],
			east: [24,4],
			south: [20,8],
			west: [16,4]
		},
		tunnel:
		{
			horizontal: [[20,0,8,4],[20,12,8,4,0,4]],
			vertical: [[16,4,4,8],[28,4,4,8,4,0]]
		},
		// Cul-De-Sac opening in <direction>
		culdesac:
		{
			north: [[16,8,4,8],[28,8,4,8,4,0]],
			east: [[16,0,8,4],[16,12,8,4,0,4]],
			south: [[16,0,4,8],[28,0,4,8,4,0]],
			west: [[24,0,8,4],[24,12,8,4,0,4]]
		},
		// This section will be used in addition to the main set to fine-tune the look of the map.
		vertex:
		{
			nw: [32,0,4,4,0,0],
			ne: [36,0,4,4,4,0],
			sw: [32,4,4,4,0,4],
			se: [36,4,4,4,4,4]
		},
		connection:
		{
			vertical:
			{
				first: [40,8,8,2,0,6],
				second: [40,10,8,3,0,8],
				extend:
				{
					first: [17,3,8,2,4,6],
					second: [17,3,8,3,4,8]
				}
			},
			horizontal:
			{
				first: [32,8,3,8,5,0],
				second: [35,8,2,8,8,0],
				extend:
				{
					first: [17,3,3,8,5,4],
					second: [17,3,2,8,8,4]
				}
			}
		}
	},
	// [x, y, size-x, size-y, offset-x, offset-y]
	ICONMAP:
	{
		arrow_up: [0,0],
		arrow_down: [12,0],
		arrow_left: [24,0],
		arrow_right: [36,0],
		floor_down: [48,0],
		weapons: [60,0],
		//???: [72,0],
		entrance: [84,0],
		chest: [96,0],
		//lea?: [108,0],
		area_up: [0,12],
		area_down: [12,12],
		area_left: [24,12],
		area_right: [36,12],
		shop: [48,12],
		trader: [60,12],
		quest_hub: [72,12],
		landmark: [84,12,16,16,-7,-8]
	},
	// Most of these aren't used, but if localization ever happened, having everything here would make it easier.
	LEXICON:
	{
		title: {en_US: "CrossCode Area Editor"},
		loading: {en_US: "Please be patient."},
		cursor: {en_US: "Your cursor is: "},
		textbox: {en_US: "Copy and paste a valid area JSON file here to load it into the editor."},
		textbox_button: {en_US: "Get Changes"},
		download: {en_US: "Download Changes"},
		settings: {en_US: "Settings"},
		settings_desc: {en_US: "These are the settings that'll persist throughout every visit here. They will not be erased by leaving the page."},
		settings_generating: {en_US: "No settings detected! Generating default values."},
		floor:
		{
			upper:
			{
				en_US: 'F',
				de_DE: 'E',
				zh_CN: '层',
				ja_JP: '階',
				ko_KR: '층'
			},
			ground:
			{
				en_US: 'GF',
				de_DE: 'EG',
				zh_CN: '基层',
				ja_JP: '地階',
				ko_KR: 'GF' // I know right? This is just what I found in the localization files.
			},
			lower:
			{
				en_US: 'U',
				de_DE: 'U',
				zh_CN: 'U',
				ja_JP: '地下',
				ko_KR: 'U'
			}
		},
		untitled:
		{
			en_US: 'untitled',
			de_DE: 'unbetitelt',
			zh_CN: '未命名',
			ja_JP: '無題',
			ko_KR: '미정'
		}
	},
	LOGO:
	{
		tiles:
		[
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,1,1,1,0,0,1,0,0,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,0,0,1,1,1,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,1,1,1,0,1,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1,1,0,0,1,1,1,0,0,0,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,1,0,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1,1,1,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,1,1,0,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		]
	}
};

/////////////////////////////////////
// Post-Initialization Definitions //
/////////////////////////////////////

DEFINITIONS.LOGO.width = DEFINITIONS.LOGO.tiles[0].length;
DEFINITIONS.LOGO.height = DEFINITIONS.LOGO.tiles.length;

// [N,S,W,E] (false/0 = closed, true/1 = open), extended would be [N,S,W,E,NE,SE,SW,NW] (in the order of cardinal/intercardinal directions as per Wikipedia)
// Accounts for the multiple merging going on which can happen. If all sides are open but all corners are taken, apply vertices 4 times (per intercardinal direction).
/* [0,0,0,0] - DEFINITIONS.TILEMAP.enclosed
 * [1,1,1,1] - DEFINITIONS.TILEMAP.open
 * [0,1,0,1] - DEFINITIONS.TILEMAP.corner.nw
 * [0,1,1,0] - DEFINITIONS.TILEMAP.corner.ne
 * [1,0,0,1] - DEFINITIONS.TILEMAP.corner.sw
 * [1,0,1,0] - DEFINITIONS.TILEMAP.corner.se
 * [0,1,1,1] - DEFINITIONS.TILEMAP.edge.north
 * [1,0,1,1] - DEFINITIONS.TILEMAP.edge.south
 * [1,1,0,1] - DEFINITIONS.TILEMAP.edge.west
 * [1,1,1,0] - DEFINITIONS.TILEMAP.edge.east
 * [0,0,1,1] - DEFINITIONS.TILEMAP.tunnel.horizontal
 * [1,1,0,0] - DEFINITIONS.TILEMAP.tunnel.vertical
 * [1,0,0,0] - DEFINITIONS.TILEMAP.culdesac.north
 * [0,1,0,0] - DEFINITIONS.TILEMAP.culdesac.south
 * [0,0,1,0] - DEFINITIONS.TILEMAP.culdesac.west
 * [0,0,0,1] - DEFINITIONS.TILEMAP.culdesac.east
 * Vertices (* means that that direction isn't checked)
 * [1,*,1,*,*,*,*,0] - DEFINITIONS.TILEMAP.vertex.nw
 * [1,*,*,1,0,*,*,*] - DEFINITIONS.TILEMAP.vertex.ne
 * [*,1,1,*,*,*,0,*] - DEFINITIONS.TILEMAP.vertex.sw
 * [*,1,*,1,*,0,*,*] - DEFINITIONS.TILEMAP.vertex.se
 */
// The following entries are arranged in bitwise order (0 - 15 since there are 4 booleans).
DEFINITIONS.TILES = [
	DEFINITIONS.TILEMAP.enclosed,
	DEFINITIONS.TILEMAP.culdesac.east,
	DEFINITIONS.TILEMAP.culdesac.west,
	DEFINITIONS.TILEMAP.tunnel.horizontal,
	DEFINITIONS.TILEMAP.culdesac.south,
	DEFINITIONS.TILEMAP.corner.nw,
	DEFINITIONS.TILEMAP.corner.ne,
	DEFINITIONS.TILEMAP.edge.north,
	DEFINITIONS.TILEMAP.culdesac.north,
	DEFINITIONS.TILEMAP.corner.sw,
	DEFINITIONS.TILEMAP.corner.se,
	DEFINITIONS.TILEMAP.edge.south,
	DEFINITIONS.TILEMAP.tunnel.vertical,
	DEFINITIONS.TILEMAP.edge.west,
	DEFINITIONS.TILEMAP.edge.east,
	DEFINITIONS.TILEMAP.open
];