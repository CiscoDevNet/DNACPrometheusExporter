'use strict';

const express = require('express');
const cluster = require('cluster');
const server = express();
const client = require('prom-client');
const register = client.register;
const DNAC = require('./DNAC');
const CONFIG = require('./DNAC_USER_CONFIG');

console.log(CONFIG.ip);
console.log(CONFIG.user);
console.log(CONFIG.passwd);

let dnac = new DNAC({
    host: 'https://' + CONFIG.ip,
    username: CONFIG.user,
    password: CONFIG.passwd

});

// Test Code to enable for troubleshooting DNAC interface helper
//dnac.getSites(function(sites) {
//console.log(JSON.stringify(sites));	
//});

const Histogram = client.Histogram;
const h = new Histogram({
	name: 'test_histogram',
	help: 'Example of a histogram',
	labelNames: ['code']
});

const Counter = client.Counter;
const c = new Counter({
	name: 'test_counter',
	help: 'Example of a counter',
	labelNames: ['code']
});

const Gauge = client.Gauge;

const nd = new client.Gauge({
	name: 'dnac_network_device_count',
	help: 'Network Device Count'
});

setInterval(() => {
	dnac.getNetworkDevicesCount(function(networkDevices) {
//		console.log(JSON.stringify(networkDevices));
		console.log("Collected network device count: " + networkDevices.response);
		nd.set(networkDevices.response);
	});
}, 3000);

const st = new client.Gauge({
	name: 'dnac_site_count',
	help: 'Site Count'
});

setInterval(() => {
	dnac.getSitesCount(function(siteCountResp) {
		console.log("Collected site count: " + siteCountResp.response);
		st.set(siteCountResp.response);
	});
}, 3000);


const g = new Gauge({
	name: 'test_gauge',
	help: 'Example of a gauge',
	labelNames: ['method', 'code']
});

setTimeout(() => {
	h.labels('200').observe(Math.random());
	h.labels('300').observe(Math.random());
}, 10);

setInterval(() => {
	c.inc({ code: 200 });
}, 5000);

setInterval(() => {
	c.inc({ code: 400 });
}, 2000);

setInterval(() => {
	c.inc();
}, 2000);

setInterval(() => {
	g.set({ method: 'get', code: 200 }, Math.random());
	g.set(Math.random());
	g.labels('post', '300').inc();
}, 100);

server.get('/metrics', (req, res) => {
	res.set('Content-Type', register.contentType);
	res.end(register.metrics());
});

server.get('/metrics/counter', (req, res) => {
	res.set('Content-Type', register.contentType);
	res.end(register.getSingleMetricAsString('test_counter'));
});

//Enable collection of default metrics
client.collectDefaultMetrics();

console.log('Server listening to 9000, metrics exposed on /metrics endpoint');
server.listen(9000);
