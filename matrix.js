const GLOBAL = {
	width: 10,
	height: 10,
	pixel_size: 16
};
const PALETTE = [
	'000000'
];
var saved = [[]];

function setTile(x, y, color = '000000', value = 0)
{
	PENCIL.fillStyle = '#' + color;
	PENCIL.fillRect(x * GLOBAL.pixel_size, y * GLOBAL.pixel_size, GLOBAL.pixel_size, GLOBAL.pixel_size);
	PENCIL.fillStyle = '#' + invertHex(color);
	PENCIL.fillText(value.toString(), (x * GLOBAL.pixel_size) + (GLOBAL.pixel_size / 2) - (GLOBAL.pixel_size / 4), (y * GLOBAL.pixel_size) + (GLOBAL.pixel_size / 2) + (GLOBAL.pixel_size / 4));
}

function setSize(x, y, pixels)
{
	GLOBAL.width = x || GLOBAL.width;
	GLOBAL.height = y || GLOBAL.height;
	GLOBAL.pixel_size = pixels || GLOBAL.pixel_size;
	
	CANVAS.width = GLOBAL.width * GLOBAL.pixel_size;
	CANVAS.height = GLOBAL.height * GLOBAL.pixel_size;
}

function getColor(value)
{
	if(!PALETTE[value])
		PALETTE[value] = getRandom(0,16777216).toString(16).padStart(6,'000000');
	
	return PALETTE[value];
}

function getRandom(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTiles()
{
	var data = saved;
	setSize(data[0].length, data.length);
	
	for(var i = 0; i < data.length; i++)
	{
		for(var j = 0; j < data[i].length; j++)
		{
			setTile(j, i, getColor(data[i][j]), data[i][j]);
		}
	}
}

function update()
{
	
}

function input(field)
{
	try
	{
		var data = JSON.parse(field.value);
		
		if(data.constructor === Array && data[0].constructor === Array)
		{
			saved = data;
			generateTiles();
		}
		else
			throw "Your object must be a matrix of at least one row and one column!";
	}
	catch(error) {field.value = error;}
}

// Borrowed //
// http://www.mattlag.com/scripting/hexcolorinverter.php
function invertHex(hexnum){
  if(hexnum.length != 6) {
    console.log("Hex color must be six hex numbers in length.");
    return false;
  }
	
  hexnum = hexnum.toUpperCase();
  var splitnum = hexnum.split("");
  var resultnum = "";
  var simplenum = "FEDCBA9876".split("");
  var complexnum = new Array();
  complexnum.A = "5";
  complexnum.B = "4";
  complexnum.C = "3";
  complexnum.D = "2";
  complexnum.E = "1";
  complexnum.F = "0";
	
  for(i=0; i<6; i++){
    if(!isNaN(splitnum[i])) {
      resultnum += simplenum[splitnum[i]]; 
    } else if(complexnum[splitnum[i]]){
      resultnum += complexnum[splitnum[i]]; 
    } else {
      console.log("Hex colors must only include hex numbers 0-9, and A-F");
      return false;
    }
  }
	
  return resultnum;
}