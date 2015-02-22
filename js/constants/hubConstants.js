var keyMirror = require('keyMirror');
var hubConstants = keyMirror({

	HUB_I_AM: null, /// user tell server who user is	
	HUB_YOU_ARE: null, /// server tell user who he is

	HUB_I_AM_TYPING: null, /// user tell server he is typing for someone
	HUB_USER_TYPING: null, /// server tell user someone is typing

	HUB_SERVER_NEWS: null,
	HUB_SERVER_ROOMS: null,
	
	HUB_USER_SYNC: null,
	HUB_USER_ON: null,
	HUB_USER_OFF: null,

	HUB_I_SEND_MSG: null,
	HUB_I_EDIT_MSG: null,
	HUB_USER_MSG: null, // one to one
	HUB_USER_EDIT_MSG: null,
	//HUB_USER_BROADCAST: null, // one to many

	HUB_I_PUT_FILE: null,	
	HUB_USER_FILE_TRANSFER: null,

	HUB_USER_PROFILE_UPDATE: null,

	HUB_DISCONNECT: null
});

module.exports = hubConstants;