<!DOCTYPE HTML>
<html>
  <head>
    <style>
      body {
        margin: 0px;
        padding: 0px;
      }
      canvas {
        border: 1px solid #9C9898;
      }
    </style>
  </head>
  <body>
    <div id="container"></div>
    <script src="http://d3lp1msu2r81bx.cloudfront.net/kjs/js/lib/kinetic-v4.7.4.min.js"></script>
    <script defer="defer">
      window.onload = function() {
        var stage = new Kinetic.Stage({
          container: 'container',
          width: 578,
          height: 200
        });
        var layer = new Kinetic.Layer();

        /*
         * leave center point positioned
         * at the default which is the top left
         * corner of the rectangle
         */
        var blueRect = new Kinetic.Rect({
          x: 50,
          y: 75,
          width: 100,
          height: 50,
          fill: '#00D2FF',
          stroke: 'black',
          strokeWidth: 4
        });

        /*
         * move center point to the center
         * of the rectangle with offset
         */
        var yellowRect = new Kinetic.Rect({
          x: 220,
          y: 75,
          width: 100,
          height: 50,
          fill: 'yellow',
          stroke: 'black',
          strokeWidth: 4,
          offset: [50, 25]
        });

        /*
         * move center point outside of the rectangle
         * with offset
         */
        var redRect = new Kinetic.Rect({
          x: 400,
          y: 75,
          width: 100,
          height: 50,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
          offset: [-100, 0]
        });

        layer.add(blueRect);
        layer.add(yellowRect);
        layer.add(redRect);
        stage.add(layer);

        // one revolution per 4 seconds
        //speed in radians/sec, rad/s is 9.55 rpm
        var angularSpeed = 15/9.55;
        var anim = new Kinetic.Animation(function(frame) {
          var angleDiff = frame.timeDiff * angularSpeed / 1000;
          blueRect.rotate(angleDiff);
          yellowRect.rotate(angleDiff);
          redRect.rotate(angleDiff);
        }, layer);

        anim.start();
      };
    </script>
  </body>
</html>