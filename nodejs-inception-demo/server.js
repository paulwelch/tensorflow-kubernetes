var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {path: '/inception/engine.io'});
var request = require('request');
var grpc = require('grpc');
var tensorflow_serving = grpc.load('proto/prediction_service.proto').tensorflow.serving;
var client = new tensorflow_serving.PredictionService(
  "inception-service:9000", grpc.credentials.createInsecure()
);
var router = express.Router();

//Set up routing for root and /inception paths
router.use(['/', '/inception/'], express.static(__dirname + '/html'));
router.use(['/socket.io/', '/inception/socket.io/'], express.static(__dirname + '/node_modules/socket.io-client/dist/'));
router.get(['/', '/inception/'], function(req, res,next) {
    res.sendFile(__dirname + '/html/image.html');
});
app.use('/inception', router);

//Socket.io connection for browser event communication
io.on('connection', function(client) {
    console.log('Client connected');
    client.on('process', function(data) {
        console.log('Processing image ');
        if( typeof data !== 'undefined') {
          console.log(data.imageUrl);
          classify(data.imageUrl);
        }
    });
});

server.listen(8080, function(){
  console.log('listening on *:8080');
});


function classify(imageUrl) {
  var request = require('request').defaults({ encoding: null });
  request.get(imageUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var buffer = [Buffer(body).toString('base64')];
      var msg = {
        model_spec: { name: 'inception', signature_name: 'predict_images' },
        inputs: {
          images: {
            dtype: 'DT_STRING',
            tensor_shape: {
              dim: {
                size: buffer.length
              }
            },
            string_val: buffer
          }
        }
      };

      client.predict(msg, (err, response) => {
        if (err) console.log(err);

        var classes = response.outputs.classes.string_val.map((b) => b.toString('utf8'));

        var i,
            len = classes.length,
            chunk = 5,
            results = [];
        for (i = 0; i < len; i+=chunk) {
          results.push(classes.slice(i, i+chunk));
        }

        console.log("Results: " + results.toString())
        var firstResult = String(results).substr(0, String(results).indexOf(','));
        io.emit('results', firstResult);
      });

    }
  });
}
