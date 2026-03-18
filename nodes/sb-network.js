module.exports = function(RED) {
	'use strict';

	// Imports:
	const os = require('os');


	/**
	 * SBNetworkNode
	 * SB Network node
	 * @param {*} config 
	 */
	function SBNetworkNode(config) {
		// Init node:
		RED.nodes.createNode(this, config);
		let node = this;

		// Node props:
		this.name = config.name;
		this.interface = config.interface.trim();
		this.family = config.family;

		// On message input event handler:
		this.on('input', function(msg, send, done) {
			if (node.interface.length > 0) {
				const interfaces = os.networkInterfaces();

				if (interfaces.hasOwnProperty(node.interface)) {
					for (let i = 0; i < interfaces[node.interface].length; i++) {
						if (interfaces[node.interface][i].family == node.family) {
							msg.payload = interfaces[node.interface][i];
							break;
						}
					}

					// Send msg:
					send(msg);
					// Notify done:
					done();
				} else {
					// Trigger Catch node:
					done('Invalid interface name');
				}
			} else {
				// Trigger Catch node:
				done('Invalid interface name');
			}
		});

		// On node close event handler:
		this.on('close', function(done) {
			// Notify done:
			done();
		});
	}

	// Register node:
	RED.nodes.registerType('sb-network', SBNetworkNode);
}
