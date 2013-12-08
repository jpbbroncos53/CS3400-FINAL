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
		case '#velocity':
			lin_velocity($('#mass').val(), $('#vol').val());
			break;
		case '#angvelocity':
			angvel($('#mass').val(), $('#vol').val());
			break;
		case '#osc':
			osc($('#mass').val(), $('#vol').val());
			break;
		case '#acc':
			accel($('#mass').val());
			break;
		default:
			break;
	}
}

function osc (amp, per) {
	// body...
	layer.destroyChildren()
	 var hexagon = new Kinetic.RegularPolygon({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        sides: 6,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
      });

      layer.add(hexagon);
      stage.add(layer);

      var amplitude = amp;
      var period = per;
      // in ms
      var centerX = stage.getWidth() / 2;

      var anim = new Kinetic.Animation(function(frame) {
        hexagon.setX(amplitude * Math.sin(frame.time * 2 * Math.PI / period) + centerX);
      }, layer);

      anim.start();
	
}

function angvel (radians, sec) {
	// body...

	layer.destroyChildren();		

        var redRect = new Kinetic.Rect({
          x: stage.getWidth()/2,
          y: stage.getHeight()/2,
          width: 100,
          height: 4,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
          
        });

        
        layer.add(redRect);
        stage.add(layer);

        // one revolution per 4 seconds
        //speed in radians/sec, rad/s is 9.55 rpm
        var angularSpeed = radians/sec;
        var anim = new Kinetic.Animation(function(frame) {
          var angleDiff = frame.timeDiff * angularSpeed / 1000;
          redRect.rotate(angleDiff);
        }, layer);

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
      text: 'Density: ' + density,
      listening: false,
      fill: 'black'
    });

	// Draw the text
    layer.add(text);

    // Render the stage
    stage.draw();
}

function lin_velocity (dis, tim) {
	// body...    

	layer.destroyChildren();


       

        /*
         * leave center point positioned
         * at the default which is the top left
         * corner of the rectangle
         */

         
    
        var redRect = new Kinetic.Rect({
          x: 0,
          y: 75,
          width: 100,
          height: 50,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
          
        });

     
        layer.add(redRect);
        stage.add(layer);

        var velocity = dis/tim;
        
        var anim = new Kinetic.Animation(function(frame) {
          
          var currdist=velocity*(frame.time/1000)
          
          redRect.move(currdist,0);
        }, layer);

        var text = new Kinetic.Text({
      x: 0,
      y: 0,
      width: canvasWidth,
      fontSize: 32,
      align: 'center',
      text: 'Velocity: ' + velocity +"m/s",
      listening: false,
      fill: 'black'
    });

	// Draw the text
    layer.add(text);

        anim.start();
      };

  function accel (gravity) {
  	// body...
  	var redRect = new Kinetic.Rect({
       x: 239,
        y: 0,
        width: 100,
        height: 50,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
          
        });

  		layer.add(redRect);
        stage.add(layer);

        // one revolution per 4 seconds
        //speed in radians/sec, rad/s is 9.55 rpm
        
        var anim = new Kinetic.Animation(function(frame) {
        	

        	redRect.setY(0.5 * gravity * Math.pow(frame.time / 1000, 2));

        	 if(redRect.y > canvasHeight- redRect.height / 2) {
          redRect.setY(canvasHeight - redRect.height / 2);
        }
        
          
        }, layer);

        anim.start();
      };

  

