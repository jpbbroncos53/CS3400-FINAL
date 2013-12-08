/************************************************
 *
 *		MAIN
 */

// Canvas width and height for positioning elements
var canvasWidth = $('#canvas-div').width();
var canvasHeight = $('#canvas-div').height();

// Create the stage using the container height & width
var stage = new Kinetic.Stage({
	container: 'canvas-div',
	width: canvasWidth,
	height: canvasHeight
});

// Create a new layer and add it to the stage
var layer = new Kinetic.Layer();
stage.add(layer);

// Add border to the canvas
$('.kineticjs-content').css('border', '1px solid #eee');

/************************************************
 *
 *		INPUT CALLBACKS
 */

// Handle selection on the navbar
$('.nav > li').click(function () {
	if (!$(this).hasClass('active')) {
		$('.nav > li').removeClass('active');
		$(this).addClass('active');
	}
});

// Handle form button
$('#calc').click(function () {
	calculate();
});

// Handle enter key pressed (just calls button event)
$('.form-control').keyup(function (event) {
    if (event.keyCode == 13) {
        $('#calc').click();
    }
});

/************************************************
 *
 *		FUNCTIONS
 */

// Select the active navbar element to determine
// which equation is being calculated
function calculate ()
{
	switch ($('.nav > li.active > a').attr('href')) {
		case '#density':
			density($('#mass').val(), $('#vol').val());
			break;
		default:
			break;
	}
}

// Calculate an object's density. Shade scale is
// based on values from 0 (rare) to 100 (dense)
function density (mass, volume)
{
	// Clear canvas first
	layer.destroyChildren();

	// Calculate density
	var density = mass / volume;

	// Copy to shade
	var shade = density;

	// Move shade value to 0 - 255 scale
	if (shade > 100) { shade = 100; }
	if (shade < 0) { shade = 0; }
	shade = 255 - (( shade / 100 ) * 255);

	// Round result to 2 decimal places for display
	density = Math.round(density * 100) / 100;

	// Create a circle
	var circle = new Kinetic.Circle({
		x: canvasWidth / 2,
		y: canvasHeight / 2,
		radius: 40,
		fillRGB: {r: shade, g: shade, b: shade},
		stroke: 'black',
		strokeWidth: 2
	});

	// Draw the circle
	layer.add(circle);

	// Create the text
	var text = new Kinetic.Text({
      x: 0,
      y: 0,
      width: canvasWidth,
      fontSize: 32,
      align: 'center',
      text: 'Density: ' + density,
      listening: false,
      fill: 'black'
    });

	// Draw the text
    layer.add(text);

    // Render the stage
    stage.draw();
}
