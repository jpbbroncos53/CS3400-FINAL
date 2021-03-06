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
	// Selection routine
	if (!$(this).hasClass('active')) {
		$('.nav > li').removeClass('active');
		$(this).addClass('active');
	}

	// Hide all inputs
	$('.input-group').hide();

	// Show only necessary field for selected equation
	switch ($('.nav > li.active > a').attr('href')) {
		case '#density':
			$('#mass').parent().show(); $('#vol').parent().show();
			break;
		case '#velocity':
			$('#dist').parent().show(); $('#time').parent().show();
			break;
		case '#angvelocity':
			$('#dist').parent().show(); $('#time').parent().show();
			break;
		case '#osc':
			$('#amp').parent().show(); $('#period').parent().show();
			break;
		case '#acc':
			$('#gravity').parent().show();
			break;
		case '#inc':
			$('#angle').parent().show(); $('#disp').parent().show();
			break;
		case '#weight':
			$('#mass').parent().show(); $('#gravity').parent().show();
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
		case '#velocity':
			lin_velocity($('#dist').val(), $('#time').val());
			break;
		case '#angvelocity':
			angvel($('#dist').val(), $('#time').val());
			break;
		case '#osc':
			osc($('#amp').val(), $('#period').val());
			break;
		case '#acc':
			accel($('#gravity').val());
			break;
		case '#inc':
			incline($('#disp').val(), $('#angle').val());
			break;
		case '#weight':
			weight($('#mass').val(), $('#gravity').val());
			break;
	}
}


function weight(mass, gravity)
{
	// Clear canvas first
	layer.destroyChildren();

	// Calculate density
	var weight = mass * gravity;

	// Copy to shade
	var shade = weight;

	// Move shade value to 0 - 255 scale
	if (shade > 100) { shade = 100; }
	if (shade < 0) { shade = 0; }
	shade = 255 - (( shade / 100 ) * 255);

	// Round result to 2 decimal places for display
	weight = Math.round(weight * 100) / 100;

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
			text: 'Weight: ' + weight + 'lbs',
			listening: false,
			fill: 'black'
		});

	// Draw the text
	layer.add(text);

	// Render the stage
	stage.draw();
}

// Calculate an object's oscillation. Shape will
// move back and forth in the center of the stage
// according to its amplitude and period
function osc (amp, per)
{
	// Clear canvas first
	layer.destroyChildren()

	// Create hexagon
	var hexagon = new Kinetic.RegularPolygon({
		x: stage.getWidth() / 2,
		y: stage.getHeight() / 2,
		sides: 6,
		radius: 70,
		fill: 'white',
		stroke: 'black',
		strokeWidth: 2
	});

	// Draw hexagon
	layer.add(hexagon);

	// Save oscillation
	var oscillation = amp / per;

	// Scale up inputs
	amp = amp * 50;
	per = per * 100;

	// Amplitude bounds
	if (amp > (canvasWidth / 2) - 70) { amp = (canvasWidth / 2) - 70; }
	if (amp < 0) { amp = 0; }

	// Create the animation
	var anim = new Kinetic.Animation(function (frame) {

		hexagon.setX(amp * Math.sin(frame.time * Math.PI / per) + (canvasWidth / 2));

	}, layer);

	// Create the text
	var text = new Kinetic.Text({
		x: 0,
		y: 0,
		width: canvasWidth,
		fontSize: 32,
		align: 'center',
		text: 'Oscillation: ' + (Math.round(oscillation * 100) / 100) + 'm/s',
		listening: false,
		fill: 'black'
	});

	// Draw the text
	layer.add(text);

	// Render the stage
	stage.draw();

	// Start the animation
	anim.start();
}

// Calculate an object's angular velocity. Shape
// will rotate at correct speed in the center
// of the canvas
function angvel (radians, sec)
{
	// Clear canvas first
	layer.destroyChildren();		

	// Create the rectangle	
	var rect = new Kinetic.Rect({
		x: canvasWidth / 2,
		y: canvasHeight / 2,
		width: 100,
		height: 2,
		fill: 'white',
		stroke: 'black',
		strokeWidth: 2
	});
				
	// Draw the rectangle
	layer.add(rect);

	// Calculate angular speed
	var angularSpeed = radians/sec;

	// Create the animation
	var anim = new Kinetic.Animation(function(frame) {

		var angleDiff = frame.timeDiff * angularSpeed / 1000;
		rect.rotate(angleDiff);

	}, layer);

	// Create the text
	var text = new Kinetic.Text({
		x: 0,
		y: 0,
		width: canvasWidth,
		fontSize: 32,
		align: 'center',
		text: 'Angular Velocity: ' + (Math.round(angularSpeed * 100) / 100) + 'm/s',
		listening: false,
		fill: 'black'
	});

	// Draw the text
	layer.add(text);

	// Render the stage
	stage.draw();

	// Start the animation
	anim.start();
};
	
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
			text: 'Density: ' + density + 'kg/l',
			listening: false,
			fill: 'black'
		});

	// Draw the text
	layer.add(text);

	// Render the stage
	stage.draw();
}

