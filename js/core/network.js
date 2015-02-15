var Promise = require('es6-promise').Promise;
var http = require('http');
var net = require('net');

var network = {

	tcp: function(){

		return new Promise(function(resolve, reject){
			net.connect();
		});
	},
	request: function(){

	}
};

module.exports = network;