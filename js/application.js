// Create the stage using the container height & width
var stage = new Kinetic.Stage({
	container: 'canvas-div',
	width: $('#canvas-div').width(),
	height: $('#canvas-div').height()
});

// Create a new layer and add it to the stage
var layer = new Kinetic.Layer();
stage.add(layer);

// Add border to the canvas
$('.kineticjs-content').css('border', '1px solid #eee');