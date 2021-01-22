module.exports = function(RED) {
	'use strict';

	// Imports:
	const fs = require('fs');


	/**
	 * SBFileNode
	 * SB File node
	 * @param {*} config 
	 */
	function SBFileNode(config) {
		// Init node:
		RED.nodes.createNode(this, config);
		let node = this;

		// Node props:
		this.name = config.name;
		this.unit = parseInt(config.unit);

		// Units:
		this.units = [
			'B',
			'KiB',
			'MiB',
			'GiB',
			'TiB',
			'PiB'
		];

		// On message input event handler:
		this.on('input', function(msg, send, done) {
			if (node.unit < node.units.length) {
				msg.filename = config.filename || msg.filename || '';

				try {
					let file = fs.statSync(msg.filename);
					let ud = Math.pow(2, node.unit * 10);

					if (file.isFile()) {
						msg.payload = {
							units: node.units[node.unit],
							size: file.size / ud
						};

						// Send msg:
						send(msg);
						// Notify done:
						done();
					} else {
						// Trigger Catch node:
						done(msg.filename + ' is not file');
					}
				} catch (error) {
					// Trigger Catch node:
					done(error);
				}
			} else {
				// Trigger Catch node:
				done('Invalid unit index');
			}
		});

		// On node close event handler:
		this.on('close', function(done) {
			// Notify done:
			done();
		});
	}

	// Register node:
	RED.nodes.registerType('sb-file', SBFileNode);
}
