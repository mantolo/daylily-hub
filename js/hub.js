var constants = require('./constants/hubConstants');
/**
 * Hub component for Socket.IO
 * @param  {[type]}
 * @return {[type]}
 */
module.exports = (function(){
	var io,
	clients = {};
	cidArr = [];

	return function(inIO){
		if (!inIO){
			return clients;
		}

		io = inIO;

		// Socket IO hook
		io.on('connection', function (socket) {
			var id = Date.now();
			console.log('NEW USER', id);			

			clients[id] = {
				id: id,
				socket: socket
			};

			// tell other clients
			io.emit(constants.HUB_USER_ONLINE, {id: id});

			// tell new client
			socket.emit(constants.HUB_SERVER_NEWS, { hello: 'world' });

			socket.on(constants.HUB_USER_OTO_MSG, function (data) {
				console.log(data);
			});

			socket.on(constants.HUB_USER_BROADCAST, function(data){
				console.log(id, 'broadcasting', data);
				io.emit(constants.HUB_USER_BROADCAST, data);
			})

			//// Handle offline
			socket.on('disconnect', function(){
				console.log('USER OFF', id);
				io.emit(constants.HUB_USER_OFFLINE, {});

				delete cidArr[cidArr.indexOf(id)];
				delete clients[id];
			});

			socket.emit(constants.HUB_SYNC_ONLINE_USER, cidArr);

			cidArr.push(id);
		});

		return false;
	};
}());