// Calculate an object's linear velocity. Shape
// will move at correct speed to opposite side
// of the canvas
function lin_velocity (dist, time)
{
	// Clear canvas first
	layer.destroyChildren();

	// Create the rectangle
	var rect = new Kinetic.Rect({
		x: 20,
		y: canvasHeight / 2,
		width: 100,
		height: 50,
		fill: 'white',
		stroke: 'black',
		strokeWidth: 2
	});

	// Draw the rectangle
	layer.add(rect);

	var velocity = dist / time;

	// Create the animation
	var anim = new Kinetic.Animation(function (frame) {

		var moveDist = velocity * (frame.timeDiff / 100);
		if (!((rect.getX() + moveDist) > (canvasWidth - 120))) {
			rect.move(moveDist, 0);
		}

	}, layer);

	// Create the text
	var text = new Kinetic.Text({
		x: 0,
		y: 0,
		width: canvasWidth,
		fontSize: 32,
		align: 'center',
		text: 'Velocity: ' + (Math.round(velocity * 100) / 100) + 'm/s',
		listening: false,
		fill: 'black'
	});

	// Draw the text
	layer.add(text);

	// Render the stage
	stage.draw();

	// Start the animation
	anim.start();
};

function accel (gravity) {

	// Clear canvas first
	layer.destroyChildren();

	var rect = new Kinetic.Rect({
		x: canvasWidth / 2 - 50,
		y: 40,
		width: 100,
		height: 50,
		fill: 'white',
		stroke: 'black',
		strokeWidth: 2
  });

	layer.add(rect);
  stage.add(layer);

	var anim = new Kinetic.Animation(function(frame) {

		var moveDist = gravity * Math.pow(frame.time / 1000, 2);
		if (!((rect.getY() + moveDist) > (canvasHeight - 65))) {
			rect.move(0, moveDist);
		}

	}, layer);

	// Create the text
	var text = new Kinetic.Text({
		x: 0,
		y: 0,
		width: canvasWidth,
		fontSize: 32,
		align: 'center',
		text: 'Acceleration: ' + (Math.round(gravity * 100) / 100) + 'm/s\u00B2',
		listening: false,
		fill: 'black'
	});

	// Draw the text
	layer.add(text);

	anim.start();
};

function incline(displacement, angle)
{
	//window.alert(Math.sin(Math.PI * (angle/180)));
	layer.destroyChildren();
	 var triangle = new Kinetic.Shape({
        	drawFunc: function(context) {
          	context.beginPath();
          	context.moveTo(0, stage.getHeight() - 100);
          	context.lineTo(0, stage.getHeight());
          	context.lineTo(300, stage.getHeight());
          	context.closePath();
          	// KineticJS specific context method
          	context.fillStrokeShape(this);
        	},
        	fill: '#999',
        	stroke: '#999',
        	strokeWidth: 4
      });
	      
		var linearGradCircle = new Kinetic.Circle({
	          x: 35,
	          y: canvasHeight - 140,
	          radius: 50,
	          fillLinearGradientStartPoint: [-25, -25],
	          fillLinearGradientEndPoint: [25, 25],
	          fillLinearGradientColorStops: [0, '#999', 1, 'white'],
	          stroke: 'black',
	          strokeWidth: 4,
	          draggable: true
	        });
      	// add the triangle shape to the layer
      	layer.add(triangle);
        layer.add(linearGradCircle);
        stage.add(layer);

        var angularSpeed = Math.PI / 2;
        var anim = new Kinetic.Animation(function(frame) 
        {
          var angleDiff = frame.timeDiff * angularSpeed / 1000;
          linearGradCircle.rotate(angleDiff);
        }, layer);

        anim.start();

        var anim = new Kinetic.Animation(function(frame) 
        {
        	linearGradCircle.setX(linearGradCircle.getX() + 3);
        	linearGradCircle.setY(linearGradCircle.getY() + 1);
        	if(linearGradCircle.getY() == canvasHeight + 50)
        	{
        		linearGradCircle.setX(35);
        		linearGradCircle.setY(canvasHeight - 140);
        	}
      	}, layer);

    var answer = (Math.sqrt((2)*((9.8)*(Math.sin(Math.PI * (angle/180)))*(displacement)))).toFixed(3);
      	// Create the text
	var text = new Kinetic.Text({
		x: 0,
		y: 0,
		width: canvasWidth,
		fontSize: 32,
		align: 'center',
		text: 'Velocity: ' + answer + 'm/s\u00B2',
		listening: false,
		fill: 'black'
	});

	var text1 = new Kinetic.Text({
		x: 0,
		y: 40,
		width: canvasWidth,
		fontSize: 10,
		align: 'center',
		text: '*Display is just a representation of the function. Input values have no effect on it',
		listening: false,
		fill: 'black'
	});

	// Draw the text
	layer.add(text);
	layer.add(text1);

      anim.start();
};
