
var net = require('net');
var http = require('http');
var proxy = http.createServer(httpHandle);//http.createServer(httpHandle);
var io = require('socket.io')(proxy); 
var url = require('url');
var network = require('./js/core/network');

var listenPort = 80;
var forwardTo = {
	host: '127.0.0.1',
	port: 81	
};

function httpHandle(req, res) {
	var newreq;
  	// make a request to a tunneling proxy
	var options = {
		port: listenPort,
		hostname: '127.0.0.1',
		method: 'CONNECT',
		path: forwardTo.host + ':' + forwardTo.port +  req.url
	};

	newreq = http.request(options);
	newreq.end();
	// ON TUNNEL CONNECT
	newreq.on('error', function(e){ console.log('error', e); res.end(); });
	newreq.on('connect', function(res2, socket, head) {
	    // make a request over an HTTP tunnel
	    socket.write('GET '+ req.url +' HTTP/1.1\r\n' +
	                 'Host: '+ forwardTo.host + ':' + forwardTo.port +'\r\n' +
	                 'Connection: close\r\n' +
	                 '\r\n');
	    socket.on('data', function(chunk) {	      
	      res.socket.write(chunk);
	    });

	    socket.on('end', function() {
	      	res.end();
	      	socket.close();	 
    	});
  	});

}

// Create an HTTP tunneling proxy on server 
proxy.on('connect', function(req, cltSocket, head) {
  // connect to an origin server
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

// Socket IO hook
io.on('connection', function (socket) {
	console.log('SOCKET.IO', 'CONNECTED');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

