var constants = require('./constants/hubConstants');
var Promise = require('es6-promise').Promise;
var map = require('lodash/collection/map');
var room = require('./core/room');
var utils = require('./core/utils');

var defaultRoomName = 'all';

/**
 * Hub component for Socket.IO
 * @param  {[type]}
 * @return {[type]}
 */
module.exports = (function(){
	var io,
	clients = {},
	users = [];

	function updateUsers(){
		users = map(clients, function(v){
			return {
				uid: v.uid,
				name: v.name,
				sid: v.socket.id,
				onlineSince: v.onlineSince
			}; 
		});	
	}

	function doAuth(socket){
		var onClientIdentify;
		var uid;
		var client;
		var onlineSince = Date.now();
		var firstCall = true;
		return new Promise(function(resolve, reject){
			onClientIdentify = function (data){		
				/// Only start informing others about this client after receving I am evetns
				client = clients[data.uid] = { // create client, base on client provide info
					uid: data.uid || uid || utils.guid(),
					name: data.name, 
					onlineSince: onlineSince,
					socket: socket
				};

				uid = client.uid;

				if(firstCall){
					// tell other users some one has online
					socket.broadcast.emit(constants.HUB_USER_ON, {
						uid: uid,
						name: client.name,
						onlineSince: onlineSince
					});	
					firstCall = false;
				} else {
					socket.broadcast.emit(constants.HUB_USER_PROFILE_UPDATE, { uid:uid, name: data.name });
				}			

				socket.emit(constants.HUB_YOU_ARE, { uid: uid, name: data.name });

				resolve(client);
			};
			socket.on(constants.HUB_I_AM, onClientIdentify);
		});
	}

	function clientInit(client){
		var uid = client.uid;
		var socket = client.socket;
		// tell new client
		socket.emit(constants.HUB_SERVER_NEWS, { hello: 'world' });
		socket.on(constants.HUB_I_SEND_MSG, function (data) {
			data.mid = Date.now();
			data.from = clients[uid].name;
			//room.exist(id, recp)
			//io.sockets.in(recp).emit(constants.HUB_USER_MSG, data);			
			io.sockets.in(data.to).emit(constants.HUB_USER_MSG, data);
		});		

		// sync about users
		socket.emit(constants.HUB_USER_SYNC, { users: users });
		
		updateUsers();

		//// Handle offline
		socket.on('disconnect', function(){
			io.emit(constants.HUB_USER_OFF, {uid: uid});

			delete clients[uid];

			updateUsers();				
			console.log('USER OFF', socket.id);
		});

		return Promise.resolve(client);
	}

	return function(inIO){
		if (!inIO){
			return clients;
		}

		io = inIO;

		// Socket IO hook
		io.on('connection', function (socket) {
			var id = socket.id;
			console.log('NEW USER', id);

			doAuth(socket).then(clientInit);			

			socket.join(defaultRoomName); // join default room			
		});

		return false;
	};
}());

// // send to current request socket client
//  socket.emit('message', "this is a test");

//  // sending to all clients, include sender
//  io.sockets.emit('message', "this is a test");

//  // sending to all clients except sender
//  socket.broadcast.emit('message', "this is a test");

//  // sending to all clients in 'game' room(channel) except sender
//  socket.broadcast.to('game').emit('message', 'nice game');

//   // sending to all clients in 'game' room(channel), include sender
//  io.sockets.in('game').emit('message', 'cool game');

//  // sending to individual socketid
//  io.sockets.socket(socketid).emit('message', 'for your eyes only');