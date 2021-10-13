var fs = require('fs');
var child_process = require('child_process');
console.log("running in", __dirname);


/***************************************
				Setup
***************************************/
const db = require("./schedule.json")
async function run_script(command, args) {
	console.log("Starting Process.");
	return new Promise(function (resolve, reject) {
		var child = child_process.spawn(command, args);
		var scriptOutput = "";
		child.stdout.setEncoding('utf8');
		child.stdout.on('data', function (data) {
			console.log('O>' + data);
			data = data.toString();
			scriptOutput += data;
		});
		child.stderr.setEncoding('utf8');
		child.stderr.on('data', function (data) {
			console.log('stderr: ' + data);
			data = data.toString();
			scriptOutput += data;
		});
		child.on('close', function (code) {
			return resolve(code);
		});
	})
}
async function run_harvest(app) {
	return await run_script("node", ["app.js", `${app.farm}`, `${app.account}`]);
}
async function run_strategy() {
	for (const app of db) {
		try {
			if (!app.last_harvest) app.last_harvest = 0;
			if ((app.last_harvest + (app.interval * 60 * 1000)) < Date.now()) {
				app.last_harvest = Date.now()
				console.log(`[!] Starting ${app.farm} with ${app.account} interval ${app.interval}min`)
				const exitCode = await run_harvest(app);
				console.log("exitCode", exitCode);
				app.last_harvest = Date.now()
			}
		} catch (err) {
			console.log("Error", err);
		}
	}
}
(async () => {
	await run_strategy();
	setInterval(async () => {
		await run_strategy()
	}, 1 * 60 * 1000)
})()