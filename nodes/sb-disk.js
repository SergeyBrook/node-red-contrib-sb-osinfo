module.exports = function(RED) {
	'use strict';

	// Imports:
	const diskInfo = require('node-disk-info');


	/**
	 * SBDiskNode
	 * SB Disk node
	 * @param {*} config 
	 */
	function SBDiskNode(config) {
		// Init node:
		RED.nodes.createNode(this, config);
		let node = this;

		// Node props:
		this.name = config.name;
		this.unit = parseInt(config.unit);
		this.local = config.local;

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
				try {
					let disks = diskInfo.getDiskInfoSync();
					let ud = Math.pow(2, node.unit * 10);

					msg.payload = [];
					disks.forEach(function(disk) {
						if (!node.local || node.local && disk.filesystem == 'Local Fixed Disk') {
							msg.payload.push({
								type: disk.filesystem,
								mount: disk.mounted,
								units: node.units[node.unit],
								total: disk.blocks / ud,
								used: disk.used / ud,
								free: disk.available / ud,
								percent: disk.used / disk.blocks * 100
							});
						}
					});

					// Send msg:
					send(msg);
					// Notify done:
					done();
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
	RED.nodes.registerType('sb-disk', SBDiskNode);
}
