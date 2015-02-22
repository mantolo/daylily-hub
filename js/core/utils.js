var utils;

utils = {
	sortArgs: function(){
	    var args = Array.prototype.slice.call(arguments);
	    return args.sort();
	},

	/**
	 * pad a string with 0 or specific character
	 * @param  {string} n string to be padded
	 * @param  {number} p number of characters to add before n
	 * @param  {string} c optional, charcater used to pad, default 0
	 * @return {string}   padded string
	 */
	paddy: function (n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
	    var pad = new Array(1 + p).join(pad_char);
	    return (pad + n).slice(-pad.length);
	},

	arrayBufferToBinary: function(buffer){
		var bytes = new Uint8Array( buffer );
	    var binary = String.fromCharCode.apply(null, bytes);
	    return binary;
	},

	guid: (function(){
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		return function(){
			return s4() + '-' + s4();
		}
	}()),
};
module.exports = utils;