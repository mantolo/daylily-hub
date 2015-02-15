
var net = require('net');
var http = require('http');
var proxy = http.createServer(httpHandle);
var io = require('socket.io')(proxy); 
var url = require('url');
var hub = require('./js/hub');

var listenPort = 80;
var forwardTo = { //// origin server setting
	host: '127.0.0.1',
	port: 81	
};

var requestOptions = {
	port: listenPort,
	hostname: '127.0.0.1',
	method: 'CONNECT'
};

function httpHandle(req, res) {
	// make a request to tunneling proxy
	var newreq;

	requestOptions.path = forwardTo.host + ':' + forwardTo.port +  req.url;

	newreq = http.request(requestOptions);	
	newreq.on('error', function(e){ console.log('error', e); res.end(); });
	newreq.on('connect', function(res2, socket, head) {
	    // make a request over an HTTP tunnel
	    socket.write(req.method + ' '+ req.url +' HTTP/1.1\r\n' +
	                 'Host: '+ forwardTo.host + ':' + forwardTo.port +'\r\n' +
	                 'Connection: close\r\n' +
	                 '\r\n');
	    socket.on('data', function(chunk) {	      
	      res.socket.write(chunk);
	    });

	    socket.on('end', function() {
	      	res.end();
	      	socket.end();	 
    	});
  	});
  	newreq.end();
}

//// HTTP tunneling handling (server side) 
proxy.on('connect', function(req, cltSocket, head) {
  // Target: connect to an origin server, pipe two streams
  console.log('REQUEST', req.url);
  var srvUrl = url.parse('http://' + req.url);
  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function() {
  	/// tell proxy client
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node-Proxy\r\n' +
                    '\r\n');
    // tell origin
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});

// now that proxy is running
proxy.listen(listenPort, '127.0.0.1', function() {
	console.log('started listening');
});

/// Bridge Socket IO to other module for handling
hub(io);

