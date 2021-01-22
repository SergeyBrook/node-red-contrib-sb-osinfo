module.exports = function(RED) {
	'use strict';

	// Imports:
	const os = require('os');


	/**
	 * SBMemoryNode
	 * SB Memory node
	 * @param {*} config 
	 */
	function SBMemoryNode(config) {
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
				let ud = Math.pow(2, node.unit * 10);

				// Values in bytes:
				let tmem = os.totalmem();
				let fmem = os.freemem();
				let umem = tmem - fmem;

				msg.payload = {
					units: node.units[node.unit],
					total: tmem / ud,
					used: umem / ud,
					free: fmem / ud,
					percent: umem / tmem * 100
				};

				// Send msg:
				send(msg);
				// Notify done:
				done();
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
	RED.nodes.registerType('sb-memory', SBMemoryNode);
}
