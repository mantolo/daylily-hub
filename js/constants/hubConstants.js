var keyMirror = require('keyMirror');
var hubConstants = keyMirror({
	HUB_SERVER_NEWS: null,
	HUB_SYNC_ONLINE_USER: null,
	HUB_USER_ONLINE: null,
	HUB_USER_OFFLINE: null,
	HUB_USER_OTO_MSG: null, // one to one
	HUB_USER_BROADCAST: null // one to many
});

module.exports = hubConstants;