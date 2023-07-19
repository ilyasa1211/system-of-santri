"use strict";
module.exports = function trimAllBody(request) {
	for (const [key, value] of Object.entries(request.body)) {
		request.body[key] = value.trim();
	}
};